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

    createTransaction({ recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date, chain, pool }){
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

        return new Transaction({ senderWallet: this, recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, date, clientName, previousPoolBalance });
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;
        console.log("chain length: "+chain.length);
        for (let i=chain.length-1; i>0; i--){
            console.log("i: "+i);
            const block = chain[i];
            console.log(block);
            for (let j = 1; j<=block.data.length; j++){
                console.log("j: "+j);
                let transaction = block.data[block.data.length-j];
                console.log(transaction);
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
            if (hasConductedTransaction) {
                break;
            }
        }
        
        //console.log(outputsTotal);
        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
    }
}

module.exports = Wallet;