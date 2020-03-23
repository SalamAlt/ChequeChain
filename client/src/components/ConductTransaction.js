import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
const axios = require('axios');
const https = require('https');
import Navbar from './Navbar'

class ConductTransaction extends Component {
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

    conductTransaction = () => {//API insertion point #2
        const { recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date })
        }).then(response => response.json())
            .then(json => {
                alert(json.message || json.type);
                history.push('/transaction-pool');
            });

		const instance = axios.create({
			httpsAgent: new https.Agent({  
			rejectUnauthorized: false
			})
		});
		instance.get('https://54.89.144.88/cheques');

		// At request level
		const agent = new https.Agent({  
			rejectUnauthorized: false
		});

		axios.post('https://54.89.144.88/cheques', {
			httpsAgent: agent,
			balance: 1000,
			date: date,
			payee: recipient,
			payorSign: clientName,
			chequeId: chequeID,
			finInstNum: institutionNumber,
			tranNum: transitNumber,
			accountId: accountNumber,
			amount: amount
		}).then(response => {
			console.log(response);
		}).catch(err => {
			console.log(err);
		});
    }

    render() {
        return (
            <div className='ConductTransaction'>
				 <Navbar />
                <h3>Conduct a Transaction</h3>
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
                    onClick={this.conductTransaction}
                >
                    Submit
                </Button>
                </div>
            </div>
        )
    }
}

export default ConductTransaction;