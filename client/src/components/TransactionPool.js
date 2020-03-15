import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../history';
import Navbar from './NavigationBar';

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
        .then(response => response.json())
        .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransactions = () => {//Before the on click calls this, we may wish to execute the API function to verify the cheques, and then on success post them to the chain
        fetch(`${document.location.origin}/api/mine-transactions`)
        .then(response => {
            if (response.status === 200) {
                alert('success');
                history.push('/blocks');
            } else {
                alert('The mine-transactions block request did not complete.');
            }
        });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(
            () => this.fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        );
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    render() {
        return (
            <div className='TransactionPool'>
            <Navbar />
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
                <hr />
                <Button
                    bsStyle="danger"
                    onClick={this.fetchMineTransactions}
                    >
                        Submit Cheques For Clearance
                </Button>
            </div>
        )
    }
}

export default TransactionPool;
