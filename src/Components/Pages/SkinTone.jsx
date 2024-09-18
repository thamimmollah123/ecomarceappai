import React from 'react';

const SkinTone = ({ onSkinToneChange }) => {
  // Define the inline styles as objects
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  };

  const labelStyle = {
    marginBottom: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333', // Dark grey text for contrast
    letterSpacing: '1px',
  };

  const sliderStyle = {
    width: '180px',
    margin: '2px 0',
    cursor: 'pointer',
    background: 'linear-gradient(90deg, rgb(255, 223, 186), rgb(255, 194, 149), rgb(222, 161, 121), rgb(180, 123, 87), rgb(144, 90, 57))', // Smooth RGB gradient
    borderRadius: '10px',
    height: '10px',
    appearance: 'none',
    outline: 'none',
  };

  const toneLabelStyle = {
    fontSize: '9px',
    fontWeight: '600',
    color: '#444',
  };

  const thumbStyle = {
    height: '20px',
    width: '20px',
    backgroundColor: '#888', // Grey thumb
    borderRadius: '50%',
    position: 'relative',
    appearance: 'none',
  };

  const handleSliderChange = (event) => {
    const value = event.target.value;
    
    // Apply RGB adjustments based on slider value
    if (value <= 33) {
      onSkinToneChange('brightness(1.2) saturate(1.3)'); // Fair Tone
    } else if (value > 33 && value <= 66) {
      onSkinToneChange(''); // Medium Tone
    } else if (value > 66) {
      onSkinToneChange('brightness(0.9) saturate(1.7)'); // Olive Tone
    }
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>Adjust Skin Tone</label>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        defaultValue="50"
        onChange={handleSliderChange}
        style={sliderStyle}
      />
      <div>
        <span style={toneLabelStyle}>Fair</span>
        <span style={{ ...toneLabelStyle, margin: '0 30px' }}>Medium</span>
        <span style={toneLabelStyle}>Olive</span>
      </div>
    </div>
  );
};

export default SkinTone;
