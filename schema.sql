DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(30) NULL,
  department_name VARCHAR(30) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY(item_id)
)

SELECT *
FROM products;

ALTER TABLE products
ADD product_sales INT NULL;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NULL,
  over_head_costs INT NULL,
  PRIMARY KEY(department_id)
)