const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date }){
        this.recipient = recipient;
        this.chequeID = chequeID || Math.floor(Math.random() * 1000); //Set the chequeID to the passed value or a random one
        this.id = uuid();

		this.transitNumber = transitNumber || Math.floor(Math.random() * 1000);
		this.institutionNumber = institutionNumber || Math.floor(Math.random() * 1000);
		this.accountNumber = accountNumber || Math.floor(Math.random() * 1000);
		this.clientName = clientName || "Random Person";
        this.date = date || "01/01/2020";

        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap});
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};
        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap),
        };
    }

    update({ senderWallet, recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date }) {
        if (amount > this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount exceeds balance');
        }

        if (!this.outputMap[recipient]) {//These cases will need updating. This case describes when the `recipient` does not already exist...
            this.outputMap[senderWallet.publicKey] += this.outputMap[this.recipient];
            delete this.outputMap[this.recipient];
            this.outputMap[recipient] = amount;
        } else {//...and when the recipeient does exist. We may need when the cases are for when some other piece of info exists instead
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
            this.outputMap[senderWallet.publicKey] += this.outputMap[this.recipient];
        }//This is notably similar to the existingTransaction call made that matches the transaction with chequeID, except this is for deciding if any values *IN* the transaction
        //need special handling

        this.outputMap[senderWallet.publicKey] = 
            this.outputMap[senderWallet.publicKey] - amount;
        
        this.recipient = recipient;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
        this.chequeID = chequeID;
        this.transitNumber = transitNumber || Math.floor(Math.random() * 1000);
		this.institutionNumber = institutionNumber || Math.floor(Math.random() * 1000);
		this.accountNumber = accountNumber || Math.floor(Math.random() * 1000);
		this.clientName = clientName || "Random Person";
        this.date = date || "01/01/2020";
    }

    static validTransaction(transaction) {
        const { input: { address, amount, signature}, outputMap } = transaction;

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount);

        if (amount !== outputTotal) {
            console.error(`Invalid transaction from ${address}`);            
            return false;
        }
        
        if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
            console.error(`Invalid signature from ${address}`)
            return false;
        }

        return true;
    }

    static rewardTransaction({ minerWallet }) {
        return new this({
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        });
    }
}

module.exports = Transaction;