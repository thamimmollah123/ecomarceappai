// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(true);

  const toggleTheme = () => {
    setIsDayMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDayMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
