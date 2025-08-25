import React, { useState, useEffect } from 'react';
import './NewIdeaForm.css';
import Navbar from './Navbar'; // The persistent dashboard navbar
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, confirmText = "Confirm" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Confirm Action</h4>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

const NewIdeaForm = () => {
    const { ideaId } = useParams(); // Get the ideaId from the URL if it exists
    const isEditMode = Boolean(ideaId); // Check if we are in edit mode

    const initialFormState = {
        title: '',
        pitch: '',
        description: '',
        tags: '',
        audience: '',
        marketSize: '',
        competitors: '',
        businessModel: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // To disable button on submit
    const [charCount, setCharCount] = useState(0);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const DESCRIPTION_MAX_CHARS = 1000;
    const navigate = useNavigate(); // Hook for navigation
    
    useEffect(() => {
        if (isEditMode) {
            const fetchIdeaData = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('authToken');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const response = await api.get(`/api/ideas/${ideaId}`, config);
                    
                    // Populate the form with the fetched data
                    setFormData(response.data);
                    setCharCount(response.data.description.length);

                } catch (err) {
                    console.error("Failed to fetch idea data for editing:", err);
                    setError("Could not load idea data. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchIdeaData();
        }
    }, [ideaId, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'description') {
            if (value.length <= DESCRIPTION_MAX_CHARS) {
                setFormData(prevState => ({ ...prevState, [name]: value }));
                setCharCount(value.length);
            }
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const validateForm = () => {
        if (!formData.title || !formData.pitch || !formData.description || !formData.tags) {
            setError('Please fill out all required fields.');
            return false;
        }
        if (formData.description.length < 100) {
            setError(`Description must be at least 100 characters long. You have ${formData.description.length}.`);
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            let response;
            if (isEditMode) {
                // --- UPDATE LOGIC ---
                response = await api.put(`/api/ideas/${ideaId}`, formData, config);
                // After updating, go back to the dashboard
                navigate('/dashboard');
            } else {
                // --- CREATE LOGIC ---
                response = await api.post('/api/ideas', formData, config);
                // After creating, go to the validation page
                navigate(`/validate/${response.data.ideaId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
            console.error('Submission Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearForm = () => {
        setIsClearModalOpen(true);
    };

    // This function contains the original logic and is called by the modal's confirm button
    const handleConfirmClear = () => {
        setFormData(initialFormState);
        setCharCount(0);
        setError('');
        setIsClearModalOpen(false); // Close the modal
    };

    return (
        <div className="form-page-wrapper">
            <Navbar />
            <ConfirmationModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleConfirmClear}
                message="Are you sure you want to clear the form? All unsaved changes will be lost."
                confirmText="Clear Form"
            />
            <div className="form-container">
                <div className="form-header">
                    <h1>{isEditMode ? 'Edit Your Idea' : 'Validate a New Idea'}</h1>
                    <p>{isEditMode ? 'Refine your concept and resubmit for analysis.' : 'Fill in the details to get an AI-powered analysis.'}</p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* --- Required Fields --- */}
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="title">
                                <span role="img" aria-label="title icon">💡</span> Idea Title <span className="required-star">*</span>
                            </label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Eco-friendly Food Delivery App" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pitch">
                                <span role="img" aria-label="pitch icon">🧠</span> One-Line Pitch <span className="required-star">*</span>
                            </label>
                            <input type="text" id="pitch" name="pitch" value={formData.pitch} onChange={handleChange} placeholder="e.g., A platform for zero-waste meals from local vendors" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                <span role="img" aria-label="description icon">📄</span> Full Description <span className="required-star">*</span>
                            </label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="8" placeholder="Describe the problem, your solution, and the target market." required></textarea>
                            <div className="char-counter">{charCount} / {DESCRIPTION_MAX_CHARS}</div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">
                                <span role="img" aria-label="tags icon">🏷️</span> Tags / Categories (comma-separated) <span className="required-star">*</span>
                            </label>
                            <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., FinTech, AI, Sustainability" required />
                        </div>
                    </div>

                    {/* --- Optional Fields --- */}
                    <div className="form-section">
                         <h3 className="section-title">Optional Details</h3>
                        <div className="form-group">
                            <label htmlFor="audience">
                                <span role="img" aria-label="audience icon">👥</span> Target Audience
                            </label>
                            <input type="text" id="audience" name="audience" value={formData.audience} onChange={handleChange} placeholder="e.g., College students in urban areas" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="marketSize">
                                <span role="img" aria-label="market icon">📈</span> Market Size / Demand
                            </label>
                            <input type="text" id="marketSize" name="marketSize" value={formData.marketSize} onChange={handleChange} placeholder="e.g., Estimated $10M market in India" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="competitors">
                                <span role="img" aria-label="competitors icon">⚔️</span> Existing Alternatives / Competitors
                            </label>
                            <input type="text" id="competitors" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="e.g., Swiggy Green, EcoEats UK" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="businessModel">
                                <span role="img" aria-label="business model icon">📊</span> Business Model
                            </label>
                            <select id="businessModel" name="businessModel" value={formData.businessModel} onChange={handleChange}>
                                <option value="">Select a model</option>
                                <option value="Subscription">Subscription</option>
                                <option value="Freemium">Freemium</option>
                                <option value="Advertisements">Advertisements</option>
                                <option value="Commission">Commission-based</option>
                                <option value="One-time Payment">One-time Payment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                         <button type="button" className="btn btn-secondary" onClick={handleClearForm} disabled={isLoading}>
                             ✨ Clear Form
                         </button>
                         <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                             Cancel
                         </button>
                         <button type="submit" className="btn btn-accent" disabled={isLoading}>
                             {isLoading ? 'Saving...' : (isEditMode ? 'Update Idea' : 'Submit for Validation')}
                         </button>
                     </div>
                </form>
            </div>
            <footer className="dashboard-footer">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
        </div>
    );
};

export default NewIdeaForm;
