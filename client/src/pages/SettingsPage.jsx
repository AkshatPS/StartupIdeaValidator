import React, { useState } from 'react';
import './SettingsPage.css';
import Navbar from './Navbar'; // The persistent dashboard navbar

// Custom Toggle Switch Component
const ToggleSwitch = ({ label, isToggled, handleToggle }) => {
    return (
        <label className="toggle-switch">
            <input type="checkbox" checked={isToggled} onChange={handleToggle} />
            <span className="slider"></span>
            <span className="toggle-label">{label}</span>
        </label>
    );
};

const SettingsPage = () => {
    // In a real app, default state would be fetched from user preferences
    const [settings, setSettings] = useState({
        notifications: {
            weeklySummary: true,
            featureAnnouncements: true,
            validationComplete: false,
        },
        appearance: {
            theme: 'dark', // 'dark', 'light', 'system'
        },
    });

    const handleNotificationToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleThemeChange = (e) => {
        setSettings(prev => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                theme: e.target.value
            }
        }));
    };

    const handleSaveChanges = () => {
        console.log("Saving settings:", settings);
        alert("Settings saved successfully!");
    };

    return (
        <div className="settings-page-wrapper">
            <Navbar />
            <div className="settings-container">
                <header className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account settings and preferences.</p>
                </header>

                <div className="settings-content">
                    {/* Notifications Section */}
                    <div className="settings-section-card">
                        <h3>Notifications</h3>
                        <p className="section-description">Choose how you want to be notified.</p>
                        <div className="settings-options-list">
                            <ToggleSwitch
                                label="Weekly Idea Summary"
                                isToggled={settings.notifications.weeklySummary}
                                handleToggle={() => handleNotificationToggle('weeklySummary')}
                            />
                            <ToggleSwitch
                                label="New Feature Announcements"
                                isToggled={settings.notifications.featureAnnouncements}
                                handleToggle={() => handleNotificationToggle('featureAnnouncements')}
                            />
                            <ToggleSwitch
                                label="Email on Validation Complete"
                                isToggled={settings.notifications.validationComplete}
                                handleToggle={() => handleNotificationToggle('validationComplete')}
                            />
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div className="settings-section-card">
                        <h3>Appearance</h3>
                        <p className="section-description">Customize the look and feel of the application.</p>
                        <div className="settings-options-list">
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="theme" value="dark" checked={settings.appearance.theme === 'dark'} onChange={handleThemeChange} />
                                    Dark
                                </label>
                                <label>
                                    <input type="radio" name="theme" value="light" checked={settings.appearance.theme === 'light'} onChange={handleThemeChange} />
                                    Light
                                </label>
                                <label>
                                    <input type="radio" name="theme" value="system" checked={settings.appearance.theme === 'system'} onChange={handleThemeChange} />
                                    System Default
                                </label>
                            </div>
                        </div>
                    </div>
                    
                     {/* Account Section */}
                    <div className="settings-section-card">
                        <h3>Account</h3>
                        <p className="section-description">Manage your personal information and password.</p>
                         <div className="settings-options-list">
                            <a href="/profile" className="btn btn-secondary">Go to Profile Page</a>
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button className="btn btn-accent" onClick={handleSaveChanges}>Save All Settings</button>
                    </div>
                </div>
            </div>
            <footer className="dashboard-footer">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="https://github.com/AkshatPS" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
        </div>
    );
};

export default SettingsPage;
