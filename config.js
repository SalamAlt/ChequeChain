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
    timestamp: Date.now(),
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY, 
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 10000;

const REWARD_INPUT = { address: '*authorized-reward*' };

const MINING_REWARD = 50;

module.exports = { 
    GENESIS_DATA, 
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};