import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Men.css';
import humanBaseImage from '../Assets/male-beauty.png'; // Base image with human figure
import hoodie from '../Assets/hoodie.png'; // Clothing image with transparent background
import shorts from '../Assets/casual-men-short-pants.png'; // Another clothing image with transparent background
//import black from '../Assets/black.png'; // New clothing image
//import gaun from '../Assets/gaun.png';
import Nav from './Nav';

const Men = () => {
  const [clothingImages, setClothingImages] = useState([]); // Array to store selected clothing images
  const outputCanvasRef = useRef(null);

  useEffect(() => {
    drawCanvas();
  }, [clothingImages]); // Re-draw the canvas every time a new clothing image is added

  // Function to draw the base image and all selected clothing images
  const drawCanvas = () => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const baseImg = new Image();
    baseImg.src = humanBaseImage;

    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      ctx.drawImage(baseImg, 0, 0);

      // Draw each clothing image on top of the base image
      clothingImages.forEach((clothingItem) => {
        const clothingImg = new Image();
        clothingImg.src = clothingItem.src;
        clothingImg.onload = () => {
          const width = baseImg.width * clothingItem.widthFactor;
          const height = baseImg.height * clothingItem.heightFactor;
          const xPos = baseImg.width * clothingItem.xPosFactor;
          const yPos = baseImg.height * clothingItem.yPosFactor;
          ctx.drawImage(clothingImg, xPos, yPos, width, height);
        };
      });
    };
  };

  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    console.log("Clothing item clicked:", clothingImageSrc); // Log the clothing item clicked
    const newClothingItem = { src: clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor };
    setClothingImages((prevImages) => [...prevImages, newClothingItem]); // Add the new clothing image to the state
  };

  return (
    <>
      <Nav />
      <div className="home">
        <div className="product-card">
          <div className="product-image-container">
            <canvas ref={outputCanvasRef} style={{ display: 'block', width: '500px' }}></canvas> {/* Show canvas */}
          </div>
        </div>
        <div className="jersey-selection">
          <button
            onClick={() => handleImageClick(hoodie, 0.53, 0.33, 0.28, 0.252)} // Adjust as needed for hoodie
            className="jersey-btn"
          >
            <img src={hoodie} alt="hoodie" className="toggle-image" />
          </button>
          <button
            onClick={() => handleImageClick(shorts, 0.42, 0.2, 0.32, 0.46)} // Adjust as needed for jeans
            className="jersey-btn"
          >
            <img src={shorts} alt="shorts" className="toggle-image" />
          </button>
        </div>
        <div className="text-container">
          <p className="title">VIRTUAL DRESSING ROOM</p>
          <h1 className="paragraph">
            One-size-fits-all <br /> doesn’t work for <br /> fashion. Or eCommerce <br /> models
          </h1>

          <p className="paragraph-virtual">
            Virtual Dressing Room solves one of the biggest hassle in
            <br />
            online fashion shopping. Help your shoppers view
            <br />
            products on models that are most similar to them.
          </p>
        </div>
      </div>
    </>
  );
};

export default Men;