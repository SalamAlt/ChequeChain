const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactionMap = {};
        this.balanceMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    clear() {//When the pool is cleared, this is what is called
        for (let transaction of Object.values(this.transactionMap)){
            if (Transaction.validTransaction(transaction)){
                delete this.transactionMap[transaction.id];
            }
        } 
    }

    clearInvalid() {
        for (let transaction of Object.values(this.transactionMap)){
            if (!Transaction.validTransaction(transaction)){
                delete this.transactionMap[transaction.id];
            }
        } 
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
            transaction => Transaction.validTransaction( transaction)  )
            //, finalAmount: this.sumTransactions({senderWallet: transaction.input.address}) })
    }

    updateTransactions(senderWallet, amount, date) {
        const transactions = Object.values(this.transactionMap).filter(transaction => transaction.input.address === senderWallet.publicKey);
        for (let transaction of transactions) {
            if (transaction.inputDate > date){
                transaction.updateAmount(amount, senderWallet);
            }
        }
        return transactions;
    }

    clearBlockchainTransactions({ chain }) {//When the blockchain is replaced, this is called
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