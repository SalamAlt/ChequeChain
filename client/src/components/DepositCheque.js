import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
const axios = require('axios');
import Navbar from './Navbar'

class DepositCheque extends Component {
    state = { recipient: '', amount: '', chequeID: '', transitNumber: '', institutionNumber: '', accountNumber: '', clientName: '', date: ''};

    updateRecipient = event => {
        this.setState({ recipient: event.target.value })
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) })
    }

    updateChequeID = event => {
        this.setState({ chequeID: event.target.value })
    }

	updateTransitNumber = event => {
		this.setState({ transitNumber: event.target.value }); 
	}

	updateInstitutionNumber = event => {
		this.setState({ institutionNumber: event.target.value }); 
	}

	updateClientName = event => {
		this.setState({ clientName: event.target.value }); 
	}

	updateAccountNumber = event => {
	this.setState({ accountNumber: event.target.value }); 
	}

	updateDate = event => {
		this.setState({ date: event.target.value })
	}

    DepositCheque = () => {//API insertion point #2
        const { recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date } = this.state;
        const deposInstNum = process.env.INST_NUM;

        axios.get('https://chequechain.wasplabs.ca/cheques', {
            chequeId: chequeID,
            tranNum: transitNumber,
			finInstNum: institutionNumber,
            accountId: accountNumber,
            clientName: clientName
		}).then(response => {
            console.log(response);
            //response is an object with params: status, tokenizationString, balance, date, payee, payorsign
            //do checks such as comparing balance and amount, status, DATE, etc.... later




            //then put into blockchain
            fetch(`${document.location.origin}/api/transact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date, deposInstNum })
            }).then(response => response.json())
                .then(json => {
                    alert(json.message || json.type);
                    history.push('/transaction-pool');
                });
		}).catch(err => {
			console.log(err);
		});
        



    }

    render() {
        return (
            <div className='DepositCheque'>
				 <Navbar />
                <h3>Deposit A Cheque</h3>
                <FormGroup>
					<h4>Recipient</h4>
                    <FormControl
                        input='text'
                        placeholder='Recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
					<h4>Cheque Amount</h4>
                    <FormControl
                        input='number'
                        placeholder='Amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
				<FormGroup>
				  <h4>Name on Cheque</h4>
				  <FormControl
					input='text'
					placeholder='Full Name'
					value={this.state.clientName}
					onChange={this.updateClientName}
				  />
				</FormGroup>
				<FormGroup>
				  <h4>Date on Cheque</h4>
				  <FormControl
					input='text'
					placeholder='yyyy-mm-dd'
					value={this.state.date}
					onChange={this.updateDate}
				  />
				</FormGroup>
				<FormGroup>
					<h4>Cheque Number</h4>
					<FormControl
						input='number'
						placeholder='Cheque Number'
						value={this.state.chequeID}
						onChange={this.updateChequeID}
					/>
				</FormGroup>
				<FormGroup>
					<h4>Transit Number</h4>
					<FormControl
						input='number'
						placeholder='Transit Number'
						value={this.state.transitNumber}
						onChange={this.updateTransitNumber}
					/>
				</FormGroup>
				<FormGroup>
					<h4>Institution Number</h4>
					<FormControl
						input='number'
						placeholder='Institution Number'
						value={this.state.institutionNumber}
						onChange={this.updateInstitutionNumber}
					/>
				</FormGroup>
				<FormGroup>
					<h4>Account Number</h4>
					<FormControl
						input='number'
						placeholder='Account Number'
						value={this.state.accountNumber}
						onChange={this.updateAccountNumber}
					/>
				</FormGroup>
                <div>
                <Button
                    bsStyle="danger"
                    onClick={this.DepositCheque}
                >
                    Submit
                </Button>
                </div>
            </div>
        )
    }
}

export default DepositCheque;