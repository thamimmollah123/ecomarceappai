import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/male-beauty.png';
import sweater from '../Assets/sweater.png';
import Suit from '../Assets/Suit.png';
import Shorts1 from '../Assets/Shorts1.png';
import Nav from './Nav';
import WebcamCapture from './WebcamCapture';
import SkinTone from './SkinTone'; // Import the SkinTone component

const Men = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [capturedImageSrc, setCapturedImageSrc] = useState(null);
  const [isShortsVisible, setIsShortsVisible] = useState(true);
  const [skinToneFilter, setSkinToneFilter] = useState(''); // Skin tone filter
  const outputCanvasRef = useRef(null);

  // Dynamic content for text with explicit <br/> tags
  const [textContent, setTextContent] = useState({
    title: "VIRTUAL DRESSING ROOM",
    heading: "One-size-fits-all <br/> doesn’t work for <br/> fashion. Or eCommerce <br/> models",
    description: "Virtual Dressing Room solves one of the biggest hassle in<br/> online fashion shopping. Help your shoppers view <br/> products on models that are most similar to them."
  });

  // Handle captured face image
  const handleCapture = (capturedImageSrc) => {
    setCapturedImageSrc(capturedImageSrc);
  };

  // Draw base image, Shorts1 (conditionally), and any selected clothing
  const drawClothingOnCanvas = (clothingImageSrc = null, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const baseImage = new Image();
    baseImage.src = humanBaseImage;
    baseImage.onload = () => {
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;

      // Apply skin tone filter to base image
      ctx.filter = skinToneFilter;
      ctx.drawImage(baseImage, 0, 0);

      if (isShortsVisible) {
        const shortsImage = new Image();
        shortsImage.src = Shorts1;
        shortsImage.onload = () => {
          const shortsWidth = baseImage.width * 0.32;
          const shortsHeight = baseImage.height * 0.23;
          const shortsXPos = baseImage.width * 0.37;
          const shortsYPos = baseImage.height * 0.46;
          ctx.drawImage(shortsImage, shortsXPos, shortsYPos, shortsWidth, shortsHeight);

          if (clothingImageSrc) {
            const clothingImage = new Image();
            clothingImage.src = clothingImageSrc;
            clothingImage.onload = () => {
              const width = baseImage.width * widthFactor;
              const height = baseImage.height * heightFactor;
              const xPos = baseImage.width * xPosFactor;
              const yPos = baseImage.height * yPosFactor;
              ctx.drawImage(clothingImage, xPos, yPos, width, height);

              if (capturedImageSrc) {
                const faceImg = new Image();
                faceImg.src = capturedImageSrc;
                faceImg.onload = () => {
                  const faceWidth = baseImage.width * 0.09;
                  const faceHeight = baseImage.height * 0.09;
                  const faceXPos = baseImage.width * 0.5;
                  const faceYPos = baseImage.height * 0.16;
                  ctx.drawImage(faceImg, 0, 0, faceImg.width, faceImg.height, faceXPos, faceYPos, faceWidth, faceHeight);
                  setFinalImageSrc(canvas.toDataURL());
                };
              } else {
                setFinalImageSrc(canvas.toDataURL());
              }
            };
          } else {
            setFinalImageSrc(canvas.toDataURL());
          }
        };
      } else {
        if (clothingImageSrc) {
          const clothingImage = new Image();
          clothingImage.src = clothingImageSrc;
          clothingImage.onload = () => {
            const width = baseImage.width * widthFactor;
            const height = baseImage.height * heightFactor;
            const xPos = baseImage.width * xPosFactor;
            const yPos = baseImage.height * yPosFactor;
            ctx.drawImage(clothingImage, xPos, yPos, width, height);
            if (capturedImageSrc) {
              const faceImg = new Image();
              faceImg.src = capturedImageSrc;
              faceImg.onload = () => {
                const faceWidth = baseImage.width * 0.10;
                const faceHeight = baseImage.height * 0.09;
                const faceXPos = baseImage.width * 0.52;
                const faceYPos = baseImage.height * 0.09;
                ctx.drawImage(faceImg, 0, 0, faceImg.width, faceImg.height, faceXPos, faceYPos, faceWidth, faceHeight);
                setFinalImageSrc(canvas.toDataURL());
              };
            } else {
              setFinalImageSrc(canvas.toDataURL());
            }
          };
        } else {
          setFinalImageSrc(canvas.toDataURL());
        }
      }
    };
  };

  useEffect(() => {
    drawClothingOnCanvas();
  }, [isShortsVisible]);

  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedClothing(clothingImageSrc);
    drawClothingOnCanvas(clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor);
  };

  const toggleShortsVisibility = () => {
    setIsShortsVisible(!isShortsVisible);
    drawClothingOnCanvas(selectedClothing);
  };

  const handleSkinToneChange = (filter) => {
    setSkinToneFilter(filter);
    drawClothingOnCanvas(selectedClothing);
  };

  return (
    <>
      <Nav />
      <div className="home">
        <div className='container-home'>
          {/* Webcam Capture Component */}
          <div className="webcam-container" style={{ float: 'left', marginRight: '20px' }}>
            <WebcamCapture onCapture={handleCapture} />
          </div>

          <div className="jersey-selection">
            {/* Sweater */}
            <button
              onClick={() => handleImageClick(sweater, 0.5, 0.3, 0.3, 0.26)}
              className={`jersey-btn ${selectedClothing === sweater ? 'selected' : ''}`}
            >
              <img src={sweater} alt="Sweater" className="toggle-image" />
            </button>
            <br />
            {/* Suit */}
            <button
              onClick={() => handleImageClick(Suit, 0.36, 0.33, 0.37, 0.242)}
              className={`jersey-btn ${selectedClothing === Suit ? 'selected' : ''}`}
            >
              <img src={Suit} alt="Suit" className="toggle-image" />
            </button>
            <br />
            {/* Shorts1 Toggle */}
            <button
              onClick={toggleShortsVisibility}
              className={`jersey-btn ${isShortsVisible ? 'selected' : ''}`}
            >
              <img src={Shorts1} alt="Shorts" className="toggle-image" />
            </button>
            <br />
          </div>

          {/* Skin tone selection */}
          <SkinTone onSkinToneChange={handleSkinToneChange} />

          {/* Final Output */}
          <div className="product-card">
            <div className="product-image-container">
              <img src={finalImageSrc} alt="Human Figure" className="product-image" />
              <canvas ref={outputCanvasRef} style={{ display: 'none' }} />
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

export default Men;
