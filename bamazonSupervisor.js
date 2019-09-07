var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var Table = require("cli-table");

var table = new Table({
  head: ['Department ID', 'Department Name', 'Over head Costs', 'Product Sales']
, colWidths: [25, 25, 25, 25]
});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "pri",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  console.log("\n" + chalk.green("connected as id " + connection.threadId) + "\n");

  start();
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

      switch (response.dept) {
        case "View product by department":
          // departmentSales();
          departmentProduct();
          break;

        case "Create new department":
          break;
      }

    });
}

  
//   function departmentSales() {
//     var salesQuery = "SELECT department_name, product_sales FROM products GROUP BY department_name HAVING count(*) > 1";
    
//     connection.query(salesQuery, function(err, res) {
//       if(err) throw err;
      
//       for(var i=0; i<res.length; i++) {
//         console.log(res[i])
//       }
//       connection.end();
//   })
// }

function departmentProduct() {
  var deptQuery = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments ";
  deptQuery += "RIGHT JOIN products ON departments.department_name = products.department_name";
 

  connection.query(deptQuery, function(err, res) {
    if(err) throw err;

    var filterResult = [];
    var id = [];

    for(var i=0; i<res.length; i++) {
      
      if(id.indexOf(res[i].department_id) === -1) {
        filterResult.push(res[i]);
        id.push(res[i].department_id);
      } else {
        for(var j=0; j<filterResult.length; j++) {
          if(filterResult[j].department_id === res[i].department_id) {
            filterResult[j].product_sales += res[i].product_sales;
          }
        }
      }

    }

    console.table(filterResult);

    // table.push(filterResult);
    // console.log(table.toString());

    connection.end();
  })
}



// , department.over_head_costs * products.product_sales AS total_profit