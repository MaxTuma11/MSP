import React from 'react';
import './PartyStats.css';

const PartyStats = ({ partyStats, overallAverageAttendance, overallAverageRebellion }) => {
  if (!partyStats) {
    return <div className="no-stats">No statistics available.</div>;
  }

  return (
    <div className="party-stats">
      <h2>Party Statistics For Voting In Westminster</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Average Attendance Rate:</span>
          <span className="stat-value">{partyStats.average_attendance_rate.toFixed(2)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Rebellion Rate:</span>
          <span className="stat-value">{partyStats.average_rebellion_rate.toFixed(2)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max Attendance Rate:</span>
          <span className="stat-value">{partyStats.max_attendance_rate.toFixed(2)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max Rebellion Rate:</span>
          <span className="stat-value">{partyStats.max_rebellion_rate.toFixed(2)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Min Attendance Rate:</span>
          <span className="stat-value">{partyStats.min_attendance_rate.toFixed(2)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Min Rebellion Rate:</span>
          <span className="stat-value">{partyStats.min_rebellion_rate.toFixed(2)}%</span>
        </div>
      </div>
      <div className="overall-stat">
        <span className="stat-label">Number of Party MPs: </span>
        <span className="stat-value">{partyStats.mp_count}</span>
      </div>
      <div className="overall-stat">
        <span className="stat-label">Government Average Attendance Rate: </span>
        <span className="stat-value">{overallAverageAttendance.toFixed(2)}%</span>
      </div>
      <div className="overall-stat">
        <span className="stat-label">Government Average Rebellion Rate: </span>
        <span className="stat-value">{overallAverageRebellion.toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default PartyStats;