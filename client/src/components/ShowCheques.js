import React, { Component } from 'react';
import Navbar from './Navbar'

//This class returns a page showing all cheques written by the bank/user
//currently just uses the bank address until we implement user stuff
//NEEDS: formatting!
class ShowCheques extends Component {
    state = { cheques: [], walletAddress: "", displayTransaction: false };

    componentWillMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
        .then(response => response.json())
        .then(json =>  this.setState({ walletAddress: json.address }))
    }

    componentDidMount() {
        fetch(`${document.location.origin}/api/myCheques`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: this.state.walletAddress
        })
            .then(response => response.json())
            .then(json => {
                let cheques_ = (json.trans_array).map(trans => {
                    const { input, outputMap, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date } = trans;
                    const recipient = Object.keys(outputMap);
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
                })  
                if (!cheques_)
                {
                    cheques_ =  (<div>No cheques that have been written by you have been deposited.</div>)
                }
                this.setState({ cheques: cheques_ })  
            })                

    }

    toggleTransaction = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    }


    render() {
        console.log(this.state)
        return (
            <div>
            <Navbar />
            <div clasName="empty mt-2">
                <h3>My Cheques | Wallet: {`${this.state.walletAddress.substring(0,20)}...`}</h3>
                {this.state.cheques}
            </div>
        </div>
        );
    }
};
export default ShowCheques;
