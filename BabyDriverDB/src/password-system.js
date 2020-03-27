'use strict';
const crypto = require('crypto');

var genSalt = function(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};
  
var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};
  
var saltHashPassword = function(password) {
    var salt = genSalt(16);
    return sha512(password, salt);
}

var verifyPassword = function(givenPassword, hashedPassword, salt) {
    var parallel = sha512(givenPassword, salt);
    var diff = parallel.passwordHash.length ^ hashedPassword.length;
    for (var i = 0; i < parallel.passwordHash.length && i < hashedPassword.length; i++) {
        diff |= parallel.passwordHash[i] ^ hashedPassword[i];
    }
    return diff == 0;
}

module.exports = {
    saltHashPassword,
    verifyPassword
};