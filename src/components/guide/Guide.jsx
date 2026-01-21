import React from 'react'
import './Guide.css'
import start from '../../assets/Start.png'
import sum from '../../assets/Sumpage.png'
import show from '../../assets/showpage.png'

const Guide = () => {
  return (
    <div className='guides'>
        <div className='guide'>
            <img src={start} alt=''/>
        </div>
        <div className='guide'>
            <img src={sum} alt=''/>
        </div>
        <div className='guide'>
            <img src={show} alt=''/>
        </div>
    </div>
  )
}

export default Guide
