const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');
var Users = require('./routes/Users');

const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();

const isDevelopment = process.env.ENV === 'development';
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const REDIS_URL = isDevelopment ? 'redis://127.0.0.1:6379' : 'redis://h:p06803048fd4ce6600da2261e096521cf5971839598530114b80787382b6c83ce@ec2-34-207-6-189.compute-1.amazonaws.com:22029';

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet, redisUrl: REDIS_URL });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/users', Users);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock( { data });

    pubsub.broadcastChain();
    
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date } = req.body;

    let transaction = transactionPool
        .existingTransaction({ transChequeID: chequeID });//return the transaction in the pool matching the chequeID passed in

    let existingSender = transactionPool.existingSender({ senderWallet: wallet.publicKey });

    try {
        if (transaction) {
            let updateAmount = amount - transaction.lastAmount;
            transaction.update({ senderWallet: wallet, recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date });
            transactionPool.updateTransactions(wallet, updateAmount, transaction.inputDate);
        } else if (existingSender && !transaction) {
            //console.log("Caught existing sender");
            transaction = wallet.createTransaction({ 
                recipient, 
                amount, 
                chequeID,
				transitNumber, 
				institutionNumber, 
				accountNumber, 
				clientName,
                chain: blockchain.chain,
                date,
                pool: transactionPool
            });
        } else {
            transaction = wallet.createTransaction({ 
                recipient, 
                amount, 
                chequeID,
				transitNumber, 
				institutionNumber, 
				accountNumber, 
				clientName,
                chain: blockchain.chain,
                date
            });
        }
    } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);
    
    pubsub.broadcastTransaction(transaction);
    
    res.json({ type: 'sucess', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            
            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
        }
    });
};

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
};

const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount: 5
});

const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
});

const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
});

for (let i=0; i<0; i++) {
    if (i%3 === 0) {
        walletAction();
        walletFooAction();
    } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
    } else {
        walletFooAction();
        walletBarAction();
    }

    transactionMiner.mineTransactions();
}

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});