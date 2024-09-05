import React, { useState } from 'react';
import './Nav.css';

const Nav = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
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
        { name: 'Customers' },
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
                                    onClick={() => toggleDropdown(index)}
                                ></span>
                                {activeDropdown === index && renderDropdown()}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <button className="request-demo">Request Demo</button>
        </nav>
    );
};

export default Nav;
