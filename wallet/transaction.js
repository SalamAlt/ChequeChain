const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date, previousPoolBalance }){
        this.recipient = recipient;
        this.chequeID = chequeID || Math.floor(Math.random() * 1000); //Set the chequeID to the passed value or a random one
        this.id = uuid();
        this.inputAmount = amount;
		this.transitNumber = transitNumber || Math.floor(Math.random() * 1000);
		this.institutionNumber = institutionNumber || Math.floor(Math.random() * 1000);
		this.accountNumber = accountNumber || Math.floor(Math.random() * 1000);
		this.clientName = clientName || "Random Person";
        this.date = date || "01/01/2020";
        this.previousPoolBalance = previousPoolBalance || 0;
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount, previousPoolBalance });
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap});
    }

    createOutputMap({ senderWallet, recipient, amount, previousPoolBalance }) {
        const outputMap = {};
        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount - previousPoolBalance;
        //console.log("OutputMap subtracted amount "+amount+", and poolBalance " +previousPoolBalance )

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

    update({ senderWallet, recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date, balanceUpdate }) {
        if (amount > this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount exceeds balance');
        }

        this.outputMap[senderWallet.publicKey] += this.outputMap[this.recipient];
        this.outputMap[recipient] = amount;
        if (!this.outputMap[recipient]) {//These cases will need updating. This case describes when the `recipient` does not already exist...
            delete this.outputMap[this.recipient];
        }
        this.outputMap[senderWallet.publicKey] = 
            this.outputMap[senderWallet.publicKey] - amount;
        if (balanceUpdate){
            
        }
        
        this.recipient = recipient;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
        this.chequeID = chequeID;
        this.transitNumber = transitNumber || Math.floor(Math.random() * 1000);
		this.institutionNumber = institutionNumber || Math.floor(Math.random() * 1000);
		this.accountNumber = accountNumber || Math.floor(Math.random() * 1000);
		this.clientName = clientName || "Random Person";
        this.date = date || "01/01/2020";
    }

    static validTransaction({ transaction, finalAmount }) {
        const { input: { address, amount, signature}, outputMap } = transaction;

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount);

        /*if (amount !== outputTotal) {
            console.log("Amount: " +amount+ ", outputTotal: "+outputTotal+", finalAmount: "+finalAmount);
            console.error(`Invalid transaction from ${address}`);            
            return false;
        }*///FIX THIS CHECK!!!!///////
        
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