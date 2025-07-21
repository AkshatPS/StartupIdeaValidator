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
                    <ul className="nav-menu-main">
                        <li><a href="/dashboard" className="nav-links">Dashboard</a></li>
                        <li><a href="/new-idea" className="nav-links">Validate New Idea</a></li>
                        {/* UPDATED: Link now points to the dashboard with a hash */}
                        <li><a href="/dashboard#recent-validations-section" className="nav-links">History</a></li>
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
                    <a href="/new-idea" className="mobile-nav-link">Validate New Idea</a>
                    {/* UPDATED: Link now points to the dashboard with a hash */}
                    <a href="/dashboard#recent-validations-section" className="mobile-nav-link">History</a>
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
