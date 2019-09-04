var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pri",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log(
    chalk.green("\n" + "connected to id " + connection.threadId + "\n")
  );

  start();
  connection.end();
});

//Ask manager for input from the options
function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "Select from the option below: ",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(function(response) {
      console.log(response.menu);

      //Call respective function when option is selected
      switch (response.menu) {
        case "View Products for Sale":
          viewProduct();
          break;
        case "View Low Inventory":
          viewLowInventory();  
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
      }
    });
}

//Function to show the list of current stock in the inventory
function viewProduct() {
  var viewProductQuery = "SELECT * FROM products"

  connection.query(viewProductQuery, function(err, res) {
    if(err) throw err;

    console.table(res);
  })
}

//TODO Funtion to check for low inventory stock
function viewLowInventory() {

}

//TODO Function to add/update the current stock in the inventory
function addInventory() {

}

//TODO Function to add new item in the stock list
function addProduct() {

}
