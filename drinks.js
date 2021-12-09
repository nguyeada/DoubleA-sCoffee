module.exports= function(){
    var express = require('express');
    var router = express.Router();

    // Getter method for all Drinks in Drinks table
    function getDrinks(res, mysql, context, complete){
        mysql.pool.query("SELECT Drinks.drink_id, drink_name, cost FROM Drinks", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drinks = results;
            complete();
        });
    }

    // Retrieve one Drink that matches the passed drink_id
    function getDrink(res, mysql, context, drink_id, complete){
        var sql = "SELECT drink_id, drink_name, cost FROM Drinks WHERE drink_id = ?";
        var inserts = [drink_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drink = results[0];
            complete();
        });
    }

    // Display all drinks
    router.get('/', function(req, res){
        var callbackcount= 0;
        var context = {};
        context.jsscripts=["deletedrink.js"];
        var mysql = req.app.get('mysql');
        getDrinks(res, mysql, context, complete);
        function complete(){
            callbackcount++;
            if(callbackcount >= 1){
                console.log(context);
                res.render('drink', context);
            }
        }
    });

    // Displays one drink for specific purpose of updating drink
    router.get('/:drink_id', function(req, res){
        callbackcount = 0;
        var context = {};
        context.jsscripts = ["updatedrink.js"];
        var mysql = req.app.get('mysql');
        getDrink(res, mysql, context, req.params.drink_id, complete);
        function complete(){
            callbackcount++;
            if(callbackcount >= 1){
                res.render('update-drink', context);
            } 
        }
    });

    // adds a drink. redirects to the drink page after adding
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Drinks(drink_name, cost) VALUES (?,?)";
        var inserts = [req.body.drink_name, req.body.cost];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/drinks');
            }
        });
    });

    // The URI to update data is sent to in order to update a drink 
    router.put('/:drink_id', function(req,res){
        var mysql= req.app.get('mysql');
        var sql = "UPDATE Drinks SET drink_name=?, cost=? WHERE drink_id =?";
        var inserts = [req.body.drink_name, req.body.cost, req.params.drink_id];
        sql = mysql.pool.query(sql, inserts, function(error,results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    // Route to delete a drink, and return 202 upon success
    router.delete('/:drink_id', function(req,res){
        var mysql= req.app.get('mysql');
        var sql = "DELETE FROM Drinks WHERE drink_id = ?";
        var inserts = [req.params.drink_id];
        sql= mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        });
    });
    return router;
}();
