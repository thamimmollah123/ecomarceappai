import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../Pages/Slidingpic.css';

// Import all images
import red from '../Assets/red.png';  
import blue from '../Assets/casual-men-short-pants.png';
import green from '../Assets/frock1.png';
import purple from '../Assets/download.png';

// Define the models array with images
const models = [
  { id: 1, image: red, name: 'Red' },
  { id: 2, image: blue, name: 'Blue' },
  { id: 3, image: green, name: 'Green' },
  { id: 4, image: purple, name: 'Purple' }
];

function Slider() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [slideOut, setSlideOut] = useState(false); // New state to handle the slide-out animation
  const imagesToShow = 2; // Number of images to show initially
  const navigate = useNavigate(); // For routing

  const handlePurpleClick = () => {
    setSlideOut(true); // Trigger the slide-out animation
    // Delay the navigation until the animation completes (e.g., 500ms)
    setTimeout(() => {
      navigate('/virtual'); // Navigate to the virtual page
    }, 400);
  };

  const handleClick = (model) => {
    if (model.name === 'Purple') {
      handlePurpleClick();
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
              onClick={() => handleClick(model)} // Handle Purple image click
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
