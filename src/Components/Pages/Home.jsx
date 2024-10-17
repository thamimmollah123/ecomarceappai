import React, { useState, useRef, useEffect } from 'react';
import '../Pages/Home.css';
import humanBaseImage from '../Assets/download-model-girl.png';
import kurti1 from '../Assets/frock1.png';
import redkurti from '../Assets/red.png';
import blackkurti from '../Assets/black.png';
import Nav from './Nav';
import WebcamCapture from './WebcamCapture';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import swapped from '../Assets/swapped_face.png';
import { useTheme } from '../../ThemeContext'; // Import the theme context

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; // Import icons
import SkinTone from '../Pages/SkinTone';

const Home = () => {
  const [finalImageSrc, setFinalImageSrc] = useState(humanBaseImage);
  const [isDayMode, setIsDayMode] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);

  const [selectedKurti, setSelectedKurti] = useState(kurti1);
  const [capturedImageSrc, setCapturedImageSrc] = useState(null);
  const [skinToneFilter, setSkinToneFilter] = useState('');
  const [dressDimensions, setDressDimensions] = useState({
    widthFactor: 0.47,
    heightFactor: 0.5,
    xPosFactor: 0.269,
    yPosFactor: 0.21,
  });
  const outputCanvasRef = useRef(null);
  const navigate = useNavigate();
  // Dynamic content for text with explicit <br/> tags
  const [textContent, setTextContent] = useState({
    title: "VIRTUAL DRESSING ROOM",
    heading: "One-size-fits-all <br/> doesn’t work for <br/> fashion. Or eCommerce <br/> models",
    description: "Virtual Dressing Room solves one of the biggest hassle in<br/> online fashion shopping. Help your shoppers view <br/> products on models that are most similar to them."
  });

  // Handle webcam image capture
  const handleCapture = async (capturedImageSrc) => {
    console.log('capturedImageSrc', capturedImageSrc);
    const formData = new FormData();
    formData.append('source', capturedImageSrc);

    try {
      const response = await axios.post('http://127.0.0.1:5000/face_swap', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("response", response);
      console.log('swapped successfully complete');

      // Set the final image source to the imported swapped image
      if (response.status === 200) {
        setFinalImageSrc(swapped);
      }
    } catch (error) {
      console.error('Failed to send image to the API:', error);
    }
  };

  // Function to update canvas with the base image, selected clothing, and captured face
  const updateCanvas = (clothingImage) => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = humanBaseImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = skinToneFilter;
      ctx.drawImage(img, 0, 0);

      const clothingImg = new Image();
      clothingImg.src = clothingImage;
      clothingImg.onload = () => {
        const { widthFactor, heightFactor, xPosFactor, yPosFactor } = dressDimensions;
        const width = img.width * widthFactor;
        const height = img.height * heightFactor;
        const xPos = img.width * xPosFactor;
        const yPos = img.height * yPosFactor;

        ctx.drawImage(clothingImg, xPos, yPos, width, height);

        if (capturedImageSrc) {
          const capturedImg = new Image();
          capturedImg.src = capturedImageSrc;
          capturedImg.onload = () => {
            const faceWidth = img.width * 0.10;
            const faceHeight = img.height * 0.09;
            const faceXPos = img.width * 0.45;
            const faceYPos = img.height * 0.09;

            ctx.drawImage(capturedImg, 0, 0, capturedImg.width, capturedImg.height, faceXPos, faceYPos, faceWidth, faceHeight);
            setFinalImageSrc(canvas.toDataURL());
          };
        } else {
          setFinalImageSrc(canvas.toDataURL());
        }
      };
    };
  };

  // useEffect(() => {
  //   updateCanvas(kurti1);
  // }, []);

  // Handle dress selection and store the dimensions
  const handleImageClick = (clothingImageSrc) => {
    setSelectedKurti(clothingImageSrc);
    updateCanvas(clothingImageSrc);
  };

  // Handle skin tone selection
  const handleSkinToneChange = (filter) => {
    setSkinToneFilter(filter);
    updateCanvas(selectedKurti);
  };

  // Handle click on 'More Collection'
  const handleMoreCollectionClick = () => {
    navigate('/moremodel');
  };
  const toggleTheme = () => {
    setIsDayMode(prevMode => !prevMode);
  };

  const toggleNightMode = () => {
    setIsNightMode((prevMode) => !prevMode);
  };

  return (
    <div className={isDayMode ? 'day-mode' : 'night-mode'}> {/* Add class based on theme */}
      <div>
        {/* Pass the isNightMode prop to the Nav component */}
        <Nav isNightMode={!isDayMode} />

{/* Button to toggle between day and night mode */}
<button className="toggle-theme-button" onClick={toggleTheme}>
  <FontAwesomeIcon className="theme-icon" icon={isDayMode ? faMoon : faSun} />
</button>

      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back
      </button>


      <div className="home">
        <div className='container-home'>
          <div className="webcam-container" style={{ float: 'left', marginRight: '20px' }}>
            <WebcamCapture onCapture={handleCapture} />
          </div>

          <div className="jersey-selection">
            {/* Jersey buttons with image selection */}
            <button onClick={() => handleImageClick(kurti1)} className={`jersey-btn ${selectedKurti === kurti1 ? 'selected' : ''}`}>
              <img src={kurti1} alt="Frock 1" className="toggle-image" />
            </button><br />
            <button onClick={() => handleImageClick(redkurti)} className={`jersey-btn ${selectedKurti === redkurti ? 'selected' : ''}`}>
              <img src={redkurti} alt="Red Kurti" className="toggle-image" />
            </button><br />
            <button onClick={() => handleImageClick(blackkurti)} className={`jersey-btn ${selectedKurti === blackkurti ? 'selected' : ''}`}>
              <img src={blackkurti} alt="Black Dress" className="toggle-image" />
            </button>
          </div>

          {/* Product Card */}
          <div className="product-card">
            <div className="product-image-container">
              {/* Check if finalImageSrc is not empty */}
              {finalImageSrc && (
                <img src={finalImageSrc} alt="Human Figure" className="product-image" />
              )}
              <canvas ref={outputCanvasRef} style={{ display: 'none' }}></canvas>
              <Link to="/moremodel" className="more-collection-overlay">
                More collection
              </Link>
            </div>
          </div>

        </div>
       {/* SkinTone component for adjusting skin tone */}
       {/* <SkinTone onSkinToneChange={handleSkinToneChange} /> */}

        <div className="text-container">
          <p className="title">{textContent.title}</p>
          <h1 className="paragraph" dangerouslySetInnerHTML={{ __html: textContent.heading }}></h1>
          <p className="paragraph-virtual" dangerouslySetInnerHTML={{ __html: textContent.description }}></p>
        </div>

      </div>
      {/* <Footer isNightMode={!isDayMode}/> */}
    </div>


  );


};



export default Home;
