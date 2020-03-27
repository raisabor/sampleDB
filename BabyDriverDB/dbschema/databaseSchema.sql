CREATE DATABASE IF NOT EXISTS db;
USE db;

CREATE TABLE IF NOT EXISTS schools(
    id INT NOT NULL AUTO_INCREMENT,
    school_name VARCHAR(100),
    phone_number VARCHAR(50),
    city VARCHAR(50),
    school_state VARCHAR(50),
    street_address VARCHAR(50),
    zip_code VARCHAR(20),
    principal_first_name VARCHAR(50),
    principal_last_name VARCHAR(50),
    PRIMARY KEY(id),
    UNIQUE INDEX school_name_index (school_name)
);

INSERT INTO `schools` 
(school_name,
phone_number,
city,
school_state,
street_address,
zip_code,
principal_first_name,
principal_last_name)
VALUES
('Brewster Elementary School','9528367463', 'Dallas', 'Texas', '8364 Dyer Street', '75205', 'Theresa', 'Smith'),
('Sinclair Middle School','9568760017', 'Dallas', 'Texas', '1111 Dyer Street', '75205', 'Tommy', 'Smith');

CREATE TABLE IF NOT EXISTS babydriver_users(
    id INT NOT NULL AUTO_INCREMENT, 
    email VARCHAR(50) NOT NULL, 
    password VARCHAR(150) NOT NULL, 
    password_salt VARCHAR(50) NOT NULL, 
    school_id INT DEFAULT NULL, 
    PRIMARY KEY(id), 
    FOREIGN KEY(school_id) REFERENCES schools(id),
    UNIQUE INDEX email_index (email), 
    INDEX school_id_index (school_id)
);

INSERT INTO `babydriver_users` 
(email,
password,
password_salt,
school_id)
VALUES 
('babydriver@gmail.com','90cd574837526c5686fc17c78ec322535cf6fdc39675b67f1073d9f9a642ba6befac4221c04fb95925e34a3988287c5f17089473d9f54d965e48e91bef17797e','e07a7685081dd7e0',NULL),
('bdrivers@smu.edu','e415d20ee981add368cabcf6df05f480e500bf74b790ab91fbb9575ee9b78f9d885d51de19cc643ff81dd9b7ea23bd1fe6cebef25d4076bedada658e7e1e5407','8e3d53c359bbd8db',1),
('samuels@smu.edu','fb9af0a4f1cbe38b125c3a43f6d929bbb037af90abddd233f0f92d5942a7bd8b20a488d359face7c7b9bcb681b528c05b4c811ad63a37a874e83e4649ad9051d','ee8e52b451232045',NULL),
('JakeandJill@smu.edu','b89ae8c2751833e8cb4d871caa1e7617b38c786f81ee6cbb10dbd4728b5c8ef9fa6ef148786e131385fdfbdd60afcefdc5b9830c028089e0aeaad3b7059bb84a','2bf1ecb046b28e67',NULL),
('timmy@gmail.com','140b58a173e47044dea327c610887fa591cec58e4d6571c4ccdf84d4188ecffddca057e26bc8a38dde21c2496b072918bd4cdda63fc9e40e324c2511f32b5703','09610cfbd68d4b90',NULL),
('djjazzyjeff@gmail.com','0b1c1176f7b8e0c3049919cfd4849fac2f219f386a8c0103bf0413d240be87af1ec63b5517bea65ccf45fd1eb6a1f1f1053b776d778bd7a8440c094517b250f7','5d0aa37a82552a22',NULL),
('freshprince@gmail.com','d7215a1b704797acd094605bd726697321bca84c2e287f65da4ab70408bc981f3d49b1f15d717585a394149f51b9aada7cdf84588b0a5ef81bc833887a12dbee','0df3746e05630dd2',NULL),
('summertime@gmail.com','0c00fd04fa19ccdb805a5bfb19c125fff9c3f8587a30a45c5b66630aaeb77e467026920667bfe96c25e3c5c0dc14132abce5bfe18e29bfdb1366203ecc7667f5','4a7f69200caebe79',NULL),
('Willy@gmail.com','da85884460ccf619f726617cfd05148e1519546cb0c521718ac3c5d641b07c941af717630476a5f2eeaf4299c7b2c28cf756b704f34d5ea27944d4740ccc8dcf','040ca9b44bc69189',NULL),
('BillyJay@gmail.com','e725da6d5cf270b8a76b49ab08373c94de124a684ed2b22095591e68a61492c6af0bfdcfa85d180eb3c6716ccb96aff25d1b52a1e1a0389d86e401082a13f29c','c8e6bef18febdaaf',NULL);


