import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
// html2canvas is no longer needed for this method
import './ReportPage.css';
import Navbar from './Navbar';
import api from '../api/axiosConfig';

const ReportPage = () => {
    const { ideaId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState('');

    // --- PDF Download Functionality (Updated) ---
    const handleDownloadPdf = () => {
        setIsDownloading(true);
        const reportElement = document.getElementById('report-sheet');
        
        // A4 page width in points is 595. We'll leave some margin.
        const pdfWidth = 595;
        const margin = 10; // 20 points margin on each side
        const contentWidth = pdfWidth - (margin * 2);

        const pdf = new jsPDF('p', 'pt', 'a4');

        pdf.html(reportElement, {
            callback: function (pdf) {
                const filename = `Report-${reportData.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                pdf.save(filename);
                setIsDownloading(false);
            },
            margin: [margin, margin, margin, margin],
            autoPaging: 'text', // Handles page breaks for long content
            width: contentWidth, // Set the width of the content area
            windowWidth: reportElement.scrollWidth, // Tell jsPDF the original width
        }).catch(err => {
            console.error("Error generating PDF:", err);
            alert("Sorry, there was an error creating the PDF.");
            setIsDownloading(false);
        });
    };


    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError("Authentication required.");
                    setIsLoading(false);
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await api.get(`/api/ideas/${ideaId}`, config);
                
                if (response.data.status !== 'completed' || !response.data.analysisResult) {
                     setError("Analysis for this idea is not yet complete. Please check back later.");
                } else {
                    setReportData(response.data);
                }

            } catch (err) {
                console.error("Failed to fetch report data:", err);
                setError("Could not load the report. The idea may not exist or you may not have permission.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, [ideaId]);

    if (isLoading) {
        return (
            <div className="report-page-wrapper">
                <Navbar />
                <div className="report-page-container"><p style={{color: 'white', textAlign: 'center'}}>Loading Report...</p></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="report-page-wrapper">
                <Navbar />
                <div className="report-page-container"><p style={{color: 'var(--danger-color)', textAlign: 'center'}}>{error}</p></div>
            </div>
        );
    }

    const { title, pitch, createdAt, analysisResult } = reportData;
    const { executiveSummary, swotAnalysis, nextSteps } = analysisResult;

    return (
        <div className="report-page-wrapper">
            <Navbar />
            <div className="report-page-container">
                <div className="report-actions-header">
                    <h2>Validation Report</h2>
                    <button className="btn btn-accent" onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? 'Generating...' : 'Download as PDF'}
                    </button>
                </div>

                <div className="report-sheet" id="report-sheet">
                    <header className="report-header">
                        <h1>{title}</h1>
                        <p>Validation Report as of {new Date(createdAt).toLocaleDateString()}</p>
                    </header>

                    <section className="report-section summary">
                        <h3>Executive Summary</h3>
                        <p><strong>One-Line Pitch:</strong> {pitch}</p>
                        <div className="summary-score">
                            <span>Overall Feasibility Score</span>
                            <span className="score-number">{executiveSummary.overallScore}</span>
                        </div>
                        <p><strong>Recommendation:</strong> {executiveSummary.recommendation}</p>
                        <h4>Key Findings:</h4>
                        <ul>
                            {executiveSummary.keyFindings.map((finding, index) => (
                                <li key={index}>{finding}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="report-section">
                        <h3>1. SWOT Analysis</h3>
                        <div className="swot-container">
                            <div className="swot-column">
                                <h4>Strengths</h4>
                                <ul>{swotAnalysis.strengths.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </div>
                            <div className="swot-column">
                                <h4>Weaknesses</h4>
                                <ul>{swotAnalysis.weaknesses.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </div>
                            <div className="swot-column">
                                <h4>Opportunities</h4>
                                <ul>{swotAnalysis.opportunities.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </div>
                            <div className="swot-column">
                                <h4>Threats</h4>
                                <ul>{swotAnalysis.threats.map((item, i) => <li key={i}>{item}</li>)}</ul>
                            </div>
                        </div>
                    </section>
                    
                    <section className="report-section">
                        <h3>2. Actionable Next Steps</h3>
                        <ol>
                            {nextSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </section>

                    <footer className="report-footer">
                        <p>This report was generated by Startalyze. It is intended for informational purposes and is not a guarantee of success.</p>
                    </footer>
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
