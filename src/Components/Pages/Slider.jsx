import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../Pages/Slidingpic.css';

// Import all images
import babygirl from '../Assets/babygirl.png';  
import blue from '../Assets/model-posing.png';
import green from '../Assets/top-short-skirt.png';
import purple from '../Assets/download.png';

// Define the models array with images
const models = [
  { id: 1, image: babygirl, name: 'BabyGirl' }, // Add BabyGirl model
  { id: 2, image: blue, name: 'Blue' },
  { id: 3, image: green, name: 'Green' },
  { id: 4, image: purple, name: 'Purple' }
];

function Slider() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [slideOut, setSlideOut] = useState(false); // New state to handle the slide-out animation
  const imagesToShow = 2; // Number of images to show initially
  const navigate = useNavigate(); // For routing

  const handleHealthyNavigation = () => {
    setSlideOut(true); 
    setTimeout(() => {
      navigate('/healty'); // Navigate to the Healthy.jsx page
    }, 400);
  };

  const handlePurpleNavigation = () => {
    setSlideOut(true); 
    setTimeout(() => {
      navigate('/virtual'); // Navigate to the virtual page for Purple
    }, 400);
  };

  const handleShortSkirtNavigation = () => {
    setSlideOut(true); 
    setTimeout(() => {
      navigate('/shortskirt'); // Navigate to ShortSkirt page
    }, 400);
  };

  const handleBabyGirlNavigation = () => {
    setSlideOut(true); 
    setTimeout(() => {
      navigate('/baby'); // Navigate to BabyGirl.jsx page
    }, 400);
  };

  const handleClick = (model) => {
    if (model.name === 'Purple') {
      handlePurpleNavigation();
    } else if (model.name === 'Blue') {
      handleHealthyNavigation();
    } else if (model.name === 'Green') {
      handleShortSkirtNavigation();
    } else if (model.name === 'BabyGirl') {
      handleBabyGirlNavigation(); // Navigate to BabyGirl.jsx page
    }
  };

  const navigateSlider = (direction) => {
    let newIndex = currentModelIndex + direction;
    if (newIndex < 0) {
      newIndex = models.length - imagesToShow;
    } else if (newIndex > models.length - imagesToShow) {
      newIndex = 0;
    }
    setCurrentModelIndex(newIndex);
  };

  return (
    <div className={`slider-container ${slideOut ? 'slide-out' : ''}`}>
      <div className="navigation">
        <button onClick={() => navigateSlider(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button onClick={() => navigateSlider(1)}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="model-display">
        <div 
          className="image-wrapper" 
          style={{ transform: `translateX(-${(currentModelIndex / models.length) * 90}%)` }}
        >
          {models.map((model) => (
            <img 
              key={model.id} 
              src={model.image} 
              alt={model.name} 
              onClick={() => handleClick(model)} // Handle click on images
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
