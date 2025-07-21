import React from 'react';
import './NotFoundPage.css';

// A simple SVG for a "lost" or "searching" concept
const LostCompassIcon = () => (
    <svg className="compass-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
);


const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="status-code-wrapper">
                    <h1 className="status-code-404">4</h1>
                    <div className="icon-container">
                       <LostCompassIcon />
                    </div>
                    <h1 className="status-code-404">4</h1>
                </div>
                <h2 className="error-title">Page Not Found</h2>
                <p className="error-description">
                    Oops! It seems you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
                </p>
                <a href="/dashboard" className="home-button">
                    Go Back to Dashboard
                </a>
            </div>
        </div>
    );
};

export default NotFoundPage;
