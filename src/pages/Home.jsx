import React from 'react'
import Navbar from '../components/navbar/navbar'
import Hero from '../components/hero/hero'
import Guide from '../components/guide/Guide'
import Title from '../components/title/Title'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <div className='container'>
        <Title/>
        <Guide/>
      </div>
    </div>
  )
}

export default Home
