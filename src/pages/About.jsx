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
        <h2>Stop words for counting manifesto words.</h2>
        <p>
            Stop words exist to remove common words which add little context or information. Ignoring them allows us to focus on more important words which revolve around policies and politcal feelings. <br></br><br></br>
            NLTK corpus stopwords: i, me, my, myself, we, our, ours, ourselves, you, your, yours, yourself, yourselves, he, him, his, himself, she, her, hers, herself, it, its, itself, they, them, 
            their, theirs, themselves, what, which, who, whom, this, that, these, those, am, is, are, was, were, be, been, being, have, has, had, having, do, does, did, doing, a, an, the, and, 
            but, if, or, because, as, until, while, of, at, by, for, with, about, against, between, into, through, during, before, after, above, below, to, from, up, down, in, out, on, off, over, 
            under, again, further, then, once, here, there, when, where, why, how, all, any, both, each, few, more, most, other, some, such, no, nor, not, only, own, same, so, than, too, very, 
            s, t, can, will, just, don, should, now. <br></br> <br></br>
            Additional custom stopwords: "manifesto", "manifestos", "party", "parties", "will", "also", "would", "ensure", "labour", "alliance", "conservative", "dup", "green", "greens", "liberal", "democrats",
            "plaid", "cymru", "sdlp", "sinn", "féin", "snp", "tuv", "uup", "v", "2023", "2024", "2025", "elected", "x", "government".
        </p>
        <h2>Policy Breakdown.</h2>
        <p>
            The policy breakdown counts the mention of key words to do with that topic and then counts how much the topics were mentioned in proportion to one another. 
            There are many topics this could be done for, however the same topics as the dropdown were selected for consistency.
            Words used: <br></br>
            "Crime": ["police", "crime", "justice", "law", "prison", "safety"], <br></br>
            "Economy": ["tax", "budget", "growth", "investment", "business", "inflation", "jobs"],<br></br>
            "Education": ["school", "university", "student", "teacher", "learning", "college", "education"],<br></br>
            "Environment": ["climate", "carbon", "emissions", "renewable", "energy", "green", "pollution"],<br></br>
            "Health": ["nhs", "hospital", "doctor", "nurse", "health", "medicine", "treatment"],<br></br>
            "Housing": ["housing", "home", "rent", "mortgage", "affordable", "building"],<br></br>
            "Immigration": ["border", "migrant", "visa", "asylum", "immigration", "citizenship", "refugee", "boats"],<br></br>
            "Transport": ["rail", "bus", "train", "transport", "road", "highway", "infrastructure"]
        </p>
      </div>
      <div className='about-right'>
        <h3>FAQs</h3>
        <h2>Where is the data from?</h2>
        <p>
            The data is all sourced either from the public political manifestos from the recent general election (June 2024) or The Public Whip dataset.
            To access this data check out the Raw Data page where you can access each complete manifesto and The Public Whip data.
            An important note is that the data was last collected on the 7th of February 2025. 
            The data will be updated as much as possible. However, there are times where the data will not be up to date (especially party statistics).
            A big priority of the project is to keep manifestos as up to date as possible around election time.
            Election times will be when this website is most used so manifestos and party data will be updated much more often then to keep users as informed as possible.
        </p>
        <h2>Why are there errors in some summaries?</h2>
        <p>
            Summarisation isn't perfect, this website is still a work in progress. 
            As time goes on the summaries will become better and more concise.
            As of right now most of the summaries are good and represent the manifesto well, even if there are slight errors in wording or punctuation.
            With AI becoming better and more efficient, the summarisations will improve to help users better understand the manifestos.
            However, if you spot a glaring issue or something you believe is incorrect please email the issue to: mt2023@hw.ac.uk.
        </p>
        <h2>Why do some topics not have summaries?</h2>
        <p>
            Some parties either have very short manifestos or a certain topic in that manifesto is almost entirely excluded.
            Because of this, when summarisation happens, some of the summaries are either too short or irrelevant to the topic.
            Rather than displaying this, the website will present a message explaining the absense. 
            This also highlights a key issue with summarising many the manifestos.
            They are all different. Some manifestos will summarise better than others due to format, wording, and more.
            As time goes on, hopefully more of these issues will be resolved, but for now this is how it is.
        </p>
        <h2>Why does Sinn Fein have zero party stats with 7 MPs?</h2>
        <p>
            Sinn Fein does not actively partake in government activity in Westminster as a sign of protest.
            They believe that since British political institutions should play no part in governing Ireland,
            they as MPs should not make decisions on behalf of the British people.
            Therefore they have 0% on every metric as there is no data on them.
        </p>
        <h2>I don't know what to do on the website?</h2>
        <p>
            Check out the user guide on the Home page. You can find it by scrolling down from the welcome message.
            If you want a quick idea: <br></br>
            - Go to the Manifesto Summaries page. <br></br>
            - Search one of the main UK political parties in the search bar. <br></br>
            - Read through the summaries and check out the additional statistics.
        </p>
        <h2>What do the politcal statistics mean?</h2>
        <p>
            There are two main statistics shown on the page. Attendance and Rebellion. <br></br>
            To begin with attendance can be explained. The attendance is just how much a MP (Member of Parliament) goes to vote in UK parliament.
            Each MP has an attendance value which varies from 0-100%. 0% meaning they have never attended any votes in Westminster after becoming an MP, 100% means they have attended every single one since becoming an MP.
            It is important to say there are many reasons why MPs may not attend many votes such as ministerial duties or being the speaker for the vote. The stat displayed is the average for each party based on all their MPs. <br></br><br></br>

            Rebellion is about how often an MP will vote against their party. Again these values range from 0-100%, where 0% means they voted according to their parties policy every time, and 100% would mean they voted against their party in every vote.
            The displayed metric is also an average for each party. <br></br><br></br>

            These metrics are interesting, however they do not paint the whole picture of the party, e.g. see Sinn Fein above.
        </p>
        <h2>What is sentiment analysis?</h2>
        <p>
            Sentiment analysis is a process which extracts the overall feeling of a text with a value between 1 and -1. 1 is the most positive, -1 is the most negative.
            For each manifesto the text was broken down into sentences. Each sentence was then analysed using NLTK (natural language tool kit) to assess its sentiment.
            The values were then averaged out for the whole manifesto leaving one value. The ranking is how high (positively) the manifesto ranked in comparison with the others.
        </p>
        <h2>What is the pronoun count for?</h2>
        <p>
            Pronoun count is available so you can see how the manifesto addresses itself or the readers. There is a breakdown of proportionally how much each pronoun is used.
            This way you can assess how the manifesto views the readers and what types of messages it is trying to convey.
        </p>
      </div>
    </div>
  );
};

export default About
