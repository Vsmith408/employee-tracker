var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3000,

  // Your username
  user: 'root',

  // Your password
  password: 'admin#20',
  database: 'tracker_db',
})
