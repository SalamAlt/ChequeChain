import React, { Component } from 'react';
import Navbar from './Navbar'

class ShowBankWallets extends Component {
    state = { wallets: [] };

    //get bank wallets and map to a list or paragraph per bank
    componentDidMount() {
        fetch(`${document.location.origin}/api/bank-wallets`)
            .then(response => { return response.json() })
            .then(json => {
                let wallets = json.banks_array.map((bank) => {
                    return (
                    <ul key = {bank.name}>Name: {bank.name}({bank.instNum}), 
                    Balance: {bank.balance} </ul>
                    )
                })
                this.setState({ wallets: wallets })           
            })           
    }

    render() {
        return (
            <div>
                <Navbar />
                <div clasName="empty mt-2">
                <h3>Bank Wallets</h3>
                {this.state.wallets}
                </div>
            </div>
        );
    }
}
export default ShowBankWallets;