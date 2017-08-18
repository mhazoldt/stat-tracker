let mysql = require('mysql')
let connection = mysql.createConnection({
    host     : 'localhost',
    database: 'stat_tracker',
    user     : 'root',
    password : ''
  });

  module.exports = connection