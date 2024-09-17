import React from 'react';

const SkinTone = ({ onSkinToneChange }) => {
  // Define the inline styles as objects
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '70px'
  };

  const buttonStyle = {
    width: '95px',
    padding: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
    borderRadius: '25px',
    border: 'none',
    margin: '18px 9px',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s, boxShadow 0.2s',
  };

  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
  };

  // Specific styles for each tone
  const fairToneStyle = {
    backgroundColor: '#f1c40f',
    border: '2px solid #f39c12'
  };

  const mediumToneStyle = {
    backgroundColor: '#e67e22',
    border: '2px solid #d35400'
  };

  const oliveToneStyle = {
    backgroundColor: '#2ecc71',
    border: '2px solid #27ae60'
  };

  // Handle hover effect on buttons
  const [hoveredButton, setHoveredButton] = React.useState(null);

  return (
    <div style={containerStyle}>
      <button
        style={{ 
          ...buttonStyle, 
          ...fairToneStyle, 
          ...(hoveredButton === 'fair' ? hoverStyle : {}) 
        }}
        onMouseEnter={() => setHoveredButton('fair')}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={() => onSkinToneChange('brightness(1.2) saturate(1.3)')}
      >
        Fair Tone
      </button><br />

      <button
        style={{ 
          ...buttonStyle, 
          ...mediumToneStyle, 
          ...(hoveredButton === 'medium' ? hoverStyle : {}) 
        }}
        onMouseEnter={() => setHoveredButton('medium')}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={() => onSkinToneChange('')}
      >
        Medium Tone
      </button><br />

      <button
        style={{ 
          ...buttonStyle, 
          ...oliveToneStyle, 
          ...(hoveredButton === 'olive' ? hoverStyle : {}) 
        }}
        onMouseEnter={() => setHoveredButton('olive')}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={() => onSkinToneChange('brightness(0.9) saturate(1.7)')}
      >
        Olive Tone
      </button>
    </div>
  );
};

export default SkinTone;
