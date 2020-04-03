import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Jumbotron, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    state = { walletInfo: {}, instNum: 0 }; //IMPORTANT FOR DISPLAYING WALLET INFO. START HERE. Section 10 - 97

    componentDidMount() {
		
			let instNum_ = 0;
		let walletInfo_ = {};
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json =>   this.setState({walletInfo: json})) 
		
		  fetch(`${document.location.origin}/api/instNum`)
        .then(response => response.json())
        .then(json => this.setState({instNum: json})) 
    
	//console.log(this.state.instNum)
	}

    //the NavBar below adds the navbar
    render() {
        const { address, balance } = this.state.walletInfo;
		const instNumber = this.state.instNum;
        return (
            <div>
                <Navbar />
                <div className='App'>
                    <Jumbotron fluid className="jumbo">
                        <div className="overlay"></div>
                            {/*<h1>Welcome to the Scotiabank Blockchain Network!</h1>
                            <p>You're Richer Than You Think</p>*/}
                    </Jumbotron>
                </div>
                <div className ='WalletInfo'>
					<div>Institution Number: {instNumber}</div>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;