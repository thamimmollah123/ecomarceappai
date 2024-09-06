import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Pages/Home';
import About from './Components/Pages/About';
import Dressing from './Components/Pages/Dressing';
import Men from './Components/Pages/Men';
import NavigationDress from './Components/Pages/NavigationDress';

const PageRoute = () => {
  return (
   
        <Router>
          <Routes>
          <Route path="/" element={<Dressing />} />
            <Route path="/virtual" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/navi" element={<NavigationDress/>} />
            <Route path="/men" element={<Men />} />
        
         
      
          
          </Routes>
        </Router>
      );
  
}

export default PageRoute;
