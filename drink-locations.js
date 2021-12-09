module.exports=function(){
    var express=require('express');
    var router=express.Router();

    // Getter method for retrieving Locations
    function getLocations(res, mysql, context, complete)    {
        mysql.pool.query("SELECT location_id as l_id, city_name, state_name FROM Locations", function(error, results, fields)   {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    // Getter method for retrieving Drinks
    function getDrinks(res, mysql, context, complete)   {
        mysql.pool.query("SELECT drink_id as d_id, drink_name, cost FROM Drinks", function(error, results, fields)    {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drinks = results;
            complete();
        });
    }

    // Getter method for retrieving DrinkLocations
    function getDrinkLocations(res, mysql, context, complete)    {
        var sql = "SELECT Drinks.drink_id, drink_name, Locations.location_id, CONCAT(city_name, ', ', state_name) AS full_location FROM Drinks INNER JOIN DrinkLocations ON Drinks.drink_id = DrinkLocations.drink_id INNER JOIN Locations ON Locations.location_id = DrinkLocations.location_id";
        mysql.pool.query(sql, function(error, results, fields)  {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drink_locations = results;
            complete();
        });
    }

    // Retrieve DrinkLocations that contain the matching drink_id (for filtering purposes)
    function getLocationsbyDrink(req, res, mysql, context, complete)    {
        var query = "SELECT DrinkLocations.drink_id, Drinks.drink_name, DrinkLocations.location_id, CONCAT(city_name, ', ', state_name) AS full_location FROM Drinks INNER JOIN DrinkLocations ON DrinkLocations.drink_id = Drinks.drink_id INNER JOIN Locations ON DrinkLocations.location_id = Locations.location_id WHERE DrinkLocations.drink_id = ?";
        var inserts = [req.params.drink_id];
        console.log(inserts);
        mysql.pool.query(query, inserts, function(error, results, fields)   {
            if (error)  {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.drink_locations = results;
            complete();
        });
    }

    // Display table
    router.get('/', function(req,res){
        var callbackcount = 0;
        var context = {};
        context.jsscripts = ["filterbydrink.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'drink-location';
        getLocations(res, mysql, context, complete);
        getDrinks(res, mysql, context, complete);
        getDrinkLocations(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 3) {
                res.render(handlebars_file, context);
            }
        }
    });

    // Display all locations that sell the selected drink
    router.get('/filter/:drink_id', function(req, res)  {
        var callbackcount = 0;
        var context = {};
        context.jsscripts = ["filterbydrink.js"];
        var mysql = req.app.get('mysql');
        getLocationsbyDrink(req, res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getDrinks(res, mysql, context, complete);
        function complete() {
            callbackcount++;
            if (callbackcount >= 3) {
                res.render('drink-location', context);
            }
        }
    });

    // Add a new Drink-Location relationship to the table
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO DrinkLocations(drink_id, location_id) VALUES (?,?)";
        var inserts = [req.body.drink_id, req.body.location_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields)   {
            if (error)  {
                if (error.errno = 1062) {
                    res.render('1062');
                } else  {
                    res.write(JSON.stringify(error));
                    res.end();
                }
            }
            else    {
                res.redirect('/drink-locations');
            }
        });
    });

    return router;
}();

 

