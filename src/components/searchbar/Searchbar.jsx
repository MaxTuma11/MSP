import { useState } from 'react';
import { FaSpinner, FaQuestionCircle, FaTimes } from 'react-icons/fa'; //import search icon, spinner icon, question circle icon, and X icon
import './Searchbar.css';
import  { manifesto_layout } from './text_format.jsx'
import { TbListSearch } from "react-icons/tb";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled } from '@mui/material/styles';
import summarisedManifestos from '../../data/summarised_manifestos.json';



//list of topics that are used for the dropdown
const topics = [
  "Entire Manifesto",
  "Crime",
  "Economy",
  "Education",
  "Environment",
  "Healthcare",
  "Housing",
  "Immigration",
  "Defence",
  "Brexit"
];

const parties = [
  "Labour Party",
  "Conservative and Unionist Party",
  "Scottish National Party (SNP)",
  "Liberal Democrat Party",
  "Sinn Féin",
  "Plaid Cymru",
  "Green Party of England and Wales",
  "Reform UK",
  "Democratic Unionist Party (DUP)",
  "Alliance Party",
  "Traditional Unionist Voice (TUV)",
  "Ulster Unionist Party (UUP)",
  "Social Democratic and Labour Party (SDLP)",
]

const Searchbar = () => {
  const [result, setResult] = useState(null); //state for results
  const [result2, setResult2] = useState(null);
  const [selectedParty, setSelectedParty] = useState('Select Party'); //state for selected party
  const [selectedPartyToo, setSelectedPartyToo] = useState('Select Party Two');
  const [selectedTopic, setSelectedTopic] = useState("Select Topic"); //default the selected topic to summary
  const [loading, setLoading] = useState(false); //loading state for manifesto loading spinner
  const [showHelp, setShowHelp] = useState(false); //show help popup state
  const [displayedTopic, setDisplayedTopic] = useState("Select Topic");
  const [displayedParty, setDisplayedParty] = useState("Select Party");
  const [displayedParty2, setDisplayedParty2] = useState("Select Party Two");
  const [compareMode, setCompareMode] = useState(false);

  //styled switch for compare mode
  const PinkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#04001f',
      '&:hover': {
        backgroundColor: alpha('#04001f', theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#04001f',
    },
  }));
  
  //function to fetch manifesto summary
  const fetchManifestoSummary = () => {
    setLoading(true);
    setResult(null);
    setResult2(null);

    setDisplayedTopic(selectedTopic);
    setDisplayedParty(selectedParty);
    if (compareMode) {
      setDisplayedParty2(selectedPartyToo);
    }

    try {
      const partyData = summarisedManifestos[selectedParty];

      if (!partyData) {
        setResult('Party not found. Please select a valid party.');
        return;
      }

      const topicData = partyData[selectedTopic.toLowerCase()];

      if (!topicData) {
        setResult('Topic not found. Please select a valid topic.');
        return;
      }

      setResult(topicData);

      // ----- COMPARE MODE -----
      if (compareMode) {
        if (selectedPartyToo === "Select Party Two") {
          setResult2('Please select a party to display the summarised manifesto');
          return;
        }

        const partyData2 = summarisedManifestos[selectedPartyToo];

        if (!partyData2) {
          setResult2('Party not found. Please select a valid party.');
          return;
        }

        const topicData2 = partyData2[selectedTopic.toLowerCase()];

        if (!topicData2) {
          setResult2('Topic not found. Please select a valid topic.');
          return;
        }
        setResult2(topicData2);
      }

    } catch (error) {
      console.error('Error reading manifesto data:', error);
      setResult('Error loading manifesto data. Please try again later.');
    } finally {
      setTimeout(() => setLoading(false), 2000 + Math.random() * 2000);
    }
  };

  const renderManifestoHelper = (manifestoResult) => {
    return manifesto_layout(manifestoResult).map((block,i) => {
      if (block.type === 'heading') {
        return <h3 key={i}>{block.text}</h3>;
      }
      if (block.type === 'list') {
        return (
          <ul key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        );
      }
      if (block.type === 'separator') {
        return (
          <div key={i} className="separator">
            {block.text}
          </div>
        );
      }
      return <p className='man-text' key={i}>{block.text}</p>;
    });
  }

  //toggle help
  const toggleHelp = () => setShowHelp(!showHelp);

  //toggle compare mode
  const toggleCompare = (event) => setCompareMode(event.target.checked);

  return (
    <>
      <div className="search-bar">

        <div className="search-icon-holder" onClick={fetchManifestoSummary}>
          <TbListSearch id="search-icon" />
        </div>
      
        <select className="party-dropdown" value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)}>
          <option value="Select Party" disabled hidden>Select Party</option>
          {parties.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>

        { compareMode && (
          <select className="party-dropdown" value={selectedPartyToo} onChange={(e) => setSelectedPartyToo(e.target.value)}>
            <option value="Select Party Two" disabled hidden>Select Party Two</option>
            {parties.map((party) => (
              <option key={party} value={party}>
                {party}
              </option>
            ))}
          </select>
        )}

        <select className="topic-dropdown" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
          <option value="Select Topic" disabled hidden>Select Topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <div className="search-controls-right">
          <FormControlLabel control={<PinkSwitch color="secondary" checked={compareMode} onChange={toggleCompare} />} label="Compare Summaries:" labelPlacement="start" />

          <button className="help-button" onClick={toggleHelp}>
            <FaQuestionCircle id="question"/>
          </button>
        </div>
        {showHelp && (
          <div className="help-popup">
            <button className="close-button" onClick={toggleHelp}>
              <FaTimes />
            </button>
            <h3>How to Use the Searchbar</h3>
            <p>Select the name of the party whos maifesto you want to summarise in the party dropdown.</p>
            <p>Select a topic by which you want to summarise the manifesto (can be the whole thing).</p>
            <p>Press the search button on the left side of the searchbar.</p>
          </div>
        )}
      
      </div>

      {loading ? (
        <div className="result">
          <div className="loading">
            <div className="loading-content">
              <FaSpinner className="spinner" />
              <h2>
                {compareMode ? "Summarising Manifestos..." : "Summarising Manifesto..."}
              </h2>
            </div>
          </div>
        </div>
      ) : (
        result !== null && (
          <div className='results-container'>
            {compareMode && result2 !== null ? (
              <div className="comparison-view">
                <div className="manifesto-column">
                  <div className="manifesto-content">
                    <h2>{displayedTopic}: {displayedParty}</h2>
                    {renderManifestoHelper(result)}
                  </div>
                </div>
                <div className="manifesto-column">
                  <div className="manifesto-content">
                    <h2>{displayedTopic}: {displayedParty2}</h2>
                    {renderManifestoHelper(result2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="result">
                <h2>{displayedTopic}: {displayedParty}</h2>
                {renderManifestoHelper(result)}
              </div>
            )}
           
          </div>
          )
      )}
    </>
  );
};

export default Searchbar;