import React, { Component } from 'react';
import Navbar from './Navbar'

class ShowBankWallets extends Component {
    state = { wallets: [] };

    //get bank wallets and map to a list or paragraph per bank
    componentDidMount() {
        fetch(`${document.location.origin}/api/bank-wallets`)
            .then(response => { return response.json() })
            .then(json => {
                let wallets = Object.keys(json.output).map((inst) => {
                    return (
                        <ul key = {inst}>Bank wallet: {inst}, Balance: {json.output[inst]} </ul>
                    )
                })
                this.setState({ wallets: wallets })           
            })           
    }

    render() {
        return (
            <div>
                <Navbar />
                <h3>Bank wallets</h3>

                {this.state.wallets}

            </div>
        );
    }
}
export default ShowBankWallets;