import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../Pages/Dressing.css';
import cutecouple from '../Assets/cute-couple.png';

const dressingRoomData = {
  "dressingRoom": {
    "leftSection": {
      "title": "DRESSING ROOM",
      "subtitle": "by VueModel",
      "description": "Choose a model of your choice, mix & match products and curate your outfit with interactive styling."
    },
    "rightSection": {
      "models": [
        {
          "label": "Him",
          "image": {
            "src": cutecouple,
            "alt": "Model Him"
          }
        },
        {
          "label": "Her"
        }
      ]
    }
  }
};

const Dressing = () => {
  const navigate = useNavigate();

  const handleModelClick = (label) => {
    if (label === 'Her') {
      navigate('/virtual');
    } else if (label === 'Him') {
      navigate('/men');
    }
  };

  return (
    <div className="dressing-room-container">
      {/* Left section */}
      <div className="left-section">
        <motion.h1 
          className="title1" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          {dressingRoomData.dressingRoom.leftSection.title}
        </motion.h1>
        <motion.p 
          className="subtitle" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1, delay: 0.5 }}
        >
          {dressingRoomData.dressingRoom.leftSection.subtitle}
        </motion.p>
        <motion.p 
          className="description" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1, delay: 1 }}
        >
          {dressingRoomData.dressingRoom.leftSection.description}
        </motion.p>
      </div>

      {/* Right section */}
      <div className="right-section">
        {/* Rendering models dynamically */}
        {dressingRoomData.dressingRoom.rightSection.models.map((model, index) => (
          <motion.div 
            key={index} 
            className="model-container" 
            onClick={() => handleModelClick(model.label)}
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <div className={model.label === "Her" ? "model-label2" : "model-label"}>
              <p>{model.label}</p>
            </div>
            {model.image && (
              <motion.img 
                className="model-image" 
                src={model.image.src} 
                alt={model.image.alt} 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dressing;
