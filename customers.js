module.exports = function() {
    var express = require('express');
    var router = express.Router();

    // Getter method for retrieving Customers info
    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query("SELECT Customers.customer_id, first_name, last_name FROM Customers", function(error, results, fields)   {
            // If an error occurs, make the error legibile:
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            // Otherwise, return the corresponding query values:
            context.customers = results;
            complete();
        });
    }
    
    // Retrieve a single Customer based on customer_id
    function getCustomer(res, mysql, context, customer_id, complete)  {
        var sql = "SELECT customer_id, first_name, last_name FROM Customers WHERE customer_id = ?";
        var inserts = [customer_id];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });
    }
    
    // Display all Customers
    router.get('/', function(req, res)  {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                console.log(context);
                res.render('customer', context);
            }
        }
    });

    // Displays one customer for the specific purpose of updating customer info
    router.get('/:customer_id', function(req, res)  {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.customer_id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update-customer', context);
            }
        }
    });

    // Adds a customer to the db and redirects to the page afterwards
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers(first_name, last_name) VALUES (?, ?)";
        var inserts = [req.body.first_name, req.body.last_name];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields)   {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            else    {
                res.redirect('/customers');
            }
        });
    });

    // The URI to update data is sent to update a customer.
    router.put('/:customer_id', function(req, res)  {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Customers SET first_name = ?, last_name = ? WHERE customer_id = ?";
        var inserts = [req.body.first_name, req.body.last_name, req.params.customer_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields)   {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            else    {
                res.status(200);
                res.end();
            }
        });
    });
    
    // Route to delete a drink, and returns 202 upon success
    router.delete('/:customer_id', function(req,res)    {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE customer_id = ?";
        var inserts = [req.params.customer_id];
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
