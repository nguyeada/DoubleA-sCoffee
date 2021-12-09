module.exports=function(){
    var express=require('express');
    var router=express.Router();

    // Getter method for retrieving Drinks 
    function getDrinks(res, mysql, context, complete){
        mysql.pool.query("SELECT drink_id, drink_name, cost FROM Drinks", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drinks=results;
            complete();
        });
    }

    // Getter method for retrieving Customers
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id, CONCAT(first_name, ' ', last_name) AS full_name FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers=results;
            complete();
        });
    }

    // Getter method for retrieving Orders 
    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders.order_id, Orders.customer_id, CONCAT(first_name, ' ', last_name) AS customer_name, Orders.location_id, CONCAT(city_name, ', ', state_name) AS location_name FROM Orders INNER JOIN Customers ON Orders.customer_id = Customers.customer_id INNER JOIN Locations ON Orders.location_id = Locations.location_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders=results;
            complete();
        });
    }

    // Retrieve DrinkOrders that contain the matching customer_id (for filtering purposes)
    function getOrdersbyCustomer(req, res, mysql, context, complete)    {
        var query = "SELECT Orders.order_id, Orders.customer_id, Orders.location_id, CONCAT(first_name, ' ', last_name) AS customer_name, CONCAT(city_name, ', ', state_name) AS location_name, Drinks.drink_id, Drinks.drink_name FROM Orders INNER JOIN DrinkOrders ON Orders.order_id = DrinkOrders.order_id INNER JOIN Drinks ON Drinks.drink_id = DrinkOrders.drink_id INNER JOIN Customers ON Orders.customer_id = Customers.customer_id INNER JOIN Locations ON Orders.location_id = Locations.location_id WHERE Orders.customer_id = ?";
        var inserts = [req.params.customer_id];
        console.log(inserts);
        mysql.pool.query(query, inserts, function(error, results, fields)   {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drink_orders = results;
            complete();
        });       
    }

    // Getter method for retrieving DrinkOrders
    function getDrinkOrders(res, mysql, context, complete){
        var sql = "SELECT Orders.order_id, Orders.customer_id, Orders.location_id, CONCAT(first_name, ' ', last_name) AS customer_name, CONCAT(city_name, ', ', state_name) AS location_name, Drinks.drink_id, Drinks.drink_name FROM Orders INNER JOIN DrinkOrders ON Orders.order_id = DrinkOrders.order_id INNER JOIN Drinks ON Drinks.drink_id = DrinkOrders.drink_id INNER JOIN Customers ON Orders.customer_id = Customers.customer_id INNER JOIN Locations ON Orders.location_id = Locations.location_id";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drink_orders=results;
            complete();
        });
    }

    // Display table 
    router.get('/', function(req,res){
        var callbackcount= 0;
        var context = {};
        context.jsscripts = ["filterbycustomer.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file= 'drink-order';
        getDrinks(res, mysql, context, complete);
        getOrders(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        getDrinkOrders(res, mysql, context, complete);
        function complete(){
            callbackcount++;
            if(callbackcount >= 4){
                res.render(handlebars_file, context);
            }
        }
    });

    // Display all orders based on customer
    router.get('/filter/:customer_id', function(req, res)  {
        var callbackcount = 0;
        var context = {};
        context.jsscripts = ["filterbycustomer.js"];
        var mysql = req.app.get('mysql');
        getOrdersbyCustomer(req, res, mysql, context, complete);
        getDrinks(res, mysql, context, complete);
        getOrders(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 4) {
                res.render('drink-order', context);
            }
        }
    });

    // Add a new Drink-Order relationship to the table 
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO DrinkOrders(drink_id, order_id) VALUES(?,?)";
        var inserts=[req.body.drink_id, req.body.order_id];
        sql= mysql.pool.query(sql, inserts, function(error, results, fields){
            if (error)  {
                if (error.errno = 1062) {
                    res.render('1062');
                } else  {
                    res.write(JSON.stringify(error));
                    res.end();
                }
            } else    {
                res.redirect('/drink-orders');
            }
        });
    });
    return router;

}();

