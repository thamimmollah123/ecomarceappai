import React from 'react';
import { useTheme } from './ThemeContext'; // Import the useTheme hook
import './Footer.css'; // Import your footer styles

const Footer = () => {
    // Access the isDayMode value from the theme context
    const { isDayMode } = useTheme();

    // Determine the CSS class based on the day/night mode
    const footerClass = isDayMode ? 'footer day-mode' : 'footer night-mode';

    return (
        <footer className={footerClass}>
            <p>&copy; 2024 Aiinhome Technologies Private Limited. All rights reserved.</p>
            {/* Additional footer content can go here */}
        </footer>
    );
};

export default Footer;
