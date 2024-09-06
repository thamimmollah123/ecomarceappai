import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css'; // Assuming you have corresponding styles
import humanBaseImage from '../Assets/male-beauty.png'; // Base image with human figure
import sweater from '../Assets/sweater.png'; // Clothing image: sweater
import Suit from '../Assets/Suit.png'; // Clothing image: suit
import Shorts1 from '../Assets/Shorts1.png'; // Clothing image: shorts
import Nav from './Nav'; // Navbar component

const Home = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage); // State for storing the combined image
  const [selectedClothing, setSelectedClothing] = useState(null); // State for selected additional clothing item
  const [isShortsVisible, setIsShortsVisible] = useState(true); // State to toggle Shorts1 visibility
  const outputCanvasRef = useRef(null); // Canvas reference

  // Function to draw the base image, Shorts1 (conditionally), and optionally other clothing
  const drawClothingOnCanvas = (clothingImageSrc = null, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw the base image
    const baseImage = new Image();
    baseImage.src = humanBaseImage;
    baseImage.onload = () => {
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;
      ctx.drawImage(baseImage, 0, 0);

      // Conditionally draw Shorts1 if it's visible
      if (isShortsVisible) {
        const shortsImage = new Image();
        shortsImage.src = Shorts1;
        shortsImage.onload = () => {
          const shortsWidth = baseImage.width * 0.32;  // Adjust width factor for Shorts1
          const shortsHeight = baseImage.height * 0.23; // Adjust height factor for Shorts1
          const shortsXPos = baseImage.width * 0.37;    // Adjust xPos factor for Shorts1
          const shortsYPos = baseImage.height * 0.46;   // Adjust yPos factor for Shorts1

          ctx.drawImage(shortsImage, shortsXPos, shortsYPos, shortsWidth, shortsHeight);

          // If an additional clothing item is selected, draw it on top
          if (clothingImageSrc) {
            const clothingImage = new Image();
            clothingImage.src = clothingImageSrc;
            clothingImage.onload = () => {
              const width = baseImage.width * widthFactor;
              const height = baseImage.height * heightFactor;
              const xPos = baseImage.width * xPosFactor;
              const yPos = baseImage.height * yPosFactor;

              ctx.drawImage(clothingImage, xPos, yPos, width, height);
              setFinalImageSrc(canvas.toDataURL()); // Update the final image with the combined image
            };
          } else {
            setFinalImageSrc(canvas.toDataURL()); // Update the final image with just Shorts1 and the base image
          }
        };
      } else {
        // If Shorts1 is not visible, draw only the selected clothing
        if (clothingImageSrc) {
          const clothingImage = new Image();
          clothingImage.src = clothingImageSrc;
          clothingImage.onload = () => {
            const width = baseImage.width * widthFactor;
            const height = baseImage.height * heightFactor;
            const xPos = baseImage.width * xPosFactor;
            const yPos = baseImage.height * yPosFactor;

            ctx.drawImage(clothingImage, xPos, yPos, width, height);
            setFinalImageSrc(canvas.toDataURL()); // Update the final image
          };
        } else {
          setFinalImageSrc(canvas.toDataURL()); // Update with only the base image if no other clothing is selected
        }
      }
    };
  };

  // On component mount, draw the base image with Shorts1
  useEffect(() => {
    drawClothingOnCanvas();
  }, [isShortsVisible]); // Redraw when isShortsVisible state changes

  // Handle clothing selection and redraw
  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedClothing(clothingImageSrc); // Update the selected clothing state
    drawClothingOnCanvas(clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor); // Redraw with selected clothing
  };

  // Toggle Shorts1 visibility
  const toggleShortsVisibility = () => {
    setIsShortsVisible(!isShortsVisible); // Toggle the shorts on or off
    drawClothingOnCanvas(selectedClothing); // Redraw with the current selected clothing and shorts state
  };

  return (
    <>
      <Nav /> {/* Navigation bar */}
      <div className="home">
        <div className="jersey-selection">
          {/* Sweater Button */}
          <button
            onClick={() => handleImageClick(sweater, 0.5, 0.3, 0.3, 0.26)} // Adjust as necessary
            className={`jersey-btn ${selectedClothing === sweater ? 'selected' : ''}`}
          >
            <img src={sweater} alt="Sweater" className="toggle-image" />
          </button>
          <br />
          {/* Suit Button */}
          <button
            onClick={() => handleImageClick(Suit, 0.36, 0.33, 0.37, 0.242)} // Adjust as necessary
            className={`jersey-btn ${selectedClothing === Suit ? 'selected' : ''}`}
          >
            <img src={Suit} alt="Suit" className="toggle-image" />
          </button>
          <br />
          {/* Shorts1 Button - Toggles visibility */}
          <button
            onClick={toggleShortsVisibility}
            className={`jersey-btn ${isShortsVisible ? 'selected' : ''}`}
          >
            <img src={Shorts1} alt="Shorts" className="toggle-image" />
          </button>
          <br />
        </div>

        {/* Product card that displays the final image */}
        <div className="product-card">
          <div className="product-image-container">
            <img
              src={finalImageSrc}
              alt="Human Figure"
              className="product-image"
            />
            <canvas ref={outputCanvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas */}
          </div>
        </div>

        {/* Information text section */}
        <div className="text-container">
          <p className="title">VIRTUAL DRESSING ROOM</p>
          <h1 className="paragraph">
            One-size-fits-all <br /> doesn’t work for <br /> fashion. Or eCommerce <br /> models.
          </h1>
          <p className="paragraph-virtual">
            Virtual Dressing Room solves one of the biggest hassles in
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

export default Home;
