import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Hero from '../components/hero/Hero'
import PollingChart from '../components/charts/PollingChart'


const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <PollingChart/>
    </div>
  )
}

export default Home
