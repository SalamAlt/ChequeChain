import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'

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
            <div className='App'>
                <br />
                <Navbar />
                <div>
                    Welcome to the blockchain...
                </div>
                <br />
                <div><Link to='/blocks'>Blocks</Link></div>
                <div><Link to='/write-cheque'>Write a cheque</Link></div>
                <div><Link to='/deposit-cheque'>Deposit a cheque</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                <div><Link to='/show-bank-wallets'>Show Bank Wallets</Link></div>
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