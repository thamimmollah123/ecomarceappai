import React, { useState, useEffect, useRef } from 'react';
import '../Pages/Moremodel.css'; // Ensure the CSS file is correctly linked
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

export const Moremodel = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: '', icon: 'fas fa-tshirt', isActive: true },
    { id: 2, name: 'Dresses', icon: 'fas fa-skirt', isActive: false }, // Using fa-skirt for dresses
    { id: 3, name: 'Bottoms', icon: 'fas fa-trousers', isActive: false } // Ensure fa-trousers is available or use an alternative
  ]);

  const [items, setItems] = useState([
    { id: 1, src: require('../Assets/ladies-tops.png'), alt: 'Black Top', key: 'blacktop' },
    { id: 2, src: require('../Assets/summer-pink.png'), alt: 'Pink Dress', key: 'pinkdress' },
    { id: 3, src: require('../Assets/Rdress.png'), alt: 'Red Dress', key: 'reddress' },
    { id: 4, src: require('../Assets/Blackdress.png'), alt: 'Black Dress', key: 'blackdress' }
  ]);

  const [selectedDress, setSelectedDress] = useState(null); // State to manage the selected dress image
  const [selectedDimensions, setSelectedDimensions] = useState(null); // State to manage the selected dress dimensions
  const canvasRef = useRef(null); // Ref for the canvas element
  const bodyImageSrc = require('../Assets/human-picture-girl.png'); // Body image source

  const dressData = {
    blacktop: { src: require('../Assets/ladies-tops.png'), dimensions: { width: 0.5, height: 0.3, xPos: 0.26, yPos: 0.11 } },
    pinkdress: { src: require('../Assets/summer-pink.png'), dimensions: { width: 0.5, height: 0.3, xPos: 0.25, yPos: 0.121} },
    reddress: { src: require('../Assets/Rdress.png'), dimensions: { width: 0.69, height: 0.36, xPos: 0.16, yPos: 0.12 } },
    blackdress: { src: require('../Assets/Blackdress.png'), dimensions: { width: 0.4, height: 0.31, xPos: 0.3, yPos: 0.175 } }
  };

  // Set up canvas and draw images
  const drawCanvas = (dressImage, dimensions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load the body image and draw it on the canvas
    const bodyImage = new Image();
    bodyImage.src = bodyImageSrc;
    bodyImage.onload = () => {
      // Maintain aspect ratio for scaling the image
      const aspectRatio = bodyImage.width / bodyImage.height;
      const newWidth = canvas.width;
      const newHeight = newWidth / aspectRatio;

      // Draw the body image at the new size
      ctx.drawImage(bodyImage, 0, 0, newWidth, newHeight);

      // If a dress is selected, draw the dress over the body
      if (dressImage && dimensions) {
        const dressImg = new Image();
        dressImg.src = dressImage;
        dressImg.onload = () => {
          // Use the dimensions provided for the selected dress
          const width = canvas.width * dimensions.width;
          const height = canvas.height * dimensions.height;
          const xpos = canvas.width * dimensions.xPos;
          const ypos = canvas.height * dimensions.yPos;

          // Draw the selected dress image
          ctx.drawImage(dressImg, xpos, ypos, width, height);
        };
      }
    };
  };

  // Set the default dress image when the component mounts
  useEffect(() => {
    drawCanvas(null, null); // Initially draw only the body image
  }, []);

  const handleCategoryClick = (id) => {
    const updatedCategories = categories.map(category => ({
      ...category,
      isActive: category.id === id
    }));
    setCategories(updatedCategories);
  };

  const handleItemClick = (itemKey) => {
    const { src, dimensions } = dressData[itemKey];
    setSelectedDress(src); // Update the selected dress image
    setSelectedDimensions(dimensions); // Update the selected dress dimensions
    drawCanvas(src, dimensions); // Redraw the canvas with the selected dress
  };

  return (
    <div className="container">
      <div className="sidebar">
        {categories.map(category => (
          <div
            key={category.id}
            className={`category ${category.isActive ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <i className={category.icon}></i> {/* Font Awesome Icon */}
            <span>{category.name}</span>
          </div>
        ))}
      </div>

      <div className="items">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`item ${item.key === selectedDress ? 'selected' : ''}`}
            onClick={() => handleItemClick(item.key)} // Set the selected image on click
          >
            <img src={item.src} alt={item.alt} />
            <div className="item-description">
              {item.alt}
            </div>
          </div>
        ))}
      </div>

      <div className="canvas-container">
        <div className="additional-image">
          <canvas ref={canvasRef} width={480} height={900} className="dress-canvas" />
        </div>
      </div>
    </div>
  );
};
