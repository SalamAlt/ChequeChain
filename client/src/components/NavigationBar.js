import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const NavBar = () => {
  return(
    <nav class="navbar navbar-light bg-light navbar-fixed-top ">
    <div class="container-fluid">
      <div class="navbar-header">
        <Link to ='/' className="brand-logo"><img className='logo' src={logo}></img></Link>
      </div>
      <ul class="nav navbar-nav">
        <li><Link to='/blocks'>Blocks</Link></li>
        <li><Link to='/conduct-transaction'>Conduct a Transaction</Link></li>
        <li><Link to='/transaction-pool'>Transaction Pool</Link></li>
      </ul>
      </div>
    </nav>
  )
}

export default NavBar;
