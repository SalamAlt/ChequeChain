const crypto = require('crypto'); //native crypto module

const cryptoHash = (...inputs) => { //takes N amount of inputs and puts into an array called inputs
	const hash = crypto.createHash('sha256'); //grab sha256 algo can be different ones

	hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' ')); //takes a string so we add empty strings with one space
	
	return hash.digest('hex'); //result of hash in hex form
};

module.exports = cryptoHash;