CREATE TABLE IF NOT EXISTS user_contacts(
    id INT NOT NULL AUTO_INCREMENT, 
    user_id INT NOT NULL, 
    first_name VARCHAR(50), 
    last_name VARCHAR(50), 
    phone_number VARCHAR(50),
    PRIMARY KEY(id), 
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    INDEX user_id_index (user_id)
);


INSERT INTO `user_contacts` 
    (user_id,
    first_name,
    last_name,
    phone_number)
VALUES
(1, 'Samantha', 'Swan', '8565557648'),
(1, 'Sam', 'Singer', '1165558348'),
(1, 'Patrick', 'Ewing', '1325557648'),
(2, 'Madea', 'Smith', '7135557263'),
(2, 'Andrea', 'Daria', '9435558236'),
(3, 'Timothy', 'Dirgy', '9125558253');


CREATE TABLE IF NOT EXISTS emergency_contacts(
    id INT NOT NULL AUTO_INCREMENT, 
    user_id INT NOT NULL, 
    first_name VARCHAR(50), 
    last_name VARCHAR(50), 
    email VARCHAR(50), 
    phone_number VARCHAR(50), 
    PRIMARY KEY(id), 
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    INDEX user_id_index (user_id)
);

INSERT INTO `emergency_contacts` 
(user_id,
first_name,
last_name,
email,
phone_number)
VALUES
(6, 'Samantha', 'Swan','sams@gmail.com', '8565557648'),
(3, 'Sam', 'Singer', 'Samsinger@yahoo.com', '1165558348'),
(2, 'Patrick', 'Ewing', 'pewing@nba.com', '1325557648'),
(1, 'Madea', 'Smith', 'tylerperry@smu.edu',  '7135557263'),
(1, 'Andrea', 'Daria', 'Daria@mail.io', '9435558236'),
(4, 'Timothy', 'Dirgy', 'DirgyTi@smu.edu', '9125558253');


CREATE TABLE IF NOT EXISTS pickup_locations(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    pickup_loc_name VARCHAR(100),
    pickup_loc_city VARCHAR(50),
    pickup_loc_state VARCHAR(50),
    pickup_loc_street_address VARCHAR(100),
    pickup_loc_zip_code VARCHAR(20),
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id),
    INDEX user_id_index(user_id)
);


INSERT INTO `pickup_locations` 
(user_id,
pickup_loc_name,
pickup_loc_city,
pickup_loc_state,
pickup_loc_street_address,
pickup_loc_zip_code)
VALUES
(1, 'Home', 'Dallas', 'Texas', '7725 River Drive', '75230'),
(1, 'YMCA', 'Dallas', 'Texas', '1625 Dyer Street', '75205'),
(1, "Aunt's Home", 'Dallas', 'Texas', '9736 Skillman Street', '75210'),
(2, "Pa's Home", 'Dallas', 'Texas', '9000Skillman Street', '75210'),
(2, "Aunt's Home", 'Grapevine', 'Texas', '9736 Grape Street', '75000'),
(3, "Home", 'Dallas', 'Texas', '9000 Skillman Street', '75290'),
(3, "Home Depot", 'Dallas', 'Texas', '1852 Greenville Avenue', '75207'),
(4, "Fire Station", 'Dallas', 'Texas', '7382 Greenville Avenue', '75207');

