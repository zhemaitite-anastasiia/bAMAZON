var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
	user: 'root',
	password: 'password',
	database: 'bamazonDB', 
});

var productPurchased = [];

connection.connect();

//connect to the mysql database and pull the information from the Products database to display to the user
connection.query('SELECT ItemID, ProductName, Price FROM product', function(err, result){
	if(err) console.log(err);

	//creates a table for the information from the mysql database to be placed
	var table = new Table({
		head: ['Item Id#', 'Product Name', 'Price'],
		style: {
			head: ['blue'],
			compact: false,
			colAligns: ['center'],
		}
	});

	//loops through each item in the mysql database and pushes that information into a new row in the table
	for(var i = 0; i < result.length; i++){
		table.push(
			[result[i].ItemID, result[i].ProductName, result[i].Price]
		);
	}
	console.log(table.toString());

	purchase();
});

//the purchase function so the user can purchase one of the items listed above
var purchase = function(){

	//creates the questions that will be prompted to the user
	var productInfo = {
		properties: {
			itemID:{description: colors.blue('Please enter the ID # of the item you wish to purchase!')},
			Quantity:{description: colors.green('How many items would you like to purchase?')}
		},
	};

	prompt.start();

	//gets the responses to the prompts above
	prompt.get(productInfo, function(err, res){

		//places these responses in the variable custPurchase
		var custPurchase = {
			itemID: res.itemID,
			Quantity: res.Quantity
		};
		
		//the variable established above is pushed to the productPurchased array defined at the top of the page
		productPurchased.push(custPurchase);

		//connects to the mysql database and selects the item the user selected above based on the item id number entered
		connection.query('SELECT * FROM product WHERE ItemID=?', productPurchased[0].itemID, function(err, res){
				if(err) console.log(err, 'That item ID doesn\'t exist');
				
				//if the stock quantity available is less than the amount that the user wanted to purchase then the user will be alerted that the product is out of stock
				if(res[0].StockQuantity < productPurchased[0].Quantity){
					console.log('That product is out of stock!');
					connection.end();

				//otherwise if the stock amount available is more than or equal to the amount being asked for then the purchase is continued and the user is alerted of what items are being purchased, how much one item is and what the total amount is
				} else if(res[0].StockQuantity >= productPurchased[0].Quantity){

					console.log('');

					console.log(productPurchased[0].Quantity + ' items purchased');

					console.log(res[0].ProductName + ' ' + res[0].Price);

					//this creates the variable SaleTotal that contains the total amount the user is paying for this total puchase
					var saleTotal = res[0].Price * productPurchased[0].Quantity;

					//connect to the mysql database Departments and updates the saleTotal for the id of the item purchased
					connection.query("UPDATE Departments SET TotalSales = ? WHERE DepartmentName = ?;", [saleTotal, res[0].DepartmentName], function(err, resultOne){
						if(err) console.log('error: ' + err);
						return resultOne;
					})

					console.log('Total: ' + saleTotal);

					//this variable contains the newly updated stock quantity of the item purchased
					newQuantity = res[0].StockQuantity - productPurchased[0].Quantity;
			
					// connects to the mysql database products and updates the stock quantity for the item puchased
					connection.query("UPDATE Products SET StockQuantity = " + newQuantity +" WHERE ItemID = " + productPurchased[0].itemID, function(err, res){
						// if(err) throw err;
						// console.log('Problem ', err);
						console.log('');
						console.log(colors.cyan('Your order has been processed.  Thank you for shopping with us!'));
						console.log('');

						connection.end();
					})

				};

		})
	})

};






// var mysql = require("mysql");
// var inquirer = require("inquirer");

// //creating the connection information for the sql database
// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,

// //username
// user: "root",
// password: "password",
// database: "bamazonDB"
// });

// var currentDepartment;
// var amounttoPay;
// var updatedSale;

// //connecting to the mysql server and sql database
// connection.connect(function(err){
//     if(err) throw err;
//     start();
// });

// //function that shows all items available for sale
// function start() {
// connection.query("SELECT * FROM allproducts", function(err, res){
//     if (err) throw err;
//     console.log('=================Items in Store========================================');
    

//     for(i=0; i<res.length;i++){
//         console.log('Item ID:' + res[i].id + ' Product Name: ' + res[i].ProductName + ' Price: ' + '$' + res[i].Price + '(Quantity Left: ' + res[i].StockQuantity + ')')
//     }
//     console.log('=======================================================================');
//     placeOrder();
// })

//     };
// //function to ask the user item id
// function placeOrder() {
//     inquirer
//     .prompt([
//         {
//             name:"selectId",
//             type: "input",
//             message: "What is the ID of the product that you want to buy?",
//             validate: function(value){
//                 var valid = value.match(/^[0-9]+$/)
//                 if(valid){
//                     return true
//                 }
//                 return 'Please enter a valid Product ID'
//             }
//         },
//         {
//             name: "quantity",
//             type: "input",
//             message: "How many units you would like to buy?",
//             validate: function(value){
//                 var valid = value.match(/^[0-9]+$/)
//                 if(valid){
//                     return true
//                 }
//                 return 'Please enter a numerical value'
//             }
//         }
//     ])
//     .then(function(answer){
//         connection.query('SELECT * FROM allproducts WHERE id = ?', [answer.selectId], function(err, res){
//             if(answer.selectQuantity > res[0].StockQuantity){
//                 console.log('Insufficient Quantity');
//                 console.log('This order has been cancelled');
//                 console.log('');
//                 newOrder();
//             }
//             else{
//                 amounttoPay = res[0].Price * answer.selectQuantity;
//                 currentDepartment = res[0].DepartmentName;
//                 console.log('Your order was successfully placed!');
//                 console.log('You owe: $' + amounttoPay);
//                 //updating product table
//                 connection.query('UPDATE allproducts SET ? Where ?', [{
//                     StockQuantity: res[0].StockQuantity - answer.selectQuantity
//                 },{
//                     id: answer.selectId
                
//                 }], function(err,res){});
//                 //Updating departments data
//                 logSaleToDepartment();
//                 newOrder();

//             }

//     })
// }, function(err,res){})
// };

// //Allows the user to place the new order or finish shopping
// function newOrder(){
// 	inquirer.prompt([{
// 		type: 'confirm',
// 		name: 'choice',
// 		message: 'Would you like to place another order?'
// 	}]).then(function(answer){
// 		if(answer.choice){
// 			placeOrder();
// 		}
// 		else{
// 			console.log('Thank you for shopping at Bamazon!');
// 			connection.end();
// 		}
// 	})
// };
	
// //functions to push the sales to the main table
// //function logSaleToDepartment(){
// 	//connection.query('SELECT * FROM departments WHERE DepartmentName = ?', [currentDepartment], function(err, res){
// 		//updateSales = res[0].TotalSales + amounttoPay;
// 		//updateDepartmentTable();
// 	//})
// //};