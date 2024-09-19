import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/human-picture-girl.png';
import kurti1 from '../Assets/frock1.png';
import redkurti from '../Assets/red.png';
import blackkurti from '../Assets/black.png';
import Nav from './Nav';
import WebcamCapture from './WebcamCapture';
import SkinTone from '../Pages/SkinTone'; // Import the SkinTone component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Link } from 'react-router-dom';


const Home = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [selectedKurti, setSelectedKurti] = useState(kurti1);
  const [capturedImageSrc, setCapturedImageSrc] = useState(null);
  const [skinToneFilter, setSkinToneFilter] = useState('');
  const [dressDimensions, setDressDimensions] = useState({
    widthFactor: 0.47,
    heightFactor: 0.5,
    xPosFactor: 0.269,
    yPosFactor: 0.21,
  });
  const [textContent, setTextContent] = useState({
    title: "VIRTUAL DRESSING ROOM",
    heading: "One-size-fits-all <br/> doesn’t work for <br/> fashion. Or eCommerce <br/> models",
    description: "Virtual Dressing Room solves one of the biggest hassle in<br/> online fashion shopping. Help your shoppers view <br/> products on models that are most similar to them."
  });
  const outputCanvasRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigation hook

  // Handle webcam image capture
  const handleCapture = (capturedImageSrc) => {
    setCapturedImageSrc(capturedImageSrc);
  };

  // Function to update canvas with the base image, selected clothing, and captured face
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

      // Apply skin tone filter to the image
      ctx.filter = skinToneFilter;
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
            const faceWidth = img.width * 0.10;
            const faceHeight = img.height * 0.09;
            const faceXPos = img.width * 0.45;
            const faceYPos = img.height * 0.09;

            // Draw the smaller face image onto the canvas
            ctx.drawImage(capturedImg, 0, 0, capturedImg.width, capturedImg.height, faceXPos, faceYPos, faceWidth, faceHeight);

            setFinalImageSrc(canvas.toDataURL());
          };
        } else {
          setFinalImageSrc(canvas.toDataURL());
        }
      };
    };
  };

  // Automatically set frock1 (kurti1) as the default dress when the component mounts
  useEffect(() => {
    updateCanvas(kurti1, 0.47, 0.5, 0.269, 0.21);
  }, []);

  // Handle dress selection and store the dimensions
  const handleImageClick = (clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor) => {
    setSelectedKurti(clothingImageSrc);
    setDressDimensions({ widthFactor, heightFactor, xPosFactor, yPosFactor });
    updateCanvas(clothingImageSrc, widthFactor, heightFactor, xPosFactor, yPosFactor);
  };

  // Handle skin tone selection using CSS filters and keep the dress dimensions fixed
  const handleSkinToneChange = (filter) => {
    setSkinToneFilter(filter);
    const { widthFactor, heightFactor, xPosFactor, yPosFactor } = dressDimensions;
    updateCanvas(selectedKurti, widthFactor, heightFactor, xPosFactor, yPosFactor);
  };

  // Handle click on 'More Collection'
  const handleMoreCollectionClick = () => {
    navigate('/moremodel'); // Navigate to the moremodel page
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

          {/* Dress selection buttons */}
          <div className="jersey-selection">
            <button onClick={() => handleImageClick(kurti1, 0.47, 0.5, 0.269, 0.21)} className={`jersey-btn ${selectedKurti === kurti1 ? 'selected' : ''}`}>
              <img src={kurti1} alt="Frock 1" className="toggle-image" />
            </button><br />
            <button onClick={() => handleImageClick(redkurti, 0.69, 0.5, 0.15, 0.199)} className={`jersey-btn ${selectedKurti === redkurti ? 'selected' : ''}`}>
              <img src={redkurti} alt="Red Kurti" className="toggle-image" />
            </button><br />
            <button onClick={() => handleImageClick(blackkurti, 0.57, 0.5, 0.199, 0.14)} className={`jersey-btn ${selectedKurti === blackkurti ? 'selected' : ''}`}>
              <img src={blackkurti} alt="Black Dress" className="toggle-image" />
            </button>
          </div>

          {/* Skin tone selection using the SkinTone component */}
          <SkinTone onSkinToneChange={handleSkinToneChange} />

          <div className="product-card">
  <div className="product-image-container">
    <img
      src={finalImageSrc}
      alt="Human Figure"
      className="product-image"
    />
    <canvas ref={outputCanvasRef} style={{ display: 'none' }}></canvas>
    <Link to="/moremodel" className="more-collection-overlay">
      More collection
    </Link>
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
