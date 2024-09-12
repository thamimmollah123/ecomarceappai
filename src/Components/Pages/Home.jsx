import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/human-picture-girl.png'; // Base image with human figure
import kurti1 from '../Assets/frock1.png'; // Default clothing image (frock1.png)
import redkurti from '../Assets/red.png';
import blackkurti from '../Assets/black.png';
import Nav from './Nav';
import WebcamCapture from './WebcamCapture'; // Import WebcamCapture component

const Home = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage); // Combined image (humanBaseImage + clothing + captured face)
  const [selectedKurti, setSelectedKurti] = useState(kurti1); // Set default clothing to 'frock1'
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
            // Adjust these to make the face smaller and move it to the right
            const faceWidth = img.width * 0.10;  // Reduce width to 10% of the base image width
            const faceHeight = img.height * 0.09; // Reduce height to 9% of the base image height
            
            // Move faceXPos more to the right by increasing this value
            const faceXPos = img.width * 0.45; // Adjust X position to the right side
            const faceYPos = img.height * 0.09; // Move the face UP by reducing Y position (smaller value moves it up)
            
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
    };
  };

  // Automatically set frock1 (kurti1) as the default dress when the component mounts
  useEffect(() => {
    updateCanvas(kurti1, 0.47, 0.5, 0.269, 0.21); // Update canvas with frock1 by default
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedKurti(clothingImageSrc); // Set the selected kurti
    updateCanvas(clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor); // Update the canvas
  };

  return (
    <>
      <Nav />

      <div className="home">
        <div className='container-home'>

          {/* Webcam Capture Component added to the left side */}
          <div className="webcam-container" style={{ float: 'left', marginRight: '20px' }}>
            <WebcamCapture onCapture={handleCapture} />
          </div>

          {/* Dress selection buttons */}
          <div className="jersey-selection">
            <button
              onClick={() => handleImageClick(kurti1, 0.47, 0.5, 0.269, 0.21)} 
              className={`jersey-btn ${selectedKurti === kurti1 ? 'selected' : ''}`}
            >
              <img src={kurti1} alt="Frock 1" className="toggle-image" />
            </button><br />
            <button
              onClick={() => handleImageClick(redkurti, 0.69, 0.5, 0.15, 0.199)} 
              className={`jersey-btn ${selectedKurti === redkurti ? 'selected' : ''}`}
            >
              <img src={redkurti} alt="Red Kurti" className="toggle-image" />
            </button><br />
            <button
              onClick={() => handleImageClick(blackkurti, 0.57, 0.5, 0.199, 0.14)} 
              className={`jersey-btn ${selectedKurti === blackkurti ? 'selected' : ''}`}
            >
              <img src={blackkurti} alt="Black Dress" className="toggle-image" />
            </button>
          </div>

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

export default Home;
