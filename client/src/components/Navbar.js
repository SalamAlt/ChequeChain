import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logo from '../assets/scotia-icon.png';

class Landing extends Component {
  logOut(e) {
    e.preventDefault()
    localStorage.removeItem('usertoken')
    this.props.history.push(`/`)
  }

  render() {
    const loginRegLink = (
      <ul className="navbar-nav" id="highlight">
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            <a className="navbar-brand text-uppercase ml-5">Login&nbsp;<i class="fas fa-sign-in-alt"></i></a>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            <a className="navbar-brand text-uppercase ml-5">Register&nbsp;<i class="fas fa-user-plus"></i></a>
          </Link>
        </li>
      </ul>
    )

    const userLink = (
      <ul className="navbar-nav" id="highlight">
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            <a className="navbar-brand text-uppercase ml-5">User</a>
          </Link>
        </li>
        <li className="nav-item">
          <a href="" onClick={this.logOut.bind(this)} className="nav-link">
            <a className="navbar-brand text-uppercase ml-5">Logout&nbsp;<i class="fas fa-sign-in-alt"></i></a>
          </a>
        </li>
      </ul>
    )

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          {/*<a className="navbar-brand ml-5" href="#"><img src={Scotia} style={{ width: '200px', height: '50px'}}/></a>*/}
          <a className="navbar-brand ml-5" href="https://www.scotiabank.com/ca/en/personal.html"><img src={logo} style={{ width: '35px'}}/></a>
          
          <div id="highlight">
            <a className="navbar-brand text-uppercase ml-5" href="/">Home&nbsp;<i class="fas fa-home"></i></a>
          </div>
          
          <button className="navbar-toggler" 
              type="button" data-toggle="collapse" 
              data-target="#navbarSupportedContent" 
              aria-controls="navbarSupportedContent" 
              aria-expanded="false" 
              aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto" id="underline">
              <li className="nav-item active">
                <a className="nav-link text-white text-uppercase ml-5" href="/blocks">Blocks <span className="sr-only">(current)</span></a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-white text-uppercase ml-5" href="/write-cheque">Write a Cheque <span className="sr-only">(current)</span></a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-white text-uppercase ml-5" href="/deposit-cheque">Deposit a Cheque <span className="sr-only">(current)</span></a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-white text-uppercase ml-5" href="/transaction-pool">Transaction Pool <span className="sr-only">(current)</span></a>
              </li>

              <li className="nav-item">
                <a className="nav-link text-white text-uppercase ml-5" href="/show-bank-wallets">Bank Wallets <span className="sr-only">(current)</span></a>
              </li>

			  
              <li className="nav-item">
                <a className="nav-link text-white text-uppercase ml-5" href="/show-cheques">Show Cheques <span className="sr-only">(current)</span></a>
              </li>

            </ul>
			{localStorage.usertoken ? userLink : loginRegLink}
          </div>
          {/*<a className="navbar-brand text-white text-uppercase ml-5" href="/login">Login&nbsp;<i class="fas fa-sign-in-alt"></i></a>*/}
          {/*<a className="navbar-brand text-white text-uppercase ml-5" href="/register">Register&nbsp;<i class="fas fa-user-plus"></i></a>*/}

        </nav>
    )
  }
}

export default withRouter(Landing)