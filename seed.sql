INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("iphone X", "electronics", 1000, 8),
("becoming", "books", 20, 50),
("pokemon: lets go", "games", 58, 30),
("nespresso coffee machine", "kitchen", 109, 10),
("nutribullet", "kitchen", 139, 32),
("chopping axe", "DIY", 22, 200),
("a dog's way home", "movies", 25, 33),
("apple airpods 2", "electronics", 276, 60),
("nintendo switch", "electronics", 460, 99),
("Eloquent Javascript", "books", 38, 489); 


INSERT INTO departments(department_name, over_head_costs)
VALUES ("electronics", 4000),
("books", 100),
("games", 100),
("kitchen", 900),
("DIY", 50),
("shoes", 400),
("movies", 40);


SELECT * FROM products;
SELECT * FROM departments;