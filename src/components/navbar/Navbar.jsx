import React, { useEffect, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/MSPLogoN.png'
import { Link } from "react-router-dom"

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 100 ? setSticky(true) : setSticky(false)
    })
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`container ${sticky ? 'show-nav' : 'unshow-nav'}`}>
      <Link to="/"><img src={logo} alt="" className='logo'/></Link>
      
      <button 
        className="hamburger" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={mobileMenuOpen ? 'mobile-menu-open' : ''}>
        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
        <li><Link to="/Summaries" onClick={closeMobileMenu}>Manifesto Summaries</Link></li>
        <li><Link to="/Data" onClick={closeMobileMenu}>Raw Data</Link></li>
        <li id='about'><Link to="/About" className='btn' onClick={closeMobileMenu}>About Us</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar