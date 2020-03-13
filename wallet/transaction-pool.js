const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactionMap = {};
        this.balanceMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    clear() {
        this.transactionMap = {};
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    existingTransaction({ transChequeID }) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.chequeID === transChequeID);
    }

    existingSender({ senderWallet }) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === senderWallet);
    }

    sumTransactions({ senderWallet }) {
        let amountSum = 0;
        const senderTransactions = Object.values(this.transactionMap);
        for (let transaction of senderTransactions) {
            if (senderWallet === transaction.input.address)
                amountSum += transaction.inputAmount;
        }
        //console.log("Pool calc'd balance: "+amountSum);
        return amountSum;
    }
    
    validTransactions() {
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction({ transaction, finalAmount: this.sumTransactions({senderWallet: transaction.input.address}) })
        );
    }

    clearBlockchainTransactions({ chain }) {
        for (let i=1; i<chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }

    calculatePoolBalance() {
        const transactions = Object.values(this.transactionMap);
        for (let transaction of transactions){
            updatedBalance = this.sumTransactions(transaction.input.address);
            this.balanceMap[transaction.input.address] = updatedBalance;
            transaction.update({ updatedBalance });
        }
        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
    }
}

module.exports = TransactionPool;