import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/model-posing.png'; // Base image with human figure
import YellowDress from '../Assets/YellowDress.png'; // Clothing image with transparent background
import blackshort from '../Assets/blackshort.png';
import whitefrock from '../Assets/whitefrock.png';
import Nav from './Nav';
import WebcamCapture from './WebcamCapture'; // Import WebcamCapture component

const Healthy = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [selectedKurti, setSelectedKurti] = useState(null); // No default selected dress
  const [capturedImageSrc, setCapturedImageSrc] = useState(null); // Store captured face image
  const outputCanvasRef = useRef(null);

  // Handle webcam image capture
  const handleCapture = (capturedImageSrc) => {
    setCapturedImageSrc(capturedImageSrc); 
  };

  useEffect(() => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = humanBaseImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw selected dress if any
      if (selectedKurti) {
        const clothingImg = new Image();
        clothingImg.src = selectedKurti.src;
        clothingImg.onload = () => {
          const width = img.width * selectedKurti.widthFactor;
          const height = img.height * selectedKurti.heightFactor;
          const xPos = img.width * selectedKurti.xPosFactor;
          const yPos = img.height * selectedKurti.yPosFactor;

          ctx.drawImage(clothingImg, xPos, yPos, width, height);

          // If a face has been captured, overlay the captured face on the base image
          if (capturedImageSrc) {
            const capturedImg = new Image();
            capturedImg.src = capturedImageSrc;
            capturedImg.onload = () => {
              // Adjust these values to place the face in the desired position
              const faceWidth = img.width * 0.14;  // 10% of base image width
              const faceHeight = img.height * 0.10; // 9% of base image height
              const faceXPos = img.width * 0.45; // Adjust to move face right/left
              const faceYPos = img.height * 0.08; // Adjust to move face up/down

              // Draw the smaller face image onto the canvas
              ctx.drawImage(capturedImg, 0, 0, capturedImg.width, capturedImg.height, faceXPos, faceYPos, faceWidth, faceHeight);

              setFinalImageSrc(canvas.toDataURL());
            };
          } else {
            setFinalImageSrc(canvas.toDataURL()); // Just the base image and dress
          }
        };
      } else {
        setFinalImageSrc(canvas.toDataURL()); // Just the base image if no clothing selected
      }
    };
  }, [selectedKurti, capturedImageSrc]); // Re-run when selectedKurti or capturedImageSrc changes

  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedKurti({ src: clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor });
  };

  return (
    <>
      <Nav />

      <div className="home">
        {/* Webcam Capture Component */}
        <div className="webcam-container" style={{ float: 'left', marginRight: '20px' }}>
          <WebcamCapture onCapture={handleCapture} />
        </div>

        {/* Dress selection buttons */}
        <div className="jersey-selection">
          <button
            onClick={() => handleImageClick(YellowDress, 1.0, 0.678, 0.12, 0.13)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === YellowDress ? 'selected' : ''}`}
          >
            <img src={YellowDress} alt="Yellow Dress" className="toggle-image" />
          </button><br />
          <button
            onClick={() => handleImageClick(blackshort, 0.65, 0.64, 0.25, 0.12)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === blackshort ? 'selected' : ''}`}
          >
            <img src={blackshort} alt="Black Short" className="toggle-image" />
          </button><br />
          <button
            onClick={() => handleImageClick(whitefrock,  0.65, 0.6, 0.29, 0.15)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === whitefrock ? 'selected' : ''}`}
          >
            <img src={whitefrock} alt="White Frock" className="toggle-image" />
          </button>
        </div>

        {/* Canvas with human figure, dress, and optional captured face */}
        <div className="product-card">
          <div className="product-image-container">
            <img
              src={finalImageSrc}
              alt="Human Figure"
              className="product-image"
            />
            <canvas ref={outputCanvasRef} style={{ display: 'none' }}></canvas>
          </div>
        </div>

        <div className="text-container">
          <p className="title">VIRTUAL DRESSING ROOM</p>
          <h1 className="paragraph">One-size-fits-all <br/> doesn’t work for <br/> fashion. Or eCommerce <br/> models</h1>
          <p className='paragraph-virtual'>Virtual Dressing Room solves one of the biggest hassle in<br/> online fashion shopping. Help your shoppers view <br/> products on models that are most similar to them.</p>
        </div>
      </div>
    </>
  );
};

export default Healthy;
