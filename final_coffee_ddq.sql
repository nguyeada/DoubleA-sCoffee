DROP TABLE IF EXISTS `DrinkLocations`;
DROP TABLE IF EXISTS `DrinkOrders`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Drinks`;
DROP TABLE IF EXISTS `Locations`;
DROP TABLE IF EXISTS `Customers`;

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers`(
    `customer_id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(25) NOT NULL, 
    `last_name` varchar(25) NOT NULL,
    PRIMARY KEY (`customer_id`),
    CONSTRAINT `full_name` UNIQUE (`first_name`, `last_name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` VALUES (1, 'Jane', 'Doe'), (2, 'John', 'Doe'), (3, 'Steven', 'Smith'), (4, 'Kelly', 'Johnson');

--
-- Table Structure for table `Locations`
--

CREATE TABLE `Locations` ( 
    `location_id` int(11) NOT NULL AUTO_INCREMENT, 
    `city_name` varchar(25) NOT NULL,
    `state_name` varchar(25) NOT NULL,
    PRIMARY KEY (`location_id`),
    CONSTRAINT `full_location` UNIQUE (`city_name`, `state_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping date for table `Locations`
--

INSERT INTO `Locations` VALUES (10, 'San Diego', 'California'), (11, 'Los Angeles', 'California'), (12, 'San Francisco', 'California');

--
-- Table Structure for table `Drinks`
--

CREATE TABLE `Drinks`(
    `drink_id` int(11) NOT NULL AUTO_INCREMENT,
    `drink_name` varchar(25) NOT NULL, 
    `cost` float(4,2) NOT NULL,
    PRIMARY KEY (`drink_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;

--
-- Dumping Data for table `Drinks`
--

INSERT INTO `Drinks` VALUES (1000, 'Black Coffee', 2.50), (1001, 'Latte', 3.50), (1002, 'Cappuccino', 4.00), (1003, 'Mocha', 4.00), (1004, 'Green Tea', 2.00), (1005, 'Black Tea', 2.00), (1006, 'Tea Latte', 3.00);

--
-- Table Structure for table `Orders`
-- NOTE: Changes below
--

CREATE TABLE `Orders`(
    `order_id` int(11) NOT NULL AUTO_INCREMENT,
    `customer_id` int(11) DEFAULT NULL,
    `location_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`order_id`),
    KEY `order_customer` (`customer_id`),
    KEY `order_location` (`location_id`),
    CONSTRAINT `order_customer` FOREIGN KEY (`customer_id`) REFERENCES Customers(`customer_id`) 
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT `order_location` FOREIGN KEY (`location_id`) REFERENCES Locations(`location_id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=500 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '1'), (SELECT `location_id` FROM Locations WHERE `location_id` = '10'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '1'), (SELECT `location_id` FROM Locations WHERE `location_id` = '10'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '2'), (SELECT `location_id` FROM Locations WHERE `location_id` = '11'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '2'), (SELECT `location_id` FROM Locations WHERE `location_id` = '11'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '3'), (SELECT `location_id` FROM Locations WHERE `location_id` = '12'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '3'), (SELECT `location_id` FROM Locations WHERE `location_id` = '12'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '4'), (SELECT `location_id` FROM Locations WHERE `location_id` = '10'));
INSERT INTO `Orders` (`customer_id`, `location_id`) VALUES ((SELECT `customer_id` FROM Customers WHERE `customer_id` = '4'), (SELECT `location_id` FROM Locations WHERE `location_id` = '10'));

-- 
-- Table Structure for table `DrinkOrders`
--

CREATE TABLE `DrinkOrders`(
    `drink_id` int(11) NOT NULL,
    `order_id` int(11) NOT NULL,
    PRIMARY KEY (`drink_id`, `order_id`),
    FOREIGN KEY (`drink_id`) 
        REFERENCES Drinks(`drink_id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`order_id`) 
        REFERENCES Orders(`order_id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- Dumping Data for table `DrinkOrders`
--

INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1000'), 500);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1001'), 501);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1003'), 502);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1004'), 503);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1002'), 504);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1005'), 505);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1006'), 506);
INSERT INTO `DrinkOrders` VALUES ((SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1000'), 507);

-- 
-- Table Structure for table `DrinkLocations`
--

CREATE TABLE `DrinkLocations`(
    `location_id` int(11) NOT NULL,
    `drink_id` int(11) NOT NULL,
    PRIMARY KEY (`location_id`, `drink_id`),
    FOREIGN KEY (`location_id`) 
        REFERENCES Locations(`location_id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`drink_id`) 
        REFERENCES Drinks(`drink_id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping Data for table `DrinkLocations`
--

INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1000'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1001'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1002'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1003'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1004'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1005'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '10'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1006'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1000'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1001'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1002'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1003'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1004'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1005'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '11'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1006'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1000'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1001'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1002'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1003'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1004'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1005'));
INSERT INTO `DrinkLocations` VALUES ((SELECT `location_id` FROM Locations WHERE `location_id` = '12'), (SELECT `drink_id` FROM Drinks WHERE `drink_id` = '1006'));
