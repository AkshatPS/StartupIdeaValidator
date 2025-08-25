import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import Navbar from './Navbar';
import api from '../api/axiosConfig';

// A more advanced modal for delete confirmation
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, username }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = `delete-${username}`;
    const isMatch = confirmationText === requiredText;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Delete Account</h4>
                <p>This action is permanent. To confirm, please type the following text exactly as it appears:</p>
                <p className="required-text-display">{requiredText}</p>
                <div className="form-group">
                    <input
                        type="text"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Type to confirm..."
                    />
                </div>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={!isMatch}>
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserAvatar = ({ size = 100 }) => (
    <div className="profile-avatar" style={{ width: size, height: size }}>
        <svg className="profile-avatar-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
    </div>
);

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', username: '', email: '' });
    const [passwordDetails, setPasswordDetails] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await api.get('/api/user/me', config);
                setUser(response.data);
                setUserDetails(response.data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
                setError("Could not load user profile.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleUserChange = (e) => setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put('/api/user/update', userDetails, config);
            alert('Profile details updated!');
        } catch (err) {
            alert('Failed to update profile.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put('/api/user/change-password', passwordDetails, config);
            alert('Password changed successfully!');
            setPasswordDetails({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to change password.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await api.delete('/api/user/delete', {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Account deleted successfully.');
            localStorage.removeItem('authToken');
            navigate('/login');
        } catch (err) {
            alert('Failed to delete account.');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) return <div className="profile-page-wrapper"><p style={{color: 'white', textAlign: 'center'}}>Loading profile...</p></div>;
    if (error) return <div className="profile-page-wrapper"><p style={{color: 'var(--danger-color)', textAlign: 'center'}}>{error}</p></div>;

    return (
        <div className="profile-page-wrapper">
            <Navbar />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                username={user?.username}
            />
            <div className="profile-container">
                <header className="profile-header">
                    <UserAvatar size={120} />
                    <div className="header-text">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p>{user.email}</p>
                    </div>
                </header>

                <div className="profile-content">
                    <div className="profile-section-card">
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleUserSubmit}>
                            <div className="form-row">
                                <div className="form-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" name="firstName" value={userDetails.firstName} onChange={handleUserChange} /></div>
                                <div className="form-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" name="lastName" value={userDetails.lastName} onChange={handleUserChange} /></div>
                            </div>
                            <div className="form-group"><label htmlFor="username">Username</label><input type="text" id="username" name="username" value={userDetails.username} onChange={handleUserChange} /></div>
                            <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={userDetails.email} onChange={handleUserChange} /></div>
                            <div className="form-actions"><button type="submit" className="btn btn-accent">Save Changes</button></div>
                        </form>
                    </div>

                    <div className="profile-section-card">
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group"><label htmlFor="currentPassword">Current Password</label><input type="password" id="currentPassword" name="currentPassword" value={passwordDetails.currentPassword} onChange={handlePasswordChange} /></div>
                            <div className="form-group"><label htmlFor="newPassword">New Password</label><input type="password" id="newPassword" name="newPassword" value={passwordDetails.newPassword} onChange={handlePasswordChange} /></div>
                            <div className="form-group"><label htmlFor="confirmNewPassword">Confirm New Password</label><input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordDetails.confirmNewPassword} onChange={handlePasswordChange} /></div>
                            <div className="form-actions"><button type="submit" className="btn btn-accent">Update Password</button></div>
                        </form>
                    </div>

                    <div className="profile-section-card danger-zone">
                        <h3>Danger Zone</h3>
                        <div className="danger-zone-content">
                            <p>Deleting your account is a permanent action and cannot be undone. All your account information and related data will be deleted.</p>
                            <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>Delete My Account</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="dashboard-footer">
               <a href="#">About</a>
               <a href="#">Contact</a>
               <a href="#">Terms</a>
               <a href="#">Privacy</a>
               <a
                 href="https://github.com/AkshatPS"
                 target="_blank"
                 rel="noopener noreferrer"
               >
                 GitHub
               </a>
             </footer>
        </div>
    );
};

export default ProfilePage;
