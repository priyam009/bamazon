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
    "\n" + chalk.green("connected as id " + connection.threadId) + "\n"
  );
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "dept",
        choices: ["View product by department", "Create new department"]
      }
    ])
    .then(function(response) {
      console.log(response);

      switch (response) {
        case "View product by department":
          break;

        case "Create new department":
          break;
      }

      connection.end();
    });
}

start();
