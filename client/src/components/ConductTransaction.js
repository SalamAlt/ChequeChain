import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
const axios = require('axios');
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
        this.setState({ chequeID: Number(event.target.value) })
    }

	updateTransitNumber = event => {
		this.setState({ transitNumber: Number(event.target.value) }); 
	}

	updateInstitutionNumber = event => {
		this.setState({ institutionNumber: Number(event.target.value) }); 
	}

	updateClientName = event => {
		this.setState({ clientName: event.target.value }); 
	}

	updateAccountNumber = event => {
	this.setState({ accountNumber: Number(event.target.value) }); 
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

		axios.post('http://52.91.213.183/cheques', {
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
					placeholder='mm/dd/yyyy'
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