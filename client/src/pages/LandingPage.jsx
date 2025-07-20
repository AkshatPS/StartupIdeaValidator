import React from 'react';
import LandingNavbar from './LandingNavbar';
import './LandingPage.css'; // Import the stylesheet

const LandingPage = () => {
  return (
    <div className="page">
        {/* Navbar */}
        <LandingNavbar />
      {/* Hero Section */}
      <header className="section hero-section">
        <h1 className="hero-tagline">Validate your startup idea with AI in minutes</h1>
      </header>

      <main>
        {/* How It Works Section */}
        <section id="how-it-works-section" className="section how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">💡</div>
              <h3 className="step-title">1. Submit Your Idea</h3>
              <p className="step-description">
                Provide a concise description of your startup concept. The more detail, the better the analysis.
              </p>
            </div>
            <div className="step">
              <div className="step-icon">🤖</div>
              <h3 className="step-title">2. AI Analyzes</h3>
              <p className="step-description">
                Our AI runs a comprehensive market analysis, checks competitors, and identifies potential strengths and weaknesses.
              </p>
            </div>
            <div className="step">
              <div className="step-icon">📊</div>
              <h3 className="step-title">3. Get Your Report</h3>
              <p className="step-description">
                Receive a detailed validation report in minutes, complete with actionable insights and suggestions.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="section features-section">
          <h2 className="section-title">Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">SWOT Analysis</h3>
              <p className="step-description">
                Automatically generate Strengths, Weaknesses, Opportunities, and Threats for your business idea.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Competitor Analysis</h3>
              <p className="step-description">
                Identify key competitors in your target market and understand their strategies.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">AI Suggestions</h3>
              <p className="step-description">
                Receive creative and strategic suggestions from our AI to refine your idea and improve your model.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials / Demo Video Section */}
        <section className="section testimonials-section">
          <h2 className="section-title">See It in Action</h2>
          <div className="demo-container">
            {/* Replace this div with an <iframe> for a real video */}
            <span>[Demo Video Placeholder]</span>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <h2 className="section-title cta-title">Ready to bring your idea to life?</h2>
          <a href="/login" className="cta-button">
            Start Validating
          </a>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;