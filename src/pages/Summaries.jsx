import React from 'react'
import './Summaries.css'
import Navbar from '../components/navbar/navbar'
import Searchbar from '../components/searchbar/Searchbar'

const Summaries = () => {

  return (
    <div className='Summaries'>
      <Navbar/>
      <div className='search-bar-container'>
        <Searchbar/>
      </div>
    </div>
  )
}

export default Summaries
