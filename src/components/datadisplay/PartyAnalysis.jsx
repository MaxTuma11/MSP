import React from "react";
import "./PartyAnalysis.css";

const PartyAnalysis = ({ sentimentData, pronounData, policyData }) => {
  if (!sentimentData || !pronounData || !policyData) {
    return <div className="no-data">No data available.</div>;
  }

  return (
    <div className="party-analysis">
      <h2>Further Party Analysis & Breakdowns</h2>

      {/* Sentiment Score & Rank */}
      <div className="sentiment-info">
        <p>
          <strong>Sentiment Score:</strong> {sentimentData.sentiment_score.toFixed(2)}
        </p>
        <p>
          <strong>Rank:</strong> {sentimentData.rank}
        </p>
      </div>

      {/* Side-by-side Tables */}
      <div className="tables-container">
        {/* Pronoun Usage Table */}
        <div className="table-wrapper">
          <h3>Pronoun Usage</h3>
          <table>
            <thead>
              <tr>
                <th>Pronoun</th>
                <th>Usage (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pronounData).map(([pronoun, percentage]) => (
                <tr key={pronoun}>
                  <td>{pronoun}</td>
                  <td>{percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Policy Breakdown Table */}
        <div className="table-wrapper">
          <h3>Policy Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Policy Area</th>
                <th>Usage (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(policyData).map(([policy, percentage]) => (
                <tr key={policy}>
                  <td>{policy}</td>
                  <td>{percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartyAnalysis;
