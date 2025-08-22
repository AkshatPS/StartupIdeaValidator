import React, { useState, useEffect, useRef } from 'react';
// Import NavLink for SPA routing and useNavigate for programmatic navigation
import { NavLink, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate(); // Hook for redirection

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

    // --- LOGOUT FUNCTIONALITY ---
    const handleLogout = () => {
        // 1. Remove the token from localStorage
        localStorage.removeItem('token');
        // 2. Redirect to the login page
        navigate('/login', { replace: true });
    };

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
                    <NavLink to="/dashboard" className="navbar-logo">
                        Startalyze
                    </NavLink>
                </div>

                {/* Right side: Main Nav, Profile, and Mobile Menu Icon */}
                <div className="navbar-right">
                    <ul className="nav-menu-main">
                        <li><NavLink to="/dashboard" className="nav-links">Dashboard</NavLink></li>
                        <li><NavLink to="/new-idea" className="nav-links">Validate New Idea</NavLink></li>
                    </ul>

                    <div className="profile-section" ref={profileRef}>
                        <button onClick={toggleProfileMenu} className="profile-avatar-button">
                            <UserAvatar />
                        </button>
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                                <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
                                <div className="dropdown-divider"></div>
                                {/* Updated to be a button that calls handleLogout */}
                                <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
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
                     <NavLink to="/dashboard" className="mobile-nav-link">Dashboard</NavLink>
                     <NavLink to="/new-idea" className="mobile-nav-link">Validate New Idea</NavLink>
                     <NavLink to="/dashboard#recent-validations-section" className="mobile-nav-link">History</NavLink>
                     <div className="mobile-divider"></div>
                     <NavLink to="/profile" className="mobile-nav-link">Profile</NavLink>
                     <NavLink to="/settings" className="mobile-nav-link">Settings</NavLink>
                     {/* Updated to be a button that calls handleLogout */}
                     <button onClick={handleLogout} className="mobile-nav-link logout">Logout</button>
                 </div>
            )}
        </nav>
    );
};

export default Navbar;
