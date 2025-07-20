import React, { useState } from 'react';
import './LandingNavbar.css'; // Import the stylesheet

const LandingNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to handle smooth scrolling to a specific section
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
    // Close mobile menu on link click
    if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
    }
  };

  // Updated function to scroll to the top of the page
  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
     // Close mobile menu on link click
    if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="landing-navbar">
      <div className="navbar-container">
        {/* Logo / Brand Name */}
        <a href="#" className="navbar-logo" onClick={handleHomeClick}>
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
            <a href="#" className="nav-links" onClick={handleHomeClick}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#how-it-works-section" className="nav-links" onClick={(e) => handleScroll(e, 'how-it-works-section')}>
              How it works
            </a>
          </li>
          <li className="nav-item">
            <a href="#features-section" className="nav-links" onClick={(e) => handleScroll(e, 'features-section')}>
              Features
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

export default LandingNavbar;
