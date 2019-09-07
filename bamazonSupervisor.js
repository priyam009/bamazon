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

  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "dept",
        choices: ["View product by department", "Create new department", "exit"]
      }
    ])
    .then(function(response) {
      switch (response.dept) {
        case "View product by department":
          departmentProduct();
          break;

        case "Create new department":
          newDepartment();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function departmentProduct() {
  var deptQuery =
    "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales FROM departments AS d ";

  deptQuery +=
    "RIGHT JOIN products AS p ON d.department_name = p.department_name ";

  deptQuery += "GROUP BY d.department_id";

  connection.query(deptQuery, function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      res[i].total_profit = res[i].product_sales - res[i].over_head_costs;
    }

    console.table(res);
    console.log("\n");

    start();
  });
}

function newDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the Department Name: "
      },
      {
        type: "input",
        name: "cost",
        message: "Enter Over Head Costs: ",
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
      var checkQuery = "SELECT departments.department_name FROM departments";

      connection.query(checkQuery, function(err, res) {
        if (err) throw err;

        var isPresent = false;

        for (var i = 0; i < res.length; i++) {
          if (res[i].department_name === resp.name) {
            isPresent = true;
          }
        }

        if (!isPresent) {
          addDepartment(resp);
        } else {
          console.log("Department already exists. Try Again!");
          newDepartment();
        }
      });
    });
}

function addDepartment(resp) {
  console.log("Inserting a new department...\n");

  var addProductQuery = "INSERT INTO departments SET ?";

  connection.query(
    addProductQuery,
    {
      department_name: resp.name,
      over_head_costs: resp.cost
    },
    function(err, res) {
      if (err) throw err;

      console.log(
        chalk.blue.bold(res.affectedRows + " department added!") + "\n"
      );

      start();
    }
  );
}
