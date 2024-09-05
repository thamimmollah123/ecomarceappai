import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/human-picture-girl.png'; // Base image with human figure
import kurti1 from '../Assets/frock1.png'; // Clothing image with transparent background
import redkurti from '../Assets/red.png';
import blackkurti from '../Assets/black.png';
import Nav from './Nav';

const Home = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [selectedKurti, setSelectedKurti] = useState(null);
  const outputCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = humanBaseImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedKurti(clothingImageSrc); // Set the selected kurti

    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw the base image first
    const baseImg = new Image();
    baseImg.src = humanBaseImage;
    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      ctx.drawImage(baseImg, 0, 0);

      // Draw the clothing image on top
      const clothingImg = new Image();
      clothingImg.src = clothingImageSrc;
      clothingImg.onload = () => {
        // Adjust the width and height based on the provided factors
        const width = baseImg.width * widthFactor;   // Stretch horizontally
        const height = baseImg.height * heightFactor; // Keep height proportional or adjust as needed

        // Adjust the x and y position based on the provided factors
        const xPos = baseImg.width * xPosFactor;
        const yPos = baseImg.height * yPosFactor;

        ctx.drawImage(clothingImg, xPos, yPos, width, height);

        // Update the final image source to the combined image
        setFinalImageSrc(canvas.toDataURL());
      };
    };
  };

  return (
    <>
      <Nav />

      <div className="home">
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
            <img src={redkurti} alt="Red" className="toggle-image" />
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

        <div className="text-container">
          <p className="title">VIRTUAL DRESSING ROOM</p>
          <h1 className="paragraph">One-size-fits-all <br/> doesn’t work for <br/> fashion. Or eCommerce <br/> models</h1>
          <p className='paragraph-virtual'>Virtual Dressing Room solves one of the biggest hassle in<br/> online fashion shopping. Help your shoppers view <br/> products on models that are most similar to them.</p>
        </div>
      </div>
    </>
  );
};

export default Home;
