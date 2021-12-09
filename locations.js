module.exports = function() {
    var express = require('express');
    var router = express.Router();

    // Get all Locations from Locations table
    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT Locations.location_id, city_name, state_name FROM Locations", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.locations = results;
        complete();
        });
    }

    // Retrieve the Location info that matches the corresponding location_id
    function getLocation(res, mysql, context, location_id, complete){
        var sql = "SELECT location_id, city_name, state_name FROM Locations WHERE location_id = ?";
        var inserts = [location_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.location = results[0];
            complete();
        });
    }   

    // Display all locations
    router.get('/', function(req, res){
        var callbackcount= 0;
        var context = {};
        context.jsscripts=["deletelocation.js"];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackcount++;
            if(callbackcount >= 1){
                console.log(context);
                res.render('location', context);
            }
        }
    });

    // Displays one location for updating purposes
    router.get('/:location_id', function(req, res){
        callbackcount = 0;
        var context = {};
        context.jsscripts = ["updatelocation.js"];
        var mysql = req.app.get('mysql');
        getLocation(res, mysql, context, req.params.location_id, complete);
        function complete(){
            callbackcount++;
            if(callbackcount >= 1){
                res.render('update-location', context);
            } 
        }
    });

    // Adds a location - redirects to the location page after adding
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Locations(city_name, state_name) VALUES (?,?)";
        var inserts = [req.body.city_name, req.body.state_name];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/locations');
            }
        });
    });

    // The URI to update data is sent to in order to update a location
    router.put('/:location_id', function(req,res)   {
        var mysql= req.app.get('mysql');
        var sql = "UPDATE Locations SET city_name = ?, state_name = ? WHERE location_id = ?";
        var inserts = [req.body.city_name, req.body.state_name, req.params.location_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields)   {
            if(error)   {
                res.write(JSON.stringify(error));
                res.end();
            }
            else    {
                res.status(200);
                res.end();
            }
        });
    });

    // Route to delete a drink, and return 202 upon success
    router.delete('/:location_id', function(req, res){
        var mysql= req.app.get('mysql');
        var sql = "DELETE FROM Locations WHERE location_id = ?";
        var inserts = [req.params.location_id];
        sql= mysql.pool.query(sql, inserts, function(error, results, fields){
            if (error)  {
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