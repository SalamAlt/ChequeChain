import React from 'react';

const Transaction = ({ transaction }) => {
  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  //chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance

  return (
    <div className='Transaction'>
      {/* <div>From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div> */}
      
        {/*recipients.map(recipient => ( */}
          <div>
          {/* <div key={outputMap[7]}> Line below is fucked*/}
            ClientName: {input.amount} | ChequeID: {input.chequeID} | Sent: {outputMap[5]}
          </div>
		  
    </div>
  );
}

export default Transaction;