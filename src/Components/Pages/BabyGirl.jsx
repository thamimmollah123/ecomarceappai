import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/babygirl.png'; // Base image with human figure
import redfrock from '../Assets/redfrock.png'; // Clothing image with transparent background
import blacktop from '../Assets/blacktop.png';
import yellowfrock from '../Assets/yellowfrock.png';
import Nav from './Nav';
import WebcamCapture from './WebcamCapture'; // Import WebcamCapture component

const BabyGirl = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [selectedKurti, setSelectedKurti] = useState(null); // No default selected dress
  const [capturedImageSrc, setCapturedImageSrc] = useState(null); // Store captured face image
  const outputCanvasRef = useRef(null);

   // Dynamic content for text with explicit <br/> tags
   const [textContent, setTextContent] = useState({
    title: "VIRTUAL DRESSING ROOM",
    heading: "One-size-fits-all <br/> doesn’t work for <br/> fashion. Or eCommerce <br/> models",
    description: "Virtual Dressing Room solves one of the biggest hassle in<br/> online fashion shopping. Help your shoppers view <br/> products on models that are most similar to them."
  });

  // Handle webcam image capture
  const handleCapture = (capturedImageSrc) => {
    setCapturedImageSrc(capturedImageSrc); 
  };

  // Update canvas with base image, selected clothing, and captured face (if available)
  const updateCanvas = (clothingImage, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing anything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = humanBaseImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the human base image
      ctx.drawImage(img, 0, 0);

      // Draw the selected clothing
      if (clothingImage) {
        const clothingImg = new Image();
        clothingImg.src = clothingImage;
        clothingImg.onload = () => {
          const width = img.width * widthFactor;
          const height = img.height * heightFactor;
          const xPos = img.width * xPosFactor;
          const yPos = img.height * yPosFactor;

          ctx.drawImage(clothingImg, xPos, yPos, width, height);

          // If a face has been captured, overlay the captured face on the base image
          if (capturedImageSrc) {
            const capturedImg = new Image();
            capturedImg.src = capturedImageSrc;
            capturedImg.onload = () => {
              // Adjust these values to place the face in the desired position
              const faceWidth = img.width * 0.13;  // 10% of base image width
              const faceHeight = img.height * 0.10; // 9% of base image height
              const faceXPos = img.width * 0.43; // Adjust to move face right/left
              const faceYPos = img.height * 0.11; // Adjust to move face up/down

              // Draw the smaller face image onto the canvas
              ctx.drawImage(capturedImg, 0, 0, capturedImg.width, capturedImg.height, faceXPos, faceYPos, faceWidth, faceHeight);

              // Update the final image source with the combined image
              setFinalImageSrc(canvas.toDataURL());
            };
          } else {
            // Update the final image source with just the base and clothing
            setFinalImageSrc(canvas.toDataURL());
          }
        };
      } else {
        setFinalImageSrc(canvas.toDataURL()); // Just base image if no clothing selected
      }
    };
  };

  // Update the canvas when a dress is selected or a face is captured
  useEffect(() => {
    if (selectedKurti) {
      updateCanvas(selectedKurti.src, selectedKurti.widthFactor, selectedKurti.heightFactor, selectedKurti.xPosFactor, selectedKurti.yPosFactor);
    }
  }, [selectedKurti, capturedImageSrc]); // Re-run when selectedKurti or capturedImageSrc changes

  // Handle dress selection
  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedKurti({ src: clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor });
  };

  return (
    <>
      <Nav />

      <div className="home">
        <div className="container-home">
          {/* Webcam Capture Component */}
          <div className="webcam-container" style={{ float: 'left', marginRight: '20px' }}>
            <WebcamCapture onCapture={handleCapture} />
          </div>

          {/* Dress selection buttons */}
          <div className="jersey-selection">
            <button
              onClick={() => handleImageClick(redfrock, 0.8, 0.5, 0.11, 0.23)} 
              className={`jersey-btn ${selectedKurti && selectedKurti.src === redfrock ? 'selected' : ''}`}
            >
              <img src={redfrock} alt="Red Frock" className="toggle-image" />
            </button><br />
            <button
              onClick={() => handleImageClick(blacktop, 0.8, 0.7, 0.17, 0.14)} 
              className={`jersey-btn ${selectedKurti && selectedKurti.src === blacktop ? 'selected' : ''}`}
            >
              <img src={blacktop} alt="Black Top" className="toggle-image" />
            </button><br />
            <button
              onClick={() => handleImageClick(yellowfrock, 0.58, 0.5, 0.21, 0.18)} 
              className={`jersey-btn ${selectedKurti && selectedKurti.src === yellowfrock ? 'selected' : ''}`}
            >
              <img src={yellowfrock} alt="Yellow Frock" className="toggle-image" />
            </button>
          </div>

          {/* Canvas with human figure and selected dress */}
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
        </div>

        {/* Text container */}
         {/* Text container with dynamic content and line breaks */}
         <div className="text-container">
          <p className="title">{textContent.title}</p>
          <h1 className="paragraph" dangerouslySetInnerHTML={{ __html: textContent.heading }}></h1>
          <p className="paragraph-virtual" dangerouslySetInnerHTML={{ __html: textContent.description }}></p>
        </div>
      </div>
     
    </>
  );
};

export default BabyGirl;
