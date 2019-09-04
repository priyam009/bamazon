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
});

//Ask manager for input from the options
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "Select from the option below: ",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(response) {
      console.log("response: ", response.menu);

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
  console.log(chalk.blue.bold("Selecting all products..." + "\n"));

  var viewProductQuery = "SELECT * FROM products";

  connection.query(viewProductQuery, function(err, res) {
    if (err) throw err;

    //Logging response
    console.table(res);
    console.log("\n");

    //End connection
    connection.end();
  });
}

//Function to check for low inventory stock
function viewLowInventory() {
  console.log(chalk.blue.bold("Selecting all relevant products..." + "\n"));

  var viewLowInventoryQuery = "SELECT * FROM products ";
  viewLowInventoryQuery += "WHERE stock_quantity <= 10";

  connection.query(viewLowInventoryQuery, function(err, res) {
    if (err) throw err;

    //Logging response
    console.table(res);
    console.log("\n");

    //End connection
    connection.end();
  });
}

//Function to add/update the current stock in the inventory
function addInventory() {
  inquirer
    .prompt({
      type: "list",
      name: "add",
      message: "Select from the following: ",
      choices: ["Enter ID", "Exit"]
    })
    .then(function(response) {
      switch (response.add) {
        case "Enter ID":
          updateInventory();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function updateInventory() {
  inquirer
  .prompt([
    {
      type: "input",
      name: "id",
      message: "Enter the product ID: ",
      validate: function(value) {
        if (!isNaN(value)) {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      type: "input",
      name: "qty",
      message: "Enter the updated quantity: ",
      validate: function(value) {
        if (!isNaN(value)) {
          return true;
        } else {
          return false;
        }
      }
    }
  ])
  .then(function(resp) {
    var updateQuery = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";

    connection.query(
      updateQuery,[resp.qty, resp.id],

      function(err, res) {
        if (err) throw err;

        console.log(
          chalk.blue.bold(res.affectedRows + " product updated!") +
            "\n"
        );
        addInventory();
      }
    );
  });
}

//TODO Function to add new item in the stock list
function addProduct() {}