CREATE TABLE IF NOT EXISTS cars(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(50),
    year VARCHAR(4),
    license_plate VARCHAR(25),
    PRIMARY KEY(id),
    INDEX user_id_index(user_id),
    FOREIGN KEY(user_id) REFERENCES babydriver_users(id)
);


INSERT INTO `cars` 
(user_id,
make,
model,
color,
year,
license_plate)
VALUES
(1, 'Honda', 'Fit', 'Red', '2003', 'UEX9637'),
(1, 'Nissan', 'Altima', 'Blue', '2012', 'PCV9637'),
(2, 'Honda', 'Civic', 'Black', '1998', 'JDMLOW'),
(3, 'Toyota', 'Camry', 'Red', '2010', 'UVV9020'),
(4, 'Toyota', 'Camry', 'Yellow', '2016', 'XN0273'),
(5, 'Suzuki', 'Bandit', 'Purple', '2009', 'DUNC00'),
(6, 'Mazda', 'Mazda3', 'Grey', '2018', 'UDBO73'),
(7, 'Mazda', 'Mazda6', 'Grey', '2019', 'KSTO73'),
(8, 'BMW', 'M3', 'Grey', '2008', 'RSO046'),
(9, 'Porchse', '911', 'Red', '2018', 'JVU563'),
(10, 'Tesla', 'Model 3', 'Black', '2019', 'FMD855');


CREATE TABLE IF NOT EXISTS children(
    id INT NOT NULL AUTO_INCREMENT,
    parent_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT,
    height INT,
    school_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY(parent_id) REFERENCES babydriver_users(id),
    FOREIGN KEY(school_id) REFERENCES schools(id),
    INDEX parent_id_index(parent_id),
    INDEX school_id_index(school_id)
);


INSERT INTO `children` 
(parent_id,
first_name,
last_name,
age,
height,
school_id)
VALUES
(1,'Timmy', 'Thompson', 10, 50, 2),
(1,'Elizabeth', 'Thompson', 6, 45, 1),
(2,'Sammy', 'Cinco', 11, 55, 2),
(3,'Tyler', 'Sneed', 11, 45, 2);


CREATE TABLE IF NOT EXISTS medical_needs(
    id INT NOT NULL AUTO_INCREMENT,
    child_id INT NOT NULL,
    medical_condition VARCHAR(50),
    notes VARCHAR(150),
    PRIMARY KEY(id),
    FOREIGN KEY(child_id) REFERENCES children(id),
    INDEX child_id_index(child_id)
);


INSERT INTO `medical_needs`
(child_id,
medical_condition,
notes)
VALUES
(1,'Asthma', 'Give him his inhaler and sit him down for about 5 minutes.'),
(1,'Peanut Allergy', "Give him benedryl. If that dosn't work, use the epipen.");


CREATE TABLE IF NOT EXISTS pickups(
    id INT NOT NULL AUTO_INCREMENT,
    child_id INT NOT NULL,
    date_created DATETIME,
    pickup_time TIME,
    pickup_date DATE,
    pickup_loc_id INT,
    assigned_to INT,
    progress INT,
    safeword VARCHAR(50),
    PRIMARY KEY(id),
    FOREIGN KEY(assigned_to) REFERENCES babydriver_users(id),
    FOREIGN KEY(child_id) REFERENCES children(id),
    FOREIGN KEY(pickup_loc_id) REFERENCES pickup_locations(id),
    INDEX child_id_index(child_id)
);


INSERT INTO `pickups` 
(child_id,
date_created,
pickup_time,
pickup_date,
pickup_loc_id,
assigned_to,
progress,
safeword)
VALUES
(1, '2018-12-06 11:30:02', '15:00:00', '2018-12-06',1 , 1, -1, '1329 SMU Blvd'),
(2, '2018-12-01 20:45:02', '13:00:00', '2016-12-06',1 , 2, 0, '3153 Hillcrest Ave');




