const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 1;


const GENESIS_DATA = {
    /*
    chequeID: 0,
    clientName: 'NULL',
    accountID: 'NULL ID',
    tranNum: '0',
    status: 'tokenized',
    date: 'cheque-date',
    tokenizationString: 'tokenization',
    payee: 'payee-name',
    payeeSign: 'payor-sign',
    */////////////////
<<<<<<< HEAD
    timestamp: Date.now(),
=======
    timestamp: 1,
>>>>>>> 6331575a77abaed80892c6cb8a30e6a89ef9cb32
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY, 
    nonce: 0,
    data: []
};

<<<<<<< HEAD
const STARTING_BALANCE = 10000;
=======
const STARTING_BALANCE = 1000;
>>>>>>> 6331575a77abaed80892c6cb8a30e6a89ef9cb32

const REWARD_INPUT = { address: '*authorized-reward*' };

const MINING_REWARD = 50;

module.exports = { 
    GENESIS_DATA, 
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};