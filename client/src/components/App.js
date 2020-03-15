import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Navbar from './NavigationBar';

class App extends Component {
    state = { walletInfo: {} }; //IMPORTANT FOR DISPLAYING WALLET INFO. START HERE. Section 10 - 97

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { address, balance } = this.state.walletInfo;

        return (
            <div className='App'>
                <Navbar />
                <br />
                <div>
                    Welcome to the blockchain...
                </div>

                <br />
                <br />
                <div className ='WalletInfo'>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;
