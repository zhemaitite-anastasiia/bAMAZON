var mysql = require("mysql");
var inquirer = require("inquirer");

//creating the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

//username
user: "root",
password: "password",
database: "bamazonDB"
});

var productPurchased = [];

//connect to the mysql server and sql database
connection.connect(function(err){
    if(err) throw err;
    start();
});

//function that shows all items available for sale
function start() {
connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err;
    console.log(res[0].product_name);
    customerPrompt(res)
    connection.end()
});

}
//function to ask the user item id
function customerPrompt(inventory) {
    inquirer
    .prompt([
        {
            name:"id",
            type: "input",
            message: "What is the ID of the product that you want to buy?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units you would like to buy?"

        }
    ])
    .then(function(answer){
          console.log(answer)
          console.log('id: ',answer.id)
          console.log('quantity: ', answer.quantity)
          var choiceID = parseInt(answer.id)
          var product = checkInventory(choiceID, inventory)
          makePurchase(product, answer.quantity)

           //stockQuantity: answer.stock_quantity
       
       //function(err) {
         //  if (err) throw err;
           //console.log("Please answer the questions");
      // };

    });
}


    function makePurchase(item, quantity){
        console.log("inside makePurchase", item)
        console.log("inside makePurchase", quantity)
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, item.item_id],
        function(err, res) {
           console.log("successfully purchased " + quantity + " " + item.product_name + "s!")
        }
      )
    }

    function checkInventory(choiceId, inventory) {
        for (var i = 0; i < inventory.length; i++) {
          if (inventory[i].item_id === choiceId) {
            // If a matching product is found, return the product
            return inventory[i];
          }
        }
        // Otherwise return null
        return null;
      }
//     //     prompt.get(productId, function(errr,es){
// //        //responses
// //        var newPurchase = {
// //            itemId: res.item_id,
// //            Quantity: res.stock_quantity,
// //        };
// //        productPurchased.push(newPurchase);
// //        // connecting to mysql and looking for the product based on the id number
// //        connection.query('SELECT * FROM Products WHERE ItemID=?', productPurchased[0].itemID, function(err, res){
// //         if(err) console.log(err, 'That item ID doesn\'t exist');
// //     })
// // }
// // )}