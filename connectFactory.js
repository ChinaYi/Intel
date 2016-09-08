/**
 * Created by chinayi on 2016/7/13.
 */
var mysql = require('mysql');

exports.pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: 'yifangqiu',
    database: 'blindgo'
});




