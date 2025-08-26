import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ValidationPage.css";
import Navbar from "./Navbar";
import api from "../api/axiosConfig";

const Stepper = ({ activeStep }) => {
  const steps = [
    "Submitted",
    "Market Analysis",
    "Competitor Analysis",
    "Feasibility Score",
    "Final Report",
  ];
  return (
    <div className="stepper-wrapper">
      {steps.map((label, index) => (
        <div key={label} className="step-item-container">
          <div
            className={`step-item ${index <= activeStep ? "completed" : ""} ${
              index === activeStep ? "active" : ""
            }`}
          >
            <div className="step-icon">{index < activeStep ? "✓" : "●"}</div>
          </div>
          <div
            className={`step-label ${index <= activeStep ? "completed" : ""}`}
          >
            {label}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`step-connector ${
                index < activeStep ? "completed" : ""
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const ValidationSection = ({ title, icon, isVisible, children }) => {
  if (!isVisible) return null;
  return (
    <div className="validation-section completed">
      <div className="section-header">
        <h3>
          {icon} {title}
        </h3>
        <span className="status-badge">Completed</span>
      </div>
      <div className="section-content">{children}</div>
    </div>
  );
};

const ValidationPage = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [ideaData, setIdeaData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");

  // Mapping from backend status to the stepper's numerical index
  const statusToStepMap = {
    pending_analysis: 0,
    analyzing_market: 1,
    analyzing_competitors: 2,
    calculating_score: 3,
    generating_summary: 4,
    completed: 5,
    error: -1, // Special case for errors
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const fetchAndPoll = () => {
      const intervalId = setInterval(async () => {
        try {
          const response = await api.get(`/api/ideas/${ideaId}`, config);
          const data = response.data;

          setIdeaData(data);
          const currentStep = statusToStepMap[data.status] || activeStep;
          setActiveStep(currentStep);

          // Stop polling if the process is finished or has failed
          if (data.status === "completed" || data.status === "error") {
            clearInterval(intervalId);
            if (data.status === "error") {
              setError(
                "An error occurred during analysis. Please try again later."
              );
            }
          }
        } catch (err) {
          console.error("Polling failed:", err);
          setError(
            "Could not retrieve validation status. Please refresh the page."
          );
          clearInterval(intervalId);
        }
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(intervalId);
    };

    // Perform an initial fetch immediately
    api
      .get(`/api/ideas/${ideaId}`, config)
      .then((response) => {
        setIdeaData(response.data);
        const currentStep = statusToStepMap[response.data.status] || 0;
        setActiveStep(currentStep);
        // Only start polling if not already complete
        if (
          response.data.status !== "completed" &&
          response.data.status !== "error"
        ) {
          fetchAndPoll();
        }
      })
      .catch((err) => {
        console.error("Initial fetch failed:", err);
        setError(
          "Failed to load idea data. The idea may not exist or you may not have permission to view it."
        );
      });
  }, [ideaId]);

  if (error) {
    return (
      <div className="validation-page-wrapper">
        <Navbar />
        <div className="validation-container page-header">
          <h2 style={{ color: "var(--danger-color)" }}>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!ideaData) {
    return (
      <div className="validation-page-wrapper">
        <Navbar />
        <div className="validation-container page-header">
          <p>Loading validation details...</p>
        </div>
      </div>
    );
  }

  const { analysisResult } = ideaData;

  return (
    <div className="validation-page-wrapper">
      <Navbar />
      <div className="validation-container">
        <div className="page-header">
          <h1>Validating: "{ideaData.title}"</h1>
          <p>
            Our AI is analyzing your idea. Results will appear below as they are
            generated.
          </p>
        </div>

        <Stepper activeStep={activeStep} />

        <div className="sections-container">
          <ValidationSection
            title="Market Fit Analysis"
            icon="📊"
            isVisible={analysisResult?.executiveSummary}
          >
            <p>{analysisResult?.executiveSummary?.keyFindings?.join(" ")}</p>
          </ValidationSection>

          <ValidationSection
            title="Competitor Check"
            icon="⚔️"
            isVisible={analysisResult?.swotAnalysis}
          >
            <p>
              <strong>Threats:</strong>{" "}
              {analysisResult?.swotAnalysis?.threats?.join(", ")}
            </p>
          </ValidationSection>

          <ValidationSection
            title="Feasibility Score"
            icon="🎯"
            isVisible={analysisResult?.executiveSummary?.overallScore}
          >
            <div className="feasibility-score-container">
              <div className="score-display">
                <span className="score-value">
                  {analysisResult?.executiveSummary?.overallScore}
                </span>
                <span className="score-total">/ 100</span>
              </div>
              <div className="score-breakdown">
                <strong>
                  Recommendation:{" "}
                  {analysisResult?.executiveSummary?.recommendation}
                </strong>
              </div>
            </div>
          </ValidationSection>

          <ValidationSection
            title="Feedback & Suggestions"
            icon="💡"
            isVisible={analysisResult?.nextSteps}
          >
            <ul className="feedback-list">
              {analysisResult?.nextSteps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </ValidationSection>

          <ValidationSection
            title="Final Summary Report"
            icon="📄"
            isVisible={ideaData.status === "completed"}
          >
            <div className="report-preview">
              <h4>Validation Summary</h4>
              <p>
                <strong>Idea:</strong> {ideaData.title}
              </p>
              <p>
                <strong>Final Score:</strong>{" "}
                {analysisResult?.executiveSummary?.overallScore}/100
              </p>
              <p>
                <em>
                  Validated on:{" "}
                  {new Date(ideaData.createdAt).toLocaleDateString()}
                </em>
              </p>
            </div>
            <button
              onClick={() => navigate(`/report/${ideaId}`)}
              className="btn btn-primary"
            >
              View Full Report
            </button>
          </ValidationSection>
        </div>

        <div className="page-actions">
          <a href={`/edit-idea/${ideaId}`} className="btn btn-secondary">
            Edit Idea
          </a>
          <a href={`/report/${ideaId}`} className="btn btn-accent">
            Download Full Report
          </a>
        </div>
      </div>
      <footer className="dashboard-footer">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default ValidationPage;
