import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Navbar from './Navbar';

const mockIdeas = [
  { id: 1, title: 'AI-Powered Financial Advisor for Millennials', submittedOn: '2024-07-20', tags: ['FinTech', 'AI'], score: 'High' },
  { id: 2, title: 'Subscription Box for Rare Indoor Plants', submittedOn: '2024-07-18', tags: ['eCommerce', 'Lifestyle'], score: 'Medium' },
  { id: 3, title: 'Gamified Language Learning App for Kids', submittedOn: '2024-07-15', tags: ['EdTech', 'Mobile'], score: 'High' },
  { id: 4, title: 'Decentralized Social Media Platform', submittedOn: '2024-07-12', tags: ['Web3', 'Social'], score: 'Low' },
];

const IdeaCard = ({ idea }) => (
    <div className="idea-card">
      <div className="idea-card-header">
        <h3 className="idea-title">{idea.title}</h3>
        <span className={`validation-score score-${idea.score.toLowerCase()}`}>{idea.score}</span>
      </div>
      <div className="idea-card-meta">
        <span>Submitted: {idea.submittedOn}</span>
        <div className="idea-tags">{idea.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
      </div>
      <div className="idea-card-actions">
        <button className="btn btn-primary">View Report</button>
        <button className="btn btn-secondary">Edit</button>
        <button className="btn btn-danger">Delete</button>
      </div>
    </div>
);

const SidebarPanel = ({ title, children }) => (
    <div className="sidebar-panel">
        <h4>{title}</h4>
        <div className="sidebar-panel-content">{children}</div>
    </div>
);

const Dashboard = () => {
  // State to hold user data
  const [user, setUser] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set the authorization header
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          // Make a request to the new /api/user/me endpoint
          const response = await axios.get('http://localhost:5000/api/user/me', config);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          // Handle error, e.g., redirect to login if token is invalid
        }
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once

  // This effect runs when the component mounts to check for a URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <main className="main-content">
          <section className="welcome-section">
            <div className="welcome-text">
              {/* Display user's full name or a loading state */}
              <h1>Hi, {user ? `${user.firstName} ${user.lastName}` : '...'}! 👋</h1>
              <p>Let's validate your next big idea today!</p>
            </div>
            <a href="/new-idea" className="btn btn-accent" style={{ textDecoration: 'none' }}>+ Validate New Idea</a>
          </section>

          <section className="my-ideas-section">
            <h2>Your Submitted Ideas</h2>
            <div className="ideas-list">
              {mockIdeas.length > 0 ? (
                mockIdeas.map(idea => <IdeaCard key={idea.id} idea={idea} />)
              ) : (
                <p>You haven't submitted any ideas yet.</p>
              )}
            </div>
          </section>

          <section id="recent-validations-section" className="recent-validations-section">
              <h2>Recent Activity</h2>
              <p className="placeholder-text">Your recent validation history will appear here.</p>
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
            {/* Updated with relevant links */}
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
