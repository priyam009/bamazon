var inquirer = require("inquirer");
var mysql = require("mysql");

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

  console.log("connected as id " + connection.threadId + "\n");

  // readProducts();
  start();
});

//READS DATA IN THE DATABASE
function readProducts(response) {
  console.log("Selecting all products.... \n");

  var query = "SELECT products.stock_quantity FROM products WHERE ?";

  connection.query(query, { item_id: response.id }, function(err, res) {
    if (err) throw err;

    var stockQuantity = res[0].stock_quantity

    updateProducts(stockQuantity, response);
  });
}

//PRODUCT UPDATED AS PER THE ORDER IF THE ORDER GOES THROUGH
function updateProducts(stockQuantity, response) {
  if (stockQuantity > response.quantity) {
    stockQuantity -= response.quantity;

    var updatedQuery = "UPDATE products SET ? WHERE ?";

    connection.query(
      updatedQuery,
      [{ stock_quantity: stockQuantity }, { item_id: response.id }],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
      }
    );

  } else {
    console.log("\n" + "Sorry, Insufficient Quantity." + "\n" + "Order cannot be processed. \n");
  }
  connection.end();
}

//FUNCTION TO SHOW THE TOTAL COST OF PURCHASE TO THE CUSTOMER


//INQUIRER ASKS FOR INFORMATION- ID AND QTY FROM THE USER
function start() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the id of the product to buy: ",
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
      console.log(response);
      readProducts(response);
    });
}
