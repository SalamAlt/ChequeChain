import React from 'react';

const Transaction = ({ transaction })  => {
    const { input, outputMap, chequeID } = transaction;//make sure to add variables being grabbed from transaction
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
            <div>ChequeID: {chequeID}</div>
        </div>
    );
}

export default Transaction;