var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");

//Creating connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pri",
  database: "bamazon"
});

//Checking connection
connection.connect(function(err) {
  if (err) throw err;

  console.log(
    "\n" + chalk.green("connected as id " + connection.threadId) + "\n"
  );

  //Ask customer input using inquirer
  start();
});

//Inquiere asks for information- ID and QTY from the customer
function start() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the id of the product to buy: ",
        //Check if the entered value is a number
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
        //Check if the entered value is a number
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
      //Call to read product data from the database
      readProducts(response);
    });
}

//Reads data from the database
function readProducts(response) {
  console.log(chalk.blue.bold("\n" + "Selecting relevant product....") + "\n");

  var query = "SELECT products.stock_quantity FROM products WHERE ?";

  connection.query(query, { item_id: response.id }, function(err, res) {
    if (err) throw err;

    //Call to check and update the stock quantity in the database
    updateProducts(res[0].stock_quantity, response);
  });
}

//Product quantity updated as per the order if the order goes through
function updateProducts(stockQuantity, response) {
  //Check if the ordered quantity is less than the available quantity
  if (stockQuantity > response.quantity) {
    stockQuantity -= response.quantity;

    var updatedQuery = "UPDATE products SET ? WHERE ?";

    connection.query(
      updatedQuery,
      [{ stock_quantity: stockQuantity }, { item_id: response.id }],
      function(err, res) {
        if (err) throw err;

        console.log(
          chalk.blue.bold(res.affectedRows + " product updated!") + "\n"
        );

        //Call to show the total cost of purchase
        purchasedProducts(response);
      }
    );
  } else {
    //Show is theres is not sufficient quantity in the store
    console.log(
      chalk.red(
        "\n" +
          "Sorry, Insufficient Quantity." +
          "\n" +
          "Order cannot be processed." +
          "\n"
      )
    );

    //End connection
    connection.end();
  }
}

//Function to show the total cost of purchase to the customer
function purchasedProducts(response) {
  var purchasedQuery = "SELECT * FROM products WHERE ?";

  connection.query(purchasedQuery, [{ item_id: response.id }], function( err, res) {
    var customerCost = parseInt(response.quantity) * res[0].price;

    //Call to update/add purchase to the product_sales column after customer purchase
    productSales(customerCost, response);
  });
}

//Function to update/add purchase to the product_sales column after customer purchase
function productSales(customerCost, response) {
  
  var salesQuery = "UPDATE products SET product_sales= product_sales + ? WHERE ?";
  
  connection.query(salesQuery, [customerCost, {item_id: response.id}], function( err, res ) {
    if (err) throw err;
    
    console.log(chalk.blue.bold("Purchase cost updated") + "\n");

    console.log(chalk.green.inverse.bold("Total cost of purchase: $" + customerCost + "\n"));

    //End connection
    connection.end();
  })
}
