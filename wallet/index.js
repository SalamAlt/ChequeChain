const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');

class Wallet {
	constructor() {
		this.balance = STARTING_BALANCE;

		this.keyPair = ec.genKeyPair();

		this.publicKey = this.keyPair.getPublic().encode('hex'); //public key encoded in hex form
	}

	sign(data) {
		return this.keyPair.sign(cryptoHash(data))
	}

	createTransaction({ recipient, chain, chequeID, transitNumber, institutionNumber, accountNumber, clientName, chequeBalance }) {
		if (chain) {
			this.balance = Wallet.calculateBalance({ chain, address: this.publicKey });
		}

		/*(if (amount > this.balance){
			throw new Error('Amount exceeds balance');
		}*/

		//return new Transaction({ senderWallet: this, recipient, amount });
		return new Transaction({ senderWallet: this, recipient, chequeID,  transitNumber, institutionNumber, accountNumber, clientName, chequeBalance });
	}

	static calculateBalance({ chain, address }) {
		let hasConductedTransaction = false;
		let outputsTotal = 0;

		for (let i=chain.length-1; i>0; i--){
			const block = chain[i];

			for (let transaction of block.data){
				if (transaction.input.address === address){
					hasConductedTransaction = true;
				}

				const addressOutput = transaction.outputMap[address];

				if (addressOutput) {
					outputsTotal = outputsTotal + addressOutput;
				}
			}

			if (hasConductedTransaction){
				break;
			}
		}

		return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
	}
}

module.exports = Wallet; //gives access to this class to everything in blockchain folder