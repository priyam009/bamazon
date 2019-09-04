var inquirer = require('inquirer');
var mysql = require('mysql');
var chalk = require('chalk');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pri",
  database: "bamazon"
});

connection.connect(function(err) {
  if(err) throw err;
  console.log(chalk.green("\n" + "connected to id " + connection.threadId + "\n"));

  connection.end();
})