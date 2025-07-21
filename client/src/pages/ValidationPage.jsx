import React, { useState, useEffect } from 'react';
import './ValidationPage.css';
import Navbar from './Navbar'; // Assuming the dashboard navbar is used

// Mock data that would be fetched based on the :ideaId URL parameter
const mockIdeaData = {
    id: 'xyz789',
    title: 'Eco-friendly Food Delivery App',
    pitch: 'A platform to deliver zero-waste meals from local vendors.',
    // ... other idea details
};

// --- Sub-components for better organization ---

const Stepper = ({ activeStep }) => {
    const steps = ['Submitted', 'Market Analysis', 'Competitor Analysis', 'Feasibility Score', 'Final Report'];

    return (
        <div className="stepper-wrapper">
            {steps.map((label, index) => (
                <div key={label} className="step-item-container">
                    <div className={`step-item ${index <= activeStep ? 'completed' : ''} ${index === activeStep ? 'active' : ''}`}>
                        <div className="step-icon">
                            {index < activeStep ? '✓' : '●'}
                        </div>
                    </div>
                    <div className={`step-label ${index <= activeStep ? 'completed' : ''}`}>{label}</div>
                    {index < steps.length - 1 && <div className={`step-connector ${index < activeStep ? 'completed' : ''}`}></div>}
                </div>
            ))}
        </div>
    );
};

const ValidationSection = ({ title, icon, step, activeStep, children }) => {
    if (activeStep < step) {
        return null; // Don't render the section until its step is active or completed
    }
    
    const isCompleted = activeStep > step;
    const isActive = activeStep === step;

    return (
        <div className={`validation-section ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
            <div className="section-header">
                <h3>{icon} {title}</h3>
                {isCompleted && <span className="status-badge">Completed</span>}
                {isActive && <span className="status-badge active">In Progress...</span>}
            </div>
            <div className="section-content">
                {children}
            </div>
        </div>
    );
};


const ValidationPage = () => {
    const [activeStep, setActiveStep] = useState(0);

    // Simulate the validation progress
    useEffect(() => {
        const timeouts = [];
        for (let i = 1; i <= 5; i++) {
            const timeout = setTimeout(() => {
                setActiveStep(i);
            }, i * 2500); // Progress to the next step every 2.5 seconds
            timeouts.push(timeout);
        }
        
        // Cleanup timeouts on component unmount
        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, []);
    
    return (
        <div className="validation-page-wrapper">
            <Navbar />
            <div className="validation-container">
                <div className="page-header">
                    <h1>Validating: "{mockIdeaData.title}"</h1>
                    <p>Our AI is analyzing your idea. Results will appear below as they are generated.</p>
                </div>

                {/* 2. Step Progress Tracker */}
                <Stepper activeStep={activeStep} />

                {/* 3. Step-Wise Sections */}
                <div className="sections-container">
                    <ValidationSection title="Market Fit Analysis" icon="📊" step={1} activeStep={activeStep}>
                        <p>Your idea for an "Eco-friendly Food Delivery App" aligns with a significant and growing trend in consumer demand for sustainable and ethical products. Market data indicates a <strong>25% year-over-year increase</strong> in searches for "sustainable food" and "zero-waste products," suggesting a strong potential for early adoption among environmentally conscious millennials and Gen Z.</p>
                    </ValidationSection>

                    <ValidationSection title="Competitor Check" icon="⚔️" step={2} activeStep={activeStep}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Competitor</th>
                                    <th>Key Feature</th>
                                    <th>Market Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>EcoEats UK</td>
                                    <td>Reusable Containers</td>
                                    <td>~5% (Regional)</td>
                                </tr>
                                <tr>
                                    <td>Swiggy Green</td>
                                    <td>Carbon-Neutral Delivery</td>
                                    <td>~2% (Niche)</td>
                                </tr>
                            </tbody>
                        </table>
                         <button className="btn btn-secondary small-btn">See Similar Startups</button>
                    </ValidationSection>

                    <ValidationSection title="Feasibility Score" icon="🎯" step={3} activeStep={activeStep}>
                        <div className="feasibility-score-container">
                            <div className="score-display">
                                <span className="score-value">72</span>
                                <span className="score-total">/ 100</span>
                            </div>
                            <div className="score-breakdown">
                                <ul>
                                    <li><span>Market Size:</span> <strong>25/30</strong></li>
                                    <li><span>Business Model Clarity:</span> <strong>15/20</strong></li>
                                    <li><span>Innovation Factor:</span> <strong>12/20</strong></li>
                                    <li><span>Technical Feasibility:</span> <strong>20/30</strong></li>
                                </ul>
                            </div>
                        </div>
                    </ValidationSection>
                    
                    <ValidationSection title="Feedback & Suggestions" icon="💡" step={4} activeStep={activeStep}>
                        <ul className="feedback-list">
                            <li><strong>Consider a B2B model:</strong> Offer zero-waste lunch delivery to corporate offices to secure recurring revenue.</li>
                            <li><strong>Niche Down:</strong> Focus initially on a specific cuisine type (e.g., vegan, organic) to capture a dedicated user base before expanding.</li>
                            <li><strong>Gamify Sustainability:</strong> Reward users with points or discounts for returning packaging, creating a fun and sticky user experience.</li>
                        </ul>
                    </ValidationSection>

                     <ValidationSection title="Final Summary Report" icon="📄" step={5} activeStep={activeStep}>
                        <div className="report-preview">
                            <h4>Validation Summary</h4>
                            <p><strong>Idea:</strong> {mockIdeaData.title}</p>
                            <p><strong>Pitch:</strong> {mockIdeaData.pitch}</p>
                            <p><strong>Final Score:</strong> 72/100</p>
                            <p><strong>Key Insight:</strong> Strong market alignment with a clear need for a focused, niche strategy to compete effectively.</p>
                            <p><em>Validated on: {new Date().toLocaleDateString()}</em></p>
                        </div>
                        <button className="btn btn-primary">Download as PDF</button>
                    </ValidationSection>
                </div>

                {/* 4. Action Buttons */}
                <div className="page-actions">
                    <a href={`/edit-idea/${mockIdeaData.id}`} className="btn btn-secondary">📝 Edit Idea</a>
                    <a href={`/report/${mockIdeaData.id}`} className="btn btn-accent">📄 Download Full Report</a>
                </div>
            </div>

            {/* 5. Footer */}
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

export default ValidationPage;