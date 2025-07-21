import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

// A simple User Avatar SVG as a placeholder
const UserAvatar = () => (
    <svg className="user-avatar-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
    </svg>
);

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close profile dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
        setProfileOpen(false); // Close profile menu when opening mobile menu
    };
    
    const toggleProfileMenu = () => {
        setProfileOpen(!isProfileOpen);
    };

    return (
        <nav className="dashboard-navbar">
            <div className="navbar-container">
                {/* Logo on the left */}
                <div className="navbar-left">
                    <a href="/dashboard" className="navbar-logo">
                        Startalyze
                    </a>
                </div>

                {/* Right side: Main Nav, Profile, and Mobile Menu Icon */}
                <div className="navbar-right">
                    {/* Main navigation links are now here */}
                    <ul className="nav-menu-main">
                        <li><a href="/dashboard" className="nav-links">Dashboard</a></li>
                        <li><a href="/validate" className="nav-links">Validate New Idea</a></li>
                        <li><a href="/history" className="nav-links">History</a></li>
                        {/* "Collaborate" button removed */}
                    </ul>

                    <div className="profile-section" ref={profileRef}>
                        <button onClick={toggleProfileMenu} className="profile-avatar-button">
                            <UserAvatar />
                        </button>
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <a href="/profile" className="dropdown-item">Profile</a>
                                <a href="/settings" className="dropdown-item">Settings</a>
                                <div className="dropdown-divider"></div>
                                <a href="/logout" className="dropdown-item logout">Logout</a>
                            </div>
                        )}
                    </div>

                    <div className="menu-icon" onClick={toggleMobileMenu}>
                        <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                        <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                        <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                 <div className="mobile-menu">
                    <a href="/dashboard" className="mobile-nav-link">Dashboard</a>
                    <a href="/validate" className="mobile-nav-link">Validate New Idea</a>
                    <a href="/history" className="mobile-nav-link">History</a>
                    {/* "Collaborate" button removed */}
                    <div className="mobile-divider"></div>
                    <a href="/profile" className="mobile-nav-link">Profile</a>
                    <a href="/settings" className="mobile-nav-link">Settings</a>
                    <a href="/logout" className="mobile-nav-link logout">Logout</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
