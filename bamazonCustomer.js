var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");

//CREATING CONNECTION
var connection = mysql.createConnection({
  host: "localhost",
  post: 3306,
  user: "root",
  password: "pri",
  database: "bamazon"
});

//CHECKING CONNECTION
connection.connect(function(err) {
  if (err) throw err;

  console.log("\n" + chalk.green("connected as id " + connection.threadId) + "\n");

  //ASK FOR CUSTOMER INPUT USING INQUIRER
  start();
});

//INQUIRER ASKS FOR INFORMATION- ID AND QTY FROM THE USER
function start() {
  inquirer
  .prompt([
    {
      type: "input",
      name: "id",
      message: "Enter the id of the product to buy: ",
      //CHECK IF THE VALUE IS A NUMBER
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
      name: "quantity",
      message: "Enter the quantity of the product to buy: ",
      //CHECK IF THE VALUE IS A NUMBER
      validate: function(value) {
        if (!isNaN(value)) {
          return true;
        } else {
          return false;
        }
      }
    }
  ])
  .then(function(response) {
    //CALL TO READ PRODUCT DATA FROM THE DATABASE 
    readProducts(response);
  });
}

//READS DATA IN THE DATABASE
function readProducts(response) {
  console.log(chalk.blue.bold("\n" + "Selecting relevant product....") + "\n");

  var query = "SELECT products.stock_quantity FROM products WHERE ?";

  connection.query(query, { item_id: response.id }, function(err, res) {
    if (err) throw err;

    //CALL TO CHECK AND UPDATE THE STOCK QUANTITY IN THE DATABASE
    updateProducts(res[0].stock_quantity, response);

  });
}

//PRODUCT QUANTITY UPDATED AS PER THE ORDER IF THE ORDER GOES THROUGH
function updateProducts(stockQuantity, response) {

  //CHECK IF THE ORDERED QUANTITY IS LESS THAN THE AVAILABLE QUANTITY
  if (stockQuantity > response.quantity) {
    stockQuantity -= response.quantity;

    var updatedQuery = "UPDATE products SET ? WHERE ?";

    connection.query(
      updatedQuery,
      [{ stock_quantity: stockQuantity }, { item_id: response.id }],
      function(err, res) {
        if (err) throw err;

        console.log(chalk.blue.bold(res.affectedRows + " product updated!") + "\n");

        //CALL TO SHOW THE TOTAL COST OF PURCHASE
        purchasedProducts(response);
      }
    );

  } else {
    //IF THERE IS NOT SUFFICIENT QUANTITY IN THE STORE
    console.log(chalk.red("\n" + "Sorry, Insufficient Quantity." + "\n" + "Order cannot be processed." + "\n"));

    //END CONNECTION
    connection.end();
  }
}

//FUNCTION TO SHOW THE TOTAL COST OF PURCHASE TO THE CUSTOMER
function purchasedProducts(response) {
  var purchasedQuery = "SELECT * FROM products WHERE ?"

  connection.query(purchasedQuery, [{item_id: response.id}],
    function(err, res) {
      var customerCost = parseInt(response.quantity) * res[0].price;

      console.log(chalk.green.inverse.bold("Total cost of purchase: $" + customerCost + "\n"));
    })
  connection.end();
}
