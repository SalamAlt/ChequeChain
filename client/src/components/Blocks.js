import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';
import Navbar from './Navbar'

class Blocks extends Component {
    state = { wallets};

    componentDidMount() {
        fetch(`${document.location.origin}/api/bank-wallets`)
        .then(response => response.json())
        .then(json => this.setState({ wallets: json }));
    }

    render() {
        console.log('this.state', this.state);

        return (
            <div>
                <Navbar />
                <h3>Bank Wallets</h3>
                {
                    Object.keys(this.state.wallets).map(key => {//for each block item
                        return (  
                            <li>Bank: {key}, Balance: {this.state.wallets[key]}</li> //render according to instructions in the Block.js file
                        );
                    })
                }
            </div>
        );
    }
}

export default Blocks;