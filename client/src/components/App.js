import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Jumbotron, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    state = { walletInfo: {} }; //IMPORTANT FOR DISPLAYING WALLET INFO. START HERE. Section 10 - 97

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json }));
    }

    //the NavBar below adds the navbar
    render() {
        const { address, balance } = this.state.walletInfo;

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
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;