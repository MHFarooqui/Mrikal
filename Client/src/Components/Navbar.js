// src/Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = ({ onNavClick }) => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <button onClick={() => onNavClick('Home')}>Home</button>
        </li>
        
      </ul>
    </nav>
  );
};

export default Navbar;