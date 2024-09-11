import React, { useState } from 'react';
import './Nav.css';
import WebcamCapture from './WebcamCapture'; // Import the WebcamCapture component
import Modal from './Modal'; // Import the Modal component

const Nav = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showCamera, setShowCamera] = useState(false); // State to control the modal visibility

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const handleCapture = (imageSrc) => {
        console.log('Captured image:', imageSrc); // Handle the captured image here
    };

    const handleClick = (itemName, index) => {
        if (itemName === 'Camera') {
            // Toggle modal visibility when 'Camera' is clicked
            setShowCamera(!showCamera);
        }
        toggleDropdown(index);
    };

    const renderDropdown = () => (
        <ul className="dropdown-menu">
            <li className="dropdown-item">Option 1</li>
            <li className="dropdown-item">Option 2</li>
            <li className="dropdown-item">Option 3</li>
        </ul>
    );

    const menuItems = [
        { name: 'Products' },
        { name: 'Platform' },
        { name: 'Solutions' },
        { name: 'Industries' },
        { name: 'Camera' }, // Clicking this will show the camera modal
        { name: 'Partners' },
        { name: 'Resources' },
    ];

    return (
        <nav className="navbar">
            <ul className="nav-links">
                {menuItems.map((item, index) => (
                    <li key={index} className="nav-item">
                        {item.name}
                        {['Products', 'Platform', 'Solutions', 'Industries', 'Resources'].includes(item.name) && (
                            <>
                                <span 
                                    className="arrow-down" 
                                    onClick={() => handleClick(item.name, index)}
                                ></span>
                                {activeDropdown === index && renderDropdown()}
                            </>
                        )}
                        {item.name === 'Camera' && (
                            <>
                                <span 
                                    className="arrow-down" 
                                    onClick={() => handleClick(item.name, index)}
                                ></span>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <button className="request-demo">Request Demo</button>

            {/* Camera Modal */}
            <Modal show={showCamera} onClose={() => setShowCamera(false)}>
                <WebcamCapture onCapture={handleCapture} />
            </Modal>
        </nav>
    );
};

export default Nav;
