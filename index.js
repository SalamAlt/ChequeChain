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
const app = express();
//salam 5 lines
const { STARTING_BALANCE } = require('./config');
var cors = require('cors');
app.use(cors({credentials: true, origin: true}));
const cryptoHash = require('./util/crypto-hash');
const Transaction = require('./wallet/transaction');

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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
    const { amount, recipient, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date, deposInstNum } = req.body;

    let transaction = transactionPool
        .existingTransaction({ transChequeID: chequeID });//return the transaction in the pool matching the chequeID passed in

    let existingSender = transactionPool.existingSender({ senderWallet: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount, chequeID, transitNumber, institutionNumber, accountNumber, clientName, date });
        } else if (existingSender) {
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
                ,deposInstNum
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
                date,
                deposInstNum
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


//retrieve bank wallets (institution numbers as priv keys)
app.get('/api/bank-wallets', (req, res) => {
    const address = wallet.publicKey;
////////
var output = {};

axios.get('https://chequechain.wasplabs.ca/banks?bodyLimit=100&pageLimit=1')
.then(response => {
    var banks_set = new Set();
    //add each banks institution number to a set (does not repeat values)
    
    for (let i=0; i < response.data.length; i++) {
      banks_set.add(response.data[i].finInstNum)
    }
    banks_array = Array.from(banks_set);
    var output = {};
    for (let i=0; i < banks_array.length; i++) {
        let foundSettled = false;
       for (let j=blockchain.chain.length-1; j>0; j--) {
            const block = blockchain.chain[j];
            for (let transaction of block.data) {
                if (banks_array[i] == transaction.recipient) {
                        foundSetlled = true;
                        output[banks_array[i]] = transaction.inputAmount;
                 }
                if (foundSettled)
                    break;
            }   //end of transaction loop
            if (foundSettled)
                 break;
        }//end of blockchain loop
        if (!foundSettled)
             output[banks_array[i]] = STARTING_BALANCE;

    }//end of banks_array loop

    console.log("testing bank wallets under this line: ");

        console.log(output);
        res.json({
            output
        });
           // .finInstNum)
    }).catch(err => {
        console.log(err);
        res.error("Could not perform settlement!");
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


const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
//clearance server every set time SHOULD check all transaction numbers finstNum
//and then update those banks cryptocurrency...
//WHAT WE NEED: modify DEPOSITED transactions (even if it's not mined yet) to 
//                    have a field: deposInstNum to signify the bank that's depositing; and also gotta change our buttons like I said on discord
//              make this settlement wallet hella rich like 99999999
const intervalFunc = () =>
 { 
    const banks_set = new Set();
    axios.get('https://chequechain.wasplabs.ca/banks?bodyLimit=100&pageLimit=1')
    .then(response => {
        const banks_set = new Set();
        //add each banks institution number to a set (does not repeat valeus)
        for (let i=0; i < response.data.length; i++) {
          banks_set.add( {key: response.data[i].finInstNum, balance: STARTING_BALANCE})
        }
        const banks_array = Array.from(banks_set);

           //wallet public key will be finstNum

           //iterate over blockchain and count each finstNum
       for (let i=blockchain.chain.length-1; i>0; i--) {
           const block = blockchain.chain[i];
           for (let transaction of block.data) {
            //ignore any transactions with the banks wallet key since we're making that now
            //this is slower in execution time but it's faster for development
            if ((!banks_set.has(transaction.input.address)) && banks_set.has(transaction.institutionNumber)) {
               //cheque's original bank loses this much money, transaction.input.amount is the original balance
               //stuff in transaction.outputmap[] is resulting balance
               const amount = (transaction.input.amount) - transaction.outputMap[transaction.input.address]
              // console.log(banks_set[i]);
             //  console.log(transaction.institutionNumber);
           //  console.log("ins number asking for is "+transaction.institutionNumber )
           var idx = banks_array.findIndex(bank => bank.key == transaction.institutionNumber);
             banks_array[idx].balance -= amount

                 //bank who deposited cheque gets the money
                idx = banks_array.findIndex(bank => bank.key == transaction.deposInstNum);
                banks_array[idx].balance += amount
                }
            }
       } //end of blockchain loop
   
   
       //now make "transactions" which should technically be from one bank to another in terms of who paid who but no time
       //  so i'll make it from THIS settlement node to each bank
       var transaction;
       for (let i = 0; i < banks_array.length; i++)
       {
/*
        senderWallet: this, recipient, amount, chequeID, 
        transitNumber, institutionNumber, accountNumber, 
        date, clientName, previousPoolBalance, deposInstNum });
*/

const outputMap = {};
outputMap[banks_array[i].key] = banks_array[i].balance;
outputMap[wallet.publicKey] = wallet.balance;
            transaction = new Transaction({
               senderWallet: wallet, recipient: banks_array[i].key, amount: banks_array[i].balance, 
               chequeID: -1, transitNumber : -1, institutionNumber : -1, 
               accountNumber: -1, date : Date().toString(), clientName: "Settlement Node",deposInstNum: banks_array[i].key,
               outputMap: outputMap
           });
         //  console.log(transaction)
        //   console.log("Before setting transaction!");
         //  console.log(transactionPool.transactionMap);
           transactionPool.setTransaction(transaction);
          // console.log("After setting transaction");
         //  console.log(transactionPool.transactionMap);
           pubsub.broadcastTransaction(transaction);
       }
   
      if (transaction)
      transactionMiner.mineTransactions();
		}).catch(err => {
            console.log(err);
            console.log("Could not perform settlement!");
        });
}

//salam yet again
if (process.env.SETTLEMENT_SERVER === 'true'){
    intervalFunc();
    console.log("Can't stop me now!")
    wallet.balance = 999999;
    setInterval(intervalFunc, 10000000);	//10 seconds
}




//console.log(process.env.INST_NUM)
//set this bank node to a random institution number. Later I will make each bank get assigned one by a server on start
    axios.get('https://chequechain.wasplabs.ca/banks?bodyLimit=100&pageLimit=1')
    .then(response => {
        var banks_set = new Set();
            //add each banks institution number to a set (does not repeat valeus)
            for (let i=0; i < response.data.length; i++) {
              banks_set.add(response.data[i].finInstNum)
            //  console.log(response.data[i].finInstNum);
            }
            const size = banks_set.size;
         //   console.log("size:"+size)
            banks_set = Array.from(banks_set);
            process.env.INST_NUM =  banks_set[Math.floor(Math.random() * size)];
        //	console.log(response.data);
        console.log("new INST num is " + process.env.INST_NUM)
		}).catch(err => {
            console.log(err);
            console.log("Could not set this banks institution number!");
        });


//modified package.json with new commands