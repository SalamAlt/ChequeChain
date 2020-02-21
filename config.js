const MINE_RATE = 1000; //1 second because set in milliseconds
const INITIAL_DIFFICULTY = 3;


const GENESIS_DATA = {
	timestamp: 1,
	lastHash: '-----',
	hash: 'hash-one',
	difficulty: INITIAL_DIFFICULTY,
	nonce: 0,
	data: []
};
const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorized-rewards*' };

const MINING_REWARD = 50;

const BANK_INSTITUTION_NUMBERS = { BMO: 001, Scotiabank: 002, RBC: 003, TD: 004, NBC: 006, CIBC: 010, HSBC: 016 };

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
  BANK_INSTITUTION_NUMBERS
};