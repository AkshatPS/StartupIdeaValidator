import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Navbar from './Navbar';

// Helper function to format the date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Helper function to determine the validation score badge
const getScoreBadge = (idea) => {
    if (idea.status !== 'completed' || !idea.analysisResult) {
        return { text: 'Pending', className: 'pending' };
    }
    const score = idea.analysisResult.executiveSummary?.overallScore;
    if (score >= 70) return { text: 'High', className: 'high' };
    if (score >= 40) return { text: 'Medium', className: 'medium' };
    return { text: 'Low', className: 'low' };
};

const IdeaCard = ({ idea }) => {
    const navigate = useNavigate();
    const scoreInfo = getScoreBadge(idea);

    return (
        <div className="idea-card">
            <div className="idea-card-header">
                <h3 className="idea-title">{idea.title}</h3>
                <span className={`validation-score score-${scoreInfo.className}`}>{scoreInfo.text}</span>
            </div>
            <div className="idea-card-meta">
                <span>Submitted: {formatDate(idea.createdAt)}</span>
                <div className="idea-tags">
                    {/* Split the tags string into an array to map over it */}
                    {idea.tags.split(',').map(tag => (
                        <span key={tag.trim()} className="tag">{tag.trim()}</span>
                    ))}
                </div>
            </div>
            <div className="idea-card-actions">
                <button 
                    className="btn btn-primary" 
                    onClick={() => navigate(`/report/${idea._id}`)}
                    // Disable button if analysis is not complete
                    disabled={idea.status !== 'completed'}
                >
                    View Report
                </button>
                <button className="btn btn-secondary">Edit</button>
                <button className="btn btn-danger">Delete</button>
            </div>
        </div>
    );
};

const SidebarPanel = ({ title, children }) => (
    <div className="sidebar-panel">
        <h4>{title}</h4>
        <div className="sidebar-panel-content">{children}</div>
    </div>
);

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle case where user is not logged in
                setIsLoading(false);
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                // Fetch user data and user's ideas in parallel
                const [userResponse, ideasResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/user/me', config),
                    axios.get('http://localhost:5000/api/ideas/my-ideas', config)
                ]);

                setUser(userResponse.data);
                setIdeas(ideasResponse.data);
                
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                // Handle error, e.g., redirect to login if token is invalid
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Effect for scrolling to a section from a hash link
    useEffect(() => {
        if (!isLoading) { // Only run after initial data load
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }, [isLoading]);

    return (
        <div className="dashboard-wrapper">
            <Navbar />
            <div className="dashboard-container">
                <main className="main-content">
                    <section className="welcome-section">
                        <div className="welcome-text">
                            <h1>Hi, {user ? `${user.firstName} ${user.lastName}` : '...'}! 👋</h1>
                            <p>Let's validate your next big idea today!</p>
                        </div>
                        <a href="/new-idea" className="btn btn-accent" style={{ textDecoration: 'none' }}>+ Validate New Idea</a>
                    </section>

                    <section id="my-ideas-section" className="my-ideas-section">
                        <h2>Your Submitted Ideas</h2>
                        <div className="ideas-list">
                            {isLoading ? (
                                <p>Loading your ideas...</p>
                            ) : ideas.length > 0 ? (
                                ideas.map(idea => <IdeaCard key={idea._id} idea={idea} />)
                            ) : (
                                <p>You haven't submitted any ideas yet. Click the button above to get started!</p>
                            )}
                        </div>
                    </section>
                </main>

                <aside className="right-panel">
                    <SidebarPanel title="Quick Tips">
                        <ul>
                            <li>Clearly define the problem you're solving.</li>
                            <li>Identify your target audience precisely.</li>
                            <li>Keep your initial idea description concise.</li>
                        </ul>
                    </SidebarPanel>
                    <SidebarPanel title="Featured Ideas">
                        <p className="placeholder-text">Top-rated community ideas will be shown here.</p>
                    </SidebarPanel>
                    <SidebarPanel title="Resources">
                        <a href="https://www.canva.com/presentations/templates/pitch-deck/" target="_blank" rel="noopener noreferrer" className="resource-link">Pitch Deck Templates</a>
                        <a href="https://www.fundable.com/learn/resources/guides/startup" target="_blank" rel="noopener noreferrer" className="resource-link">Startup Guideline</a>
                        <a href="https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis" target="_blank" rel="noopener noreferrer" className="resource-link">Market Analysis Guide</a>
                    </SidebarPanel>
                </aside>
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

export default Dashboard;
