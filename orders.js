module.exports = function() {
    var express = require('express');
    var router = express.Router();

    // Retrieve all Customers from Customer table
    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query("SELECT customer_id as co_id, first_name, last_name FROM Customers", function(error, results, fields)   {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    // Retrieve all Locations from Location table
    function getLocations(res, mysql, context, complete)    {
        mysql.pool.query("SELECT location_id as lo_id, city_name, state_name FROM Locations", function(error, results, fields)  {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    // Retrieve all Orders from Order table
    function getOrders(res, mysql, context, complete) {
        mysql.pool.query("SELECT Orders.order_id, Orders.customer_id, Orders.location_id, CONCAT(first_name, ' ', last_name) AS customer_name, CONCAT(city_name, ' ', state_name) AS location_name FROM Orders INNER JOIN Customers ON Orders.customer_id = Customers.customer_id INNER JOIN Locations ON Orders.location_id = Locations.location_id", function(error, results, fields)   {
            // If an error occurs, make the error legibile:
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            // Otherwise, return the corresponding query values:
            context.orders = results;
            complete();
        });
    }

    // Display all orders
    router.get('/', function(req, res)  {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteorder.js"];
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                //console.log(context);
                res.render('order', context);
            }
        }
    });

    // Adds and order to the db and redirects back to original page
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders(customer_id, location_id) VALUES (?, ?)";
        var inserts = [req.body.customer_id, req.body.location_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields)  {
            if (error)  {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }
            else    {
                res.redirect('/orders');
            }
        });
    });

    // Delete selected order
    router.delete('/:order_id', function(req,res)    {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Orders WHERE order_id = ?";
        var inserts = [req.params.order_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields)   {
            if (error)  {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            else    {
                res.status(202).end();
            }
        });
    });

    return router;
}();