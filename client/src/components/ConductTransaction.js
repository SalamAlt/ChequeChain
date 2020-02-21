import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
import DatePicker from "react-datepicker";

class ConductTransaction extends Component {
  //The values below may need to be initalized to zero for the number variables
  //Empty strings may cause error not sure but react reads as string first so may not
  state = { recipient: '', chequeID: '', transitNumber: '', institutionNumber: '', accountNumber: '', clientName: '', chequeBalance: '', knownAddresses: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then(response => response.json())
      .then(json => this.setState({ knownAddresses: json }));
  }

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateChequeID = event => {
    this.setState({ chequeID: Number(event.target.value) }); //react stores event values as string by default --> to convert to number add Number infront
  }

  updateTransitNumber = event => {
    this.setState({ transitNumber: Number(event.target.value) }); 
  }

  updateInstitutionNumber = event => {
    this.setState({ institutionNumber: Number(event.target.value) }); 
  }

  updateTransitNumber = event => {
    this.setState({ transitNumber: Number(event.target.value) }); 
  }

  updateClientName = event => {
    this.setState({ clientName: event.target.value }); 
  }

  updateChequeBalance = event => {
    this.setState({ chequeBalance: Number(event.target.value) }); 
  }

  updateAccountNumber = event => {
    this.setState({ accountNumber: Number(event.target.value) }); 
  }

  updateDate = event => {
    this.setState({ date: event.target.value }); 
  }

  conductTransaction = () => {
    const { chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance } = this.state; //removed recipient from

    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance }) //removed recipient from front
    }).then(response => response.json())
      .then(json => {
        alert(json.message || json.type);
        history.push('/transaction-pool');
      });
  }

  render() {
    return (
      <div className='ConductTransaction'>
        <Link to='/'>Home</Link>
        <h3>Conduct a Transaction</h3>
        <br />
        {
          this.state.knownAddresses.map(knownAddress => {
            return (
              <div key={knownAddress}>
                <div>{knownAddress}</div>
                <br />
              </div>
            );
          })
        }
        <br />
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
		  <h4>Cheque Balance</h4>
          <FormControl
            input='number'
            placeholder='Cheque Balance'
            value={this.state.chequeBalance}
            onChange={this.updateChequeBalance}
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
};

export default ConductTransaction;