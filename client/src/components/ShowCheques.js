import React, { Component } from 'react';
import Navbar from './Navbar'

//nothing displaying in return method
//This class returns a page showing all cheques written by the bank/user
//currently just uses the bank address until we implement user stuff
//NEEDS: user address AND formatting!
class ShowCheques extends Component {
    state = { blocks: [], walletAddress: "", displayTransaction: false };

    //get bank wallets and map to a list or paragraph per bank
    componentDidMount() {
        let blocksTemp = [];
        let walletTemp = 0;

        fetch(`${document.location.origin}/api/blocks`)
            .then(response => response.json())
            .then(json => 
                this.setState({ blocks: json }))


        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json =>  this.setState({ walletAddress: json.address }))


    }

    toggleTransaction = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    }


    render() {
        console.log(this.state)
        let num = 1;

        return (
            <div>
                <Navbar />
                <h3>My Cheques {`${this.state.walletAddress.substring(0,20)}...`}</h3>
                {

                    this.state.blocks.map(block => {
                        block.data.map(transaction => {

                            //this needs work
                            console.log("transaction.input.address is " + transaction.input.address + " and walletAddress is " + this.state.walletAddress)
                            if (transaction.input.address == this.state.walletAddress) {
                                const { input, outputMap, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date } = transaction;
                                const recipient = Object.keys(outputMap);
                                console.log("entered")
                                return (   
                                    <div className='Transaction'>
                                        <hr />                   
                                        <div>To: {`${recipient[0].substring(0,20)}...`} | | Sent: {outputMap[recipient[0]]} Balance: {input.amount}</div>               
                                        <div>Cheque ID: {chequeID}</div>
                                        <div>Cheque Date: {date}</div>
                                        <div>Account Number: {accountNumber}</div>
                                        <div>Transit Number: {transitNumber}</div>
                                        <div>Institution Number: {institutionNumber}</div>
                                    </div>                                
                                )
                            }
                        })
                    })
                }
                {
                num == 1 &&
                    <div>No cheques that have been written by you have been deposited.</div>
                 }
            </div>
        );
    }
};
export default ShowCheques;