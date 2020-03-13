import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';
import Navbar from './Navbar'

class ShowBankWallets extends Component {
    state = { wallets: {}};




    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`)
        .then(response => response.json())
        .then(json => this.setState({ wallets: json }));
    }

    render() {
        console.log('All baks', this.state);


        const items = []
        
        for (let i = 0; i < this.state.wallets.length; i++)
        {
           
                items.push(    <ul key = {wallet}>Bank wallet: {wallet}, Balance: {this.state.wallets[wallet]} </ul> )
            
        }

        return (
            <div>
                <Navbar />
                <h3>Bank wallets</h3>
                {
                {items}
                }
            </div>
        );
    }
}

export default ShowBankWallets;