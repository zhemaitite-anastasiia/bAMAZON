DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE product(
ItemID INT NOT NULL,
ProductName VARCHAR(30) NOT NULL,
DepartmentName VARCHAR(30) NOT NULL,
Price DECIMAL(10,2) NULL,
StockQuantity INT NULL
PRIMARY KEY(ItemID)
);



INSERT INTO product
(ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES
(1,"Avocado", "vegetables", 1.53, 10),
(2,"Banana", "fruits", 0.59, 40),
(3,"Bottle of water","drinks", 5.00, 30),
(4,"Chocolate", "sweets", 2.60, 16),
(5,"Grilled Chicken", "hot kitchen", 10.00, 20),
(6,"Tomatoe", "vegetables", 3.99, 50),
(7,"Cucumber", "vegetables", 2.99, 30),
(8,"Cupcake", "bakery", 4.95, 52),
(9,"Sour Cream", "diary", 6.67, 26),
(10,"Milk", "diary", 1.23, 56);

SELECT * FROM product;

CREATE TABLE Departments(
DepartmentId int AUTO_INCREMENT,
PRIMARY KEY(DepartmentId),
DepartmentName varchar(50) NOT NULL,
OverHeadCosts DECIMAL(11,2) NOT NULL,
TotalSales DECIMAL(11,2) NOT NULL);