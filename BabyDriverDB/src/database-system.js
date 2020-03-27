const mysql = require('mysql');
const redis = require('redis');

var sqlConnection = mysql.createPool({
    host: 'db',
    port: '3306',
    user: 'user',
    password: 'password',
    database: 'db'
});
  
var redisConnection = redis.createClient({
    host: 'redis',
    port: 6379
});

var getSQLPool = function() {
    return sqlConnection;
}

var getRedis = function() {
    return redisConnection;
}

module.exports = {
    getSQLPool,
    getRedis
};
