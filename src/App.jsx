import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Summaries from './pages/Summaries'
import About from './pages/About'
import Data from './pages/Data'
import Quiz from './pages/Quiz'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Summaries" element={<Summaries/>}/>
        <Route path="/Data" element={<Data/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/Quiz" element={<Quiz/>}/>
      </Routes>
    </Router>
  )
}

export default App

