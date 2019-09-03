var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  post: 3306,
  user: "root",
  password: "pri",
  database: "bamazon"
});

connection.connect(function(err) {
  if(err) throw err;

  console.log("connected as id " + connection.threadId + "\n");

  readProducts();

  connection.end();
})

function readProducts() {
  console.log("Selecting all products.... /n");

  connection.query("SELECT * from products", function (err, res) {
    if(err) throw err;

    console.table(res);
  })
}