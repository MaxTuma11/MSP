import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Summaries from './pages/Summaries'
import About from './pages/About'
import Data from './pages/Data'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Summaries" element={<Summaries/>}/>
        <Route path="/Data" element={<Data/>}/>
        <Route path="/About" element={<About/>}/>
      </Routes>
    </Router>
  )
}

export default App

