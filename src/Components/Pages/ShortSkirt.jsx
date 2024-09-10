import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/top-short-skirt.png'; // Base image with human figure
import greyfrock from '../Assets/greyfrock.png'; // Clothing image with transparent background
import BlueGaun from '../Assets/BlueGaun.png';
import prusian from '../Assets/prusian.png';
import Nav from './Nav';

const ShortSkirt = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [selectedKurti, setSelectedKurti] = useState(null); // No default selected dress
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

      // Draw selected dress if any, otherwise just the human image
      if (selectedKurti) {
        const clothingImg = new Image();
        clothingImg.src = selectedKurti.src;
        clothingImg.onload = () => {
          const width = img.width * selectedKurti.widthFactor;
          const height = img.height * selectedKurti.heightFactor;
          const xPos = img.width * selectedKurti.xPosFactor;
          const yPos = img.height * selectedKurti.yPosFactor;
          
          ctx.drawImage(clothingImg, xPos, yPos, width, height);
          setFinalImageSrc(canvas.toDataURL());
        };
      } else {
        setFinalImageSrc(canvas.toDataURL()); // Just the base image
      }
    };
  }, [selectedKurti]); // Re-run when selectedKurti changes

  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedKurti({ src: clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor });
  };

  return (
    <>
      <Nav />

      <div className="home">
        <div className="jersey-selection">
          <button
            onClick={() => handleImageClick(greyfrock, 0.6, 0.5, 0.32, 0.22)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === greyfrock ? 'selected' : ''}`}
          >
            <img src={greyfrock} alt="greyfrock" className="toggle-image" />
          </button><br />
          <button
            onClick={() => handleImageClick(BlueGaun, 1.2, 0.8, 0.03, 0.11)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === BlueGaun ? 'selected' : ''}`}
          >
            <img src={BlueGaun} alt="BlueGaun" className="toggle-image" />
          </button><br />
          <button
            onClick={() => handleImageClick(prusian, 0.43, 0.45, 0.4, 0.26)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === prusian ? 'selected' : ''}`}
          >
            <img src={prusian} alt="prusian" className="toggle-image" />
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

export default ShortSkirt;
