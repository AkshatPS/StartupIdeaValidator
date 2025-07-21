import React from "react";
import "./ReportPage.css";
import Navbar from "./Navbar"; // The persistent dashboard navbar

// In a real app, you'd use a library like jsPDF and html2canvas
// This function is a placeholder to show where the logic would go.
const handleDownloadPdf = () => {
  console.log("Initiating PDF download...");
  alert(
    "PDF download functionality would be implemented here using a library like jsPDF."
  );
  // Example with jsPDF:
  // const reportElement = document.getElementById('report-sheet');
  // const pdf = new jsPDF('p', 'pt', 'a4');
  // pdf.html(reportElement, {
  //     callback: function (pdf) {
  //         pdf.save('validation-report.pdf');
  //     }
  // });
};

// Mock data that would be fetched based on the :ideaId
const mockReportData = {
  id: "xyz789",
  title: "Eco-friendly Food Delivery App",
  pitch: "A platform to deliver zero-waste meals from local vendors.",
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  score: 72,
  marketAnalysis:
    "The idea aligns with a significant and growing trend in consumer demand for sustainable products. Market data indicates a 25% year-over-year increase in searches for 'sustainable food', suggesting strong potential for early adoption.",
  competitors: [
    {
      name: "EcoEats UK",
      notes:
        "Focuses on reusable containers but has limited regional presence.",
    },
    {
      name: "Swiggy Green",
      notes:
        "Offers carbon-neutral delivery as an add-on, but not a core feature.",
    },
  ],
  feasibilityBreakdown: [
    { factor: "Market Size", score: "25/30" },
    { factor: "Business Model Clarity", score: "15/20" },
    { factor: "Innovation Factor", score: "12/20" },
    { factor: "Technical Feasibility", score: "20/30" },
  ],
  suggestions: [
    "Consider a B2B model targeting corporate offices for recurring revenue.",
    "Niche down initially to a specific cuisine (e.g., vegan) to capture a dedicated user base.",
    "Gamify sustainability by rewarding users for returning packaging.",
  ],
};

const ReportPage = () => {
  return (
    <div className="report-page-wrapper">
      <Navbar />
      <div className="report-page-container">
        <div className="report-actions-header">
          <h2>Validation Report</h2>
          <button className="btn btn-accent" onClick={handleDownloadPdf}>
            Download as PDF
          </button>
        </div>

        {/* This div is styled to look like a sheet of paper */}
        <div className="report-sheet" id="report-sheet">
          <header className="report-header">
            <h1>{mockReportData.title}</h1>
            <p>Validation Report as of {mockReportData.date}</p>
          </header>

          <section className="report-section summary">
            <h3>Executive Summary</h3>
            <p>
              <strong>One-Line Pitch:</strong> {mockReportData.pitch}
            </p>
            <div className="summary-score">
              <span>Overall Feasibility Score</span>
              <span className="score-number">{mockReportData.score}</span>
            </div>
          </section>

          <section className="report-section">
            <h3>1. Market Fit Analysis</h3>
            <p>{mockReportData.marketAnalysis}</p>
          </section>

          <section className="report-section">
            <h3>2. Competitor Landscape</h3>
            <ul>
              {mockReportData.competitors.map((comp) => (
                <li key={comp.name}>
                  <strong>{comp.name}:</strong> {comp.notes}
                </li>
              ))}
            </ul>
          </section>

          <section className="report-section">
            <h3>3. Feasibility Score Breakdown</h3>
            <table className="score-table">
              <tbody>
                {mockReportData.feasibilityBreakdown.map((item) => (
                  <tr key={item.factor}>
                    <td>{item.factor}</td>
                    <td>{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="report-section">
            <h3>4. AI-Powered Suggestions</h3>
            <ol>
              {mockReportData.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ol>
          </section>
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

export default ReportPage;
