import React, { useState } from 'react';
import './NewIdeaForm.css';
import axios from 'axios';
import Navbar from './Navbar'; // The persistent dashboard navbar
import { useNavigate } from 'react-router-dom';

const NewIdeaForm = () => {
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
    const DESCRIPTION_MAX_CHARS = 1000;
    const navigate = useNavigate(); // Hook for navigation
    
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

        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to submit an idea.');
                setIsLoading(false);
                return;
            }

            // Set up the headers for the authenticated request
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Standard way to send JWT
                }
            };

            // Send the form data to your backend API using axios
            const response = await axios.post('http://localhost:5000/api/ideas', formData, config);
            
            const { ideaId } = response.data;
            
            // Redirect to the validation page
            navigate(`/validate/${ideaId}`);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Submission Error:', err);
            setIsLoading(false);
        }
    };

    const handleClearForm = () => {
        setFormData(initialFormState);
        setCharCount(0);
        setError('');
    };

    return (
        <div className="form-page-wrapper">
            <Navbar />
            <div className="form-container">
                <div className="form-header">
                    <h1>Validate a New Idea</h1>
                    <p>Fill in the details below to get an AI-powered analysis of your concept.</p>
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
                         <button type="submit" className="btn btn-accent" disabled={isLoading}>
                             {isLoading ? 'Submitting...' : 'Submit for Validation'}
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
