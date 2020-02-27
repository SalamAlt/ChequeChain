import React from 'react';

const Transaction = ({ transaction })  => {
    const { input, outputMap, chequeID, transitNumber, institutionNumber, accountNumber, clientName } = transaction;//make sure to add variables being grabbed from transaction
    const recipients = Object.keys(outputMap); //recipients array
    
    return (
        <div className='Transaction'>
            <div>From: {`${input.address.substring(0,20)}...`} | Balance: {input.amount}</div>
            {
                recipients.map(recipient => { 
                    if(recipient === input.address){//Checks if the address being display is the same as the sender, if so just display the new balance
                       return <div key={recipient}>New Balance of Sender: {outputMap[recipient]}</div> 
                    } else {
                    return (
                    <div key={recipient}>
                        To: {`${recipient.substring(0,20)}...`}| Sent: {outputMap[recipient]}
                    </div>)
                    } 
                })
            }
            <div>Cheque ID: {chequeID}</div>
            <div>Transit Number: {transitNumber}</div>
            <div>Institution Number: {institutionNumber}</div>
            <div>Account Number: {accountNumber}</div>
            <div>Client Name: {clientName}</div>
        </div>
    );
}

export default Transaction;