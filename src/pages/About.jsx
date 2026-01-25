import React from 'react'
import './About.css'
import Navbar from '../components/navbar/navbar'

const About = () => {
  return (
    <div className='about'>
        <Navbar/>
      <div className='about-left'>
        <h3>About The Manifesto Summarisation Project</h3>
        <h2>The goals of the project:</h2>
        <p>
            - Improve political engagement in the UK. <br></br>
            - Help people understand political manifestos better using summaries.<br></br>
            - Give further insight into political manifestos and parties through extra statistics.<br></br>
            - Visualise key data from political manifestos.<br></br>
            - Evaluate the summaries of political manifestos. <br></br>
            - Maintain political impartiality.
        </p>
        <h2>What is its' purpose?</h2>
        <p>
            The purpose of the Manifesto Summarisation Project is to improve a users' understanding of UK politics using summarised manifestos.
            It also aims to help this understanding with visualised data from the manifestos and key topic summaries.
            Being politically engaged is very important to the healthy function of democracy.
            This project is aiming to improve that engagement using summarisation algorithms to help people read manifestos.
            Most manifestos are long and include heavy use of political jargon. Having to read even a few of them is incredibly time consuming.
            It cannot be expected that people have the time and energy to put themselves through all that effort.
            In turn, this project wants to make it easier for people to understand the political leanings and key policies of the major parties in the UK without reading too much.
        </p>
        <h2>Does summarisation help?</h2>
        <p>
            That is part of this projects aim, to see if this model can really work.
            Summarisations have been shown to help people reconcile knowledge and remember key information.
            Of course, that does not necessarily mean it will help in this scenario.
            So studies and evaluations will be completed to highlight if it does help or not.
        </p>
        <h2>Does this project receive any funding?</h2>
        <p>
            This project does not receive any funding. 
            It is highly unlikely that the project will ever be funded as it could create a conflict of interest.
            The project is meant to be completely unbiased and to provide purely factual information on politics.
            If that is not the case, then the project has failed as it will be misleading people.
            The only fair funding source would be an impartial NGO without politicl ties or non-related advertisement.
            As of right now there are no plans for funding and the website does not provide any income.
            The running expenses of the website come completely out of pocket of the development team.
        </p>
        <h2>Does this project use any personal data?</h2>
        <p>
            There are no data collection processes on this website. 
            As of right now there is no need for the website to have any accounts or user data.
            This may change in the future as the website progresses and expands its applications.
            Even if there are accounts in the future, data collection is not something the project would ever do.
            Data collection does not pose useful as most metrics collected would be meaningless. 
            Surveys and Questionnaires are more likely data collection methods for the future to gauge user feelings.
        </p>
      </div>
      <div className='about-right'>
        <h3>FAQs</h3>
        <h2>Where is the data from?</h2>
        <p>
            The data is all sourced either from the public political manifestos from the most recent general election (June 2024), The Public Whip dataset, or the electiondatavault.
            To access this data check out the Raw Data page where you can access each complete manifesto other data sources.
            Data from The Public Whip or the electiondatavault is sourced daily from their websites to ensure the most up to date information is available.
        </p>
        <h2>Why do some topics not have as complete summaries?</h2>
        <p>
            Some topics do not appear as much in certain manifestos.
            This means during summarisation there is less information for the model to pull from.
            Therefore the summaries may be shorter or less detailed.
        </p>
        <h2>I don't know what to do on the website?</h2>
        <p>
            The main purpose of the website is the Summaries page.
            Here you can select one or two (if you want to compare) political parties and see their manifestos summarised.
            There are more ideas and features to come in the future, but for now that is the main focus.
        </p>
        <h2>What is sentiment analysis?</h2>
        <p>
            Sentiment analysis is a process which extracts the overall feeling of a text with a value between 1 and -1. 1 is the most positive, -1 is the most negative.
            For each manifesto the text was broken down into sentences. Each sentence was then analysed using NLTK (natural language tool kit) to assess its sentiment.
            The values were then averaged out for the whole manifesto leaving one value. The ranking is how high (positively) the manifesto ranked in comparison with the others.
        </p>
      </div>
    </div>
  );
};

export default About
