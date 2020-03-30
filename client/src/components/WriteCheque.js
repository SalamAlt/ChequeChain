import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
const axios = require('axios');
import Navbar from './Navbar'

class WriteCheque extends Component {
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
		let balance = 1000;
		fetch(`${document.location.origin}/api/wallet-info`)
		.then(response => { return response.json() })
		.then(json => {
			balance = json.balance;		      
			console.log(balance);
		})   


		if(isNaN(chequeID) || isNaN(amount) || isNaN(transitNumber) || isNaN(institutionNumber) || isNaN(accountNumber)){
			alert("One more of your fields contains characters/special characters.");
		} else if(!clientName.match(/^[a-zA-Z\s]+$/) || !recipient.match(/^[a-zA-Z\s]+$/)) {
			if(!clientName.match(/^[a-zA-Z\s]+$/))
				alert("Please make sure the client name only contains characters.");
			else 
				alert("Please make sure the recipient only contains characters.");
		} else if(chequeID === "" || recipient === "" || amount === "" || transitNumber === "" || institutionNumber === "" || accountNumber === "" || clientName === ""){
			alert("Please check to see if your fields contain information.");
		} else if(chequeID.length != 3 || transitNumber.length != 5 || institutionNumber.length != 3 || accountNumber.length != 7){
			if(chequeID.length != 3)
				alert("Please make sure the cheque ID has three numbers.");
			else if(transitNumber.length != 5)
				alert("Please make sure transit number has five numbers.");
			else if(institutionNumber.length != 3)
				alert("Please make sure the institution number has three numbers.");
			else
				alert("Please make sure the account number has seven numbers.");
		} else if(institutionNumber.match(/(.)\1{2,}/) || accountNumber.match(/(.)\1{3,}/) || transitNumber.match(/(.)\1{3,}/)){
			if(accountNumber.match(/(.)\1{3,}/))
				alert("Please make sure the account number does not contain repeating numbers.");
			else if(institutionNumber.match(/(.)\1{2,}/))
				alert("Please make sure the institution number does not contain repeating numbers.");
			else
				alert("Please make sure the transit number does not contain repeating numbers.");
		}//end of if block
		else {
			axios.post('https://chequechain.wasplabs.ca/cheques', {
				balance: balance,
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
				alert("Successfully created a cheque.")
				history.push('/');
			}).catch(err => {
				console.log(err);
			});
		} //end of else block
    }

    render() {
        return (
			<div>
			<Navbar />
            <div className="ConductTransaction mt-2">
                <h3>Write a Cheque</h3>
				<br />
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
			</div>
        )
    }
}

export default WriteCheque;