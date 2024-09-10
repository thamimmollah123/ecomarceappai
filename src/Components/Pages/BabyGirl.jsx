import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/babygirl.png'; // Base image with human figure
import redfrock from '../Assets/redfrock.png'; // Clothing image with transparent background
import blacktop from '../Assets/blacktop.png';
import yellowfrock from '../Assets/yellowfrock.png';
import Nav from './Nav';

const BabyGirl = () => {
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
            onClick={() => handleImageClick(redfrock, 0.8, 0.5, 0.11, 0.23)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === redfrock ? 'selected' : ''}`}
          >
            <img src={redfrock} alt="redfrock" className="toggle-image" />
          </button><br />
          <button
            onClick={() => handleImageClick(blacktop, 0.8, 0.7, 0.17, 0.14)} 
         className={`jersey-btn ${selectedKurti && selectedKurti.src === blacktop ? 'selected' : ''}`}
          >
            <img src={blacktop} alt="blacktop" className="toggle-image" />
          </button><br />
          <button
            onClick={() => handleImageClick(yellowfrock, 0.58, 0.5, 0.21, 0.18)} 
            className={`jersey-btn ${selectedKurti && selectedKurti.src === yellowfrock ? 'selected' : ''}`}
          >
            <img src={yellowfrock} alt="yellowfrock" className="toggle-image" />
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

export default BabyGirl;
