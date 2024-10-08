import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Pages/Home';
import About from './Components/Pages/About';
import Dressing from './Components/Pages/Dressing';
import Men from './Components/Pages/Men';
import NavigationDress from './Components/Pages/NavigationDress';
import BabyGirl from './Components/Pages/BabyGirl';
import Healthy from './Components/Pages/Healthy';
import ShortSkirt from './Components/Pages/ShortSkirt';
import WebcamCapture from './Components/Pages/WebcamCapture';
import { Moremodel } from './Components/Pages/Moremodel';

const PageRoute = () => {
  return (
   
        <Router>
          <Routes>
          <Route path="/" element={<Dressing />} />
            <Route path="/virtual" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/navi" element={<NavigationDress/>} />
            <Route path="/men" element={<Men />} />
            <Route path="/baby" element={<BabyGirl />} />
            <Route path="/healty" element={<Healthy />} />
            <Route path="/ShortSkirt" element={<ShortSkirt />} />
            <Route path="/webcam" element={<WebcamCapture />} />
            <Route path="/moremodel" element={<Moremodel />} />
        
          </Routes>
        </Router>
      );
  
}

export default PageRoute;
