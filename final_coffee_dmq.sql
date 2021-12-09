---- Drink Table Queries ------------------------------------------------
-- populate Drinks table
SELECT Drinks.drink_id, drink_name, cost FROM Drinks;

-- add new Drink to table
INSERT INTO Drinks(drink_name, cost) VALUES (?,?);

-- retrieve a single Drink for update functionality
SELECT drink_id, drink_name, cost FROM Drinks WHERE drink_id = ?;

-- update Drink based off of user input
UPDATE Drinks SET drink_name = ?, cost = ? WHERE drink_id = ?;

-- delete Drink from table
DELETE FROM Drinks WHERE drink_id = ?;
-------------------------------------------------------------------------

---- Location Table Queries ---------------------------------------------
-- populate Locations table
SELECT Locations.location_id, city_name, state_name FROM Locations;

-- add new Location to table
INSERT INTO Locations(city_name, state_name) VALUES (?,?);

-- retrieve a single Location for update functionality
SELECT location_id, city_name, state_name FROM Locations WHERE location_id = ?;

-- update Location based off of user input
UPDATE Locations SET city_name = ?, state_name = ? WHERE location_id = ?;

-- delete Location from table
DELETE FROM Locations WHERE location_id = ?;
-------------------------------------------------------------------------

---- Customer Table Queries ---------------------------------------------
-- populate Customers table
SELECT Customers.customer_id, first_name, last_name FROM Customers;

-- add new Customer to table
INSERT INTO Customers(first_name, last_name) VALUES (?, ?);

-- retrieve a single Customer for update functionality
SELECT customer_id, first_name, last_name FROM Customers WHERE customer_id = ?;

-- update Customer based off of user input
UPDATE Customers SET first_name = ?, last_name = ? WHERE customer_id = ?;

-- delete Customer from table
DELETE FROM Customers WHERE customer_id = ?;
-------------------------------------------------------------------------

---- Order Table Queries ------------------------------------------------
-- populate Orders table + retrieve naming information from joined tables
SELECT Orders.order_id, Orders.customer_id, Orders.location_id, 
    CONCAT(first_name, ' ', last_name) AS customer_name, 
    CONCAT(city_name, ' ', state_name) AS location_name 
    FROM Orders INNER JOIN Customers ON Orders.customer_id = Customers.customer_id 
    INNER JOIN Locations ON Orders.location_id = Locations.location_id;

-- add new Order to table
INSERT INTO Orders(customer_id, location_id) VALUES (?, ?);

-- delete Order from table
DELETE FROM Orders WHERE order_id = ?;

-- queries for dropdown functionality
SELECT customer_id as co_id, first_name, last_name FROM Customers;
SELECT location_id as lo_id, city_name, state_name FROM Locations;
-------------------------------------------------------------------------

---- DrinkOrders Table Queries -------------------------------------------
-- populate DrinkOrders table + retrieve naming information from joined tables
SELECT Orders.order_id, Orders.customer_id, Orders.location_id, 
    CONCAT(first_name, ' ', last_name) AS customer_name, 
    CONCAT(city_name, ', ', state_name) AS location_name, Drinks.drink_id, Drinks.drink_name 
    FROM Orders INNER JOIN DrinkOrders ON Orders.order_id = DrinkOrders.order_id 
    INNER JOIN Drinks ON Drinks.drink_id = DrinkOrders.drink_id 
    INNER JOIN Customers ON Orders.customer_id = Customers.customer_id 
    INNER JOIN Locations ON Orders.location_id = Locations.location_id;

-- add new DrinkOrder to table
INSERT INTO DrinkOrders(drink_id, order_id) VALUES(?,?);

-- query for filtering DrinkOrders by customer_id
SELECT Orders.order_id, Orders.customer_id, Orders.location_id, 
    CONCAT(first_name, ' ', last_name) AS customer_name, 
    CONCAT(city_name, ', ', state_name) AS location_name, Drinks.drink_id, Drinks.drink_name 
    FROM Orders INNER JOIN DrinkOrders ON Orders.order_id = DrinkOrders.order_id 
    INNER JOIN Drinks ON Drinks.drink_id = DrinkOrders.drink_id 
    INNER JOIN Customers ON Orders.customer_id = Customers.customer_id 
    INNER JOIN Locations ON Orders.location_id = Locations.location_id WHERE Orders.customer_id = ?;

-- queries for dropdown functionality
SELECT drink_id, drink_name, cost FROM Drinks;
SELECT customer_id, CONCAT(first_name, ' ', last_name) AS full_name FROM Customers;
SELECT Orders.order_id, Orders.customer_id, 
    CONCAT(first_name, ' ', last_name) AS customer_name, Orders.location_id, 
    CONCAT(city_name, ', ', state_name) AS location_name 
    FROM Orders INNER JOIN Customers ON Orders.customer_id = Customers.customer_id 
    INNER JOIN Locations ON Orders.location_id = Locations.location_id;
-------------------------------------------------------------------------

---- DrinkLocations Table Queries ----------------------------------------
-- populate DrinkLocations table + retrieve naming information from joined tables
SELECT Drinks.drink_id, drink_name, Locations.location_id, 
    CONCAT(city_name, ', ', state_name) AS full_location 
    FROM Drinks INNER JOIN DrinkLocations ON Drinks.drink_id = DrinkLocations.drink_id 
    INNER JOIN Locations ON Locations.location_id = DrinkLocations.location_id;

-- add new DrinkLocations to table
INSERT INTO DrinkLocations(drink_id, location_id) VALUES (?,?);

-- query for filtering DrinkLocations by drink_id
SELECT DrinkLocations.drink_id, Drinks.drink_name, DrinkLocations.location_id, 
    CONCAT(city_name, ', ', state_name) AS full_location 
    FROM Drinks INNER JOIN DrinkLocations ON DrinkLocations.drink_id = Drinks.drink_id 
    INNER JOIN Locations ON DrinkLocations.location_id = Locations.location_id WHERE DrinkLocations.drink_id = ?;

-- queries for dropdown functionality
SELECT location_id as l_id, city_name, state_name FROM Locations;
SELECT drink_id as d_id, drink_name, cost FROM Drinks;
-------------------------------------------------------------------------