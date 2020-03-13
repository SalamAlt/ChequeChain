const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        
        this.keyPair = ec.genKeyPair();
        
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data))
    }

    createTransaction({ recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date, chain, pool, deposInstNum }){
        let previousPoolBalance = 0;
        
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }
        
        if (pool) {
            previousPoolBalance = pool.sumTransactions({senderWallet: this.publicKey });
            //console.log("Create transaction call balance: "+previousPoolBalance);
            //console.log("Wallet Balance during call: "+this.balance);
            //console.log("Updated wallet balance before transaction object:" +this.balance);
        }

        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({ senderWallet: this, recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, date, clientName, previousPoolBalance, deposInstNum });
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        for (let i=chain.length-1; i>0; i--){
            const block = chain[i];

            let transaction = block.data[block.data.length-1];
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }

                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    outputsTotal = outputsTotal + addressOutput;
                }

            if (hasConductedTransaction) {
                break;
            }
        }
        
        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
    }
}

module.exports = Wallet;