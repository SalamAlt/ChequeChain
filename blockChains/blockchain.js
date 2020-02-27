const Block = require('./block');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Blockchain {
	constructor(){
		this.chain = [Block.genesis()];
	}

	addBlock({ data }){
		const newBlock = Block.mineBlock({ //target the block class and call the static function mineBlock
			lastBlock: this.chain[this.chain.length-1], //this function takes two objects as a parameter lastBlock & data
			data
		});

		this.chain.push(newBlock); //push the values into our chain array for our blockchain
	}

	replaceChain(chain, validateTransactions, onSuccess){
		if (chain.length <= this.chain.length) {
			console.error('The incoming chain must be longer');
			return;
		}

		if (!Blockchain.isValidChain(chain)){
			console.error('The incoming chain must be valid');
			return;
		}

		if (validateTransactions && !this.validTransactionData({ chain })) {
			console.error('Incoming chain has invalid data');
			return;
		}

		if (onSuccess) onSuccess(); //call only if it exists

		console.log('Replacing chain with', chain);
		this.chain = chain;
	}

	validTransactionData({ chain }) {
		for (let i=1; i<chain.length; i++){
			const block = chain[i];
			const transactionSet = new Set();
			let rewardTransactionCount = 0;

			for (let transaction of block.data) {
				if (transaction.input.address === REWARD_INPUT.address){
					rewardTransactionCount += 1;

					if (rewardTransactionCount > 1){
						console.error('Miner rewards exceed limit');
						return false;
					}

					if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
						console.error('Miner rewards amount is invalid');
						return false;
					}
				} else {
					if (!Transaction.validTransaction(transaction)) {
						console.error('invlaid transaction');
						return false;
					}

					const trueBalance = Wallet.calculateBalance({ chain: this.chain, address: transaction.input.address });

					if (transaction.input.amount !== trueBalance){
						console.error('Invalid input amount');
						return false;
					}

					if (transactionSet.has(transaction)) {
						console.error('An identical transaction appears more than once in the block');
						return false;
					} else {
						transactionSet.add(transaction);
					}
				}
			}

		}
		
		return true;
	}

	static isValidChain(chain){
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
			return false
		};

		for (let i=1; i<chain.length; i++){
			const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i]; //lets you grab the variables from each chain block
			const actualLastHash = chain[i-1].hash;
			const lastDifficulty = chain[i-1].difficulty;

			if (lastHash !== actualLastHash) return false;

			const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

			if (hash !== validatedHash) return false;

			if (Math.abs(lastDifficulty - difficulty) > 1) return false; //prevents jumps in difficulty
		}
		return true;
	}
}

module.exports = Blockchain;