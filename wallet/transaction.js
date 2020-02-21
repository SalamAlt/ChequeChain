const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Transaction {
	constructor({ senderWallet, recipient, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance, outputMap, input }){
	//constructor({ senderWallet, recipient, amount, outputMap, input }){
		this.id = uuid();
		/*this.chequeID = chequeID;
		this.transitNumber = transitNumber;
		this.institutionNumber = institutionNumber;
		this.accountNumber = accountNumber;
		this.clientName = clientName;
		this.chequeBalance = chequeBalance;*/

		//this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
		this.outputMap = outputMap || this.createOutputMap({ recipient, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance });
		//this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
		this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance });
	}

	createOutputMap({ recipient, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance }) {
	//createOutputMap({ senderWallet, recipient, amount }) {
		const outputMap = {};

		//outputMap[recipient] = amount;
		//outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
		
		outputMap[1] = chequeID;
		outputMap[2] = transitNumber;
		outputMap[3] = institutionNumber;
		outputMap[4] = accountNumber;
		outputMap[5] = clientName;
		outputMap[6] = chequeBalance;
		outputMap[7] = recipient; //payee

		return outputMap;
	}

	//createInput({ senderWallet, outputMap }) {
	createInput({ senderWallet, outputMap, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance }) {
		return {
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.accountNumber,
			chequeID: chequeID,
			transitNumber: transitNumber,
			institutionNumber: institutionNumber,
			accountNumber: accountNumber,
			clientName: clientName,
			chequeBalance: chequeBalance,
			signature: senderWallet.sign(outputMap)
		};
	}

	//nsf?
	update ({ senderWallet, recipient, amount }) {
		if (amount > this.outputMap[senderWallet.publicKey]) {
			throw new Error('Amount exceeds balance');
		}

		if (!this.outputMap[recipient]) {
			this.outputMap[recipient] = amount;
		} else {
			this.outputMap[recipient] = this.outputMap[recipient] + amount;
		}

		this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

		this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
	}

	static validTransaction(transaction) {
		//const { input: { address, amount, signature }, outputMap } = transaction;
		const { input: { address, amount, signature, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance }, outputMap } = transaction;

		const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);
		/*
		if (amount !== outputTotal) {
			console.error(`Invalid transaction from ${address}`);
			return false;
		}

		if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
			console.error(`Invalid signature from ${address}`);
			return false;
		}
		*/
		return true;
	}
	/*
	static rewardTransaction({ minerWallet }) {
		return new this({ input: REWARD_INPUT, outputMap: { [minerWallet.publicKey]: MINING_REWARD } });
	}*/
}

module.exports = Transaction;