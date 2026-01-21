import React, { useState } from 'react';
import './Graphs.css';
import BarChart from '../charts/BarChart';
import PartyStats from '../datadisplay/PartyStats';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import PartyAnalysis from '../datadisplay/PartyAnalysis';

const Graphs = ({ wordData, partyStats, overallAverageAttendance, trigramData, overallAverageRebellion, sentimentData, pronounData, policyData }) => {

  const [showHelp, setShowHelp] = useState({
    words: false,
    trigrams: false,
    stats: false,
    statsy: false,
  });

  if (!wordData || wordData.length === 0) {
    return <div className="no-charts"></div>;
  }

  const toggleHelp = (key) => {
    setShowHelp((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="graphs-container">
      {/* render the bar chart */}
      <div className="chart-item">
        <BarChart
          data={wordData}
          title="Most Common Words In The Manifesto"
        />
        <div className="chart-help">
          <button className="help-button2" onClick={() => toggleHelp('words')}>
            <FaQuestionCircle />
          </button>
        </div>
        {showHelp.words && (
          <div className="help-popup2">
            <button className="close-button2" onClick={() => toggleHelp('words')}>
              <FaTimes />
            </button>
            <h4>What This Chart Shows</h4>
            <p>This bar chart displays the most frequently used words in the manifesto.</p>
            <p>Common words may indicate key themes or priorities of the party.</p>
            <p>Check the About Us page for details on the stopwords used.</p>
          </div>
        )}
      </div>

      {/* Render the trigram chart */}
      <div className="chart-item">
        <BarChart
          data={trigramData.map((trigram) => [trigram.trigram, trigram.count])}
          title="Most Common Trigrams In The Manifesto"
        />
        <div className="chart-help">
          <button className="help-button2" onClick={() => toggleHelp('trigrams')}>
            <FaQuestionCircle />
          </button>
        </div>
        {showHelp.trigrams && (
          <div className="help-popup2">
            <button className="close-button2" onClick={() => toggleHelp('trigrams')}>
              <FaTimes />
            </button>
            <h4>What This Chart Shows</h4>
            <p>This bar chart displays the most common three-word phrases (trigrams) in the manifesto.</p>
            <p>It helps identify repeated messages and important policy terms.</p>
            <p>Check the About Us page for details on the stopwords used.</p>
          </div>
        )}
      </div>

      {/* render the PartyStats */}
      <div className="chart-item">
        <PartyStats partyStats={partyStats} overallAverageAttendance={overallAverageAttendance} overallAverageRebellion={overallAverageRebellion} />
        <div className="chart-help">
          <button className="help-button2" onClick={() => toggleHelp('stats')}>
            <FaQuestionCircle />
          </button>
        </div>
        {showHelp.stats && (
          <div className="help-popup2">
            <button className="close-button2" onClick={() => toggleHelp('stats')}>
              <FaTimes />
            </button>
            <h4>What This Section Shows</h4>
            <p>This section includes key statistics about the party, such as:</p>
            <p>- Attendance rates in Parliament.</p>
            <p>- Rebellion rates (how often members vote against their party).</p>
            <p>Compare these stats with the overall averages to see how the party performs.</p>
            <p>More information on what exactly these metrics mean can be found on the About Us page.</p>
          </div>
        )}
      </div>
      <div className="chart-item">
        <PartyAnalysis sentimentData={sentimentData} pronounData={pronounData} policyData={policyData} />
        <div className="chart-help">
          <button className="help-button2" onClick={() => toggleHelp('statsy')}>
            <FaQuestionCircle />
          </button>
        </div>
        {showHelp.statsy && (
          <div className="help-popup2">
            <button className="close-button2" onClick={() => toggleHelp('statsy')}>
              <FaTimes />
            </button>
            <h4>What This Section Shows</h4>
            <p>This section includes key statistics about the party, such as:</p>
            <p>- Sentiment analysis score (how positive or negative the sentences were, value between 1 and -1) and rank out of the parties.</p>
            <p>- Pronoun usage and the associated percentages.</p>
            <p>- Policy breakdown and how often the topics are mentioned in the manifesto.</p>
            <p>More information on what exactly these metrics mean can be found on the About Us page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Graphs;