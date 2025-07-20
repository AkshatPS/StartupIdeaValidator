import React, { useState } from 'react';
import './AuthNavbar.css'; // Using the new stylesheet

const AuthNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to navigate to a different page (e.g., home)
  const handleNavigate = (e, path) => {
    e.preventDefault();
    // In a real React app, you'd use react-router-dom's useNavigate hook
    // For this example, we'll simulate it with window.location
    window.location.href = path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="auth-navbar">
      <div className="navbar-container">
        {/* Logo / Brand Name - Links to Landing Page */}
        <a href="/" className="navbar-logo" onClick={(e) => handleNavigate(e, '/')}>
          IdeaValidateAI
        </a>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="menu-icon" onClick={toggleMobileMenu}>
            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a href="/" className="nav-links" onClick={(e) => handleNavigate(e, '/')}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-links nav-button-secondary">
              Login
            </a>
          </li>
          <li className="nav-item">
            <a href="/signup" className="nav-links nav-button-primary">
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AuthNavbar;
