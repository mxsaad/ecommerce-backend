-- MySQL dump 10.13  Distrib 8.0.32, for macos13.0 (arm64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table Admin
--

DROP TABLE IF EXISTS Admin;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Admin (
  AdminID int NOT NULL AUTO_INCREMENT,
  FirstName varchar(16) NOT NULL,
  LastName varchar(16) NOT NULL,
  Username varchar(16) NOT NULL,
  Passkey varchar(128) NOT NULL,
  Email varchar(32) NOT NULL,
  Permissions int DEFAULT '3',
  PRIMARY KEY (AdminID),
  UNIQUE KEY AdminID (AdminID),
  UNIQUE KEY Username (Username),
  UNIQUE KEY Email (Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Admin
--

LOCK TABLES Admin WRITE;
/*!40000 ALTER TABLE Admin DISABLE KEYS */;
INSERT INTO Admin VALUES (1,'Jeff','Bezos','jeffbezos','supersecurepassword','jeffbezos@example.com',5),(2,'Elon','Musk','elonmusk','teslaisthebest','elonmusk@example.com',6),(3,'Bill','Gates','billgates','microsoft4life','billgates@example.com',3),(4,'Mark','Zuckerberg','markzuckerberg','facebookrocks','markzuckerberg@example.com',2),(5,'Larry','Page','larrypage','googleisthebest','larrypage@example.com',1),(6,'Sergey','Brin','sergeybrin','google4ever','sergeybrin@example.com',1),(7,'Warren','Buffett','warrenbuffett','weloveberkshire','warrenbuffett@example.com',5),(8,'Oprah','Winfrey','oprahwinfrey','theoprahshow','oprahwinfrey@example.com',7),(9,'Richard','Branson','richardbranson','virginrocks','richardbranson@example.com',1),(10,'Jack','Ma','jackma','alibabaisgreat','jackma@example.com',3);
/*!40000 ALTER TABLE Admin ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table Cart
--

DROP TABLE IF EXISTS Cart;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Cart (
  CartID int NOT NULL AUTO_INCREMENT,
  CustomerID int NOT NULL,
  Total decimal(16,2) DEFAULT '0.00',
  PRIMARY KEY (CartID),
  UNIQUE KEY CartID (CartID),
  UNIQUE KEY CustomerID (CustomerID),
  CONSTRAINT cart_ibfk_1 FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Cart
--

LOCK TABLES Cart WRITE;
/*!40000 ALTER TABLE Cart DISABLE KEYS */;
INSERT INTO Cart VALUES (1,1,799.99),(2,2,0.00),(3,3,2099.97),(4,4,899.99),(5,5,0.00),(6,6,349.99),(7,7,0.00),(8,8,228.99),(9,9,0.00),(10,10,1299.99);
/*!40000 ALTER TABLE Cart ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table Category
--

DROP TABLE IF EXISTS Category;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Category (
  CategoryID int NOT NULL AUTO_INCREMENT,
  CategoryName varchar(16) NOT NULL,
  CategoryDescription varchar(64) NOT NULL,
  PRIMARY KEY (CategoryID),
  UNIQUE KEY CategoryID (CategoryID),
  UNIQUE KEY CategoryName (CategoryName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Category
--

LOCK TABLES Category WRITE;
/*!40000 ALTER TABLE Category DISABLE KEYS */;
INSERT INTO Category VALUES (1,'Smartphones','Mobile devices with advanced computing capabilities'),(2,'Laptops','Portable computers designed for mobile use'),(3,'TVs','Electronic devices used for watching programs and movies'),(4,'Headphones','Devices worn on or around the head to listen to audio'),(5,'Cameras','Electronic devices used for capturing images and videos');
/*!40000 ALTER TABLE Category ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table Customer
--

DROP TABLE IF EXISTS Customer;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Customer (
  CustomerID int NOT NULL AUTO_INCREMENT,
  FirstName varchar(16) NOT NULL,
  LastName varchar(16) NOT NULL,
  Username varchar(16) NOT NULL,
  Passkey varchar(128) NOT NULL,
  Email varchar(32) NOT NULL,
  Phone bigint NOT NULL,
  PRIMARY KEY (CustomerID),
  UNIQUE KEY CustomerID (CustomerID),
  UNIQUE KEY Username (Username),
  UNIQUE KEY Email (Email),
  UNIQUE KEY Phone (Phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Customer
--

LOCK TABLES Customer WRITE;
/*!40000 ALTER TABLE Customer DISABLE KEYS */;
INSERT INTO Customer VALUES (1,'John','Doe','johndoe','password123','johndoe@example.com',1234567890),(2,'Jane','Doe','janedoe','password456','janedoe@example.com',1345678901),(3,'Bob','Smith','bobsmith','password789','bobsmith@example.com',1456789012),(4,'Alice','Johnson','alicejohnson','passwordabc','alicejohnson@example.com',1564561234),(5,'Tom','Lee','tomlee','passworddef','tomlee@example.com',1678901234),(6,'Sara','Garcia','saragarcia','passwordxyz','saragarcia@example.com',1789012345),(7,'David','Brown','davidbrown','password123','davidbrown@example.com',1890123456),(8,'Amy','Taylor','amytaylor','password456','amytaylor@example.com',1901234567),(9,'Michael','Johnson','michaeljohnson','password789','michaeljohnson@example.com',1012345678),(10,'Linda','Davis','lindadavis','passwordabc','lindadavis@example.com',1114567890);
/*!40000 ALTER TABLE Customer ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table Discount
--

DROP TABLE IF EXISTS Discount;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Discount (
  DiscountID int NOT NULL AUTO_INCREMENT,
  DiscountName varchar(16) DEFAULT 'Coupon',
  DiscountDescription varchar(32) DEFAULT NULL,
  Active int DEFAULT '0',
  Percent decimal(2,2) NOT NULL,
  PRIMARY KEY (DiscountID),
  UNIQUE KEY DiscountID (DiscountID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Discount
--

LOCK TABLES Discount WRITE;
/*!40000 ALTER TABLE Discount DISABLE KEYS */;
INSERT INTO Discount VALUES (1,'NewUser','10% off for new users',1,0.10),(2,'SummerSale','15% off for summer sale',1,0.15),(3,'FlashSale','20% off for one day only',0,0.20),(4,'Clearance','30% off for clearance items',1,0.30),(5,'Thanksgiving','25% off for Thanksgiving',1,0.25),(6,'Holiday','10% off for Holiday season',1,0.10),(7,'Birthday','5% off for Birthday',1,0.05);
/*!40000 ALTER TABLE Discount ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table HomeAddress
--

DROP TABLE IF EXISTS HomeAddress;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE HomeAddress (
  AddressID int NOT NULL AUTO_INCREMENT,
  CustomerID int NOT NULL,
  Line1 varchar(32) NOT NULL,
  Line2 varchar(32) DEFAULT NULL,
  City varchar(16) NOT NULL,
  PostalCode varchar(6) NOT NULL,
  Country varchar(16) NOT NULL,
  PRIMARY KEY (AddressID),
  UNIQUE KEY AddressID (AddressID),
  KEY CustomerID (CustomerID),
  CONSTRAINT homeaddress_ibfk_1 FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table HomeAddress
--

LOCK TABLES HomeAddress WRITE;
/*!40000 ALTER TABLE HomeAddress DISABLE KEYS */;
INSERT INTO HomeAddress VALUES (1,1,'123 Main St','','New York','10001','USA'),(2,2,'456 Elm St','','San Francisco','94109','USA'),(3,3,'789 Oak St','','Chicago','60611','USA'),(4,4,'321 Maple Ave','','Los Angeles','90001','USA'),(5,5,'555 Pine St','','Boston','02108','USA'),(6,6,'999 Market St','','San Francisco','94103','USA'),(7,7,'777 Broadway','','New York','10003','USA'),(8,8,'888 University Ave','','Palo Alto','94301','USA'),(9,9,'111 State St','','Madison','53703','USA'),(10,10,'222 Jefferson St','','Washington DC','20001','USA'),(11,1,'456 1st Ave','Apt 2B','New York','10009','USA'),(12,3,'987 State St','Unit 101','Chicago','60622','USA'),(13,5,'444 Beacon St','Unit 3','Boston','02115','USA');
/*!40000 ALTER TABLE HomeAddress ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view multipleaddresses
--

DROP TABLE IF EXISTS multipleaddresses;
/*!50001 DROP VIEW IF EXISTS multipleaddresses*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW multipleaddresses AS SELECT 
 1 AS FirstName,
 1 AS LastName,
 1 AS Line1,
 1 AS Line2,
 1 AS City,
 1 AS PostalCode,
 1 AS Country*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table OnlineOrder
--

DROP TABLE IF EXISTS OnlineOrder;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE OnlineOrder (
  OrderID int NOT NULL AUTO_INCREMENT,
  CustomerID int NOT NULL,
  PaymentID int NOT NULL,
  AddressID int NOT NULL,
  DiscountID int DEFAULT NULL,
  Total decimal(16,2) NOT NULL,
  OrderDate date NOT NULL,
  OrderTime time NOT NULL,
  PRIMARY KEY (OrderID),
  UNIQUE KEY OrderID (OrderID),
  KEY CustomerID (CustomerID),
  KEY PaymentID (PaymentID),
  KEY AddressID (AddressID),
  KEY DiscountID (DiscountID),
  CONSTRAINT onlineorder_ibfk_1 FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID),
  CONSTRAINT onlineorder_ibfk_2 FOREIGN KEY (PaymentID) REFERENCES Payment (PaymentID),
  CONSTRAINT onlineorder_ibfk_3 FOREIGN KEY (AddressID) REFERENCES HomeAddress (AddressID),
  CONSTRAINT onlineorder_ibfk_4 FOREIGN KEY (DiscountID) REFERENCES Discount (DiscountID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table OnlineOrder
--

LOCK TABLES OnlineOrder WRITE;
/*!40000 ALTER TABLE OnlineOrder DISABLE KEYS */;
INSERT INTO OnlineOrder VALUES (1,1,1,1,1,799.99,'2022-01-01','10:00:00'),(2,2,2,2,2,1099.99,'2022-01-02','11:00:00'),(3,3,3,3,3,899.99,'2022-01-03','12:00:00'),(4,4,4,4,NULL,599.99,'2022-01-04','13:00:00'),(5,5,5,5,NULL,899.99,'2022-01-05','14:00:00'),(6,6,6,6,4,299.99,'2022-01-06','15:00:00'),(7,7,7,7,5,699.99,'2022-01-07','16:00:00'),(8,8,8,8,NULL,399.99,'2022-01-08','17:00:00'),(9,9,9,9,NULL,599.99,'2022-01-09','18:00:00'),(10,10,10,10,NULL,999.99,'2022-01-10','19:00:00'),(11,1,11,11,6,1099.98,'2022-01-11','20:00:00'),(12,2,12,12,NULL,899.98,'2022-01-12','21:00:00'),(13,5,3,7,2,1099.99,'2022-01-13','22:00:00'),(14,7,2,8,NULL,1299.99,'2022-01-14','23:00:00'),(15,2,4,9,1,899.99,'2022-01-15','10:00:00'),(16,8,1,10,NULL,699.99,'2022-01-16','11:00:00'),(17,4,2,11,3,999.99,'2022-01-17','12:00:00'),(18,9,5,12,NULL,399.99,'2022-01-18','13:00:00'),(19,1,1,1,1,799.99,'2022-01-19','14:00:00'),(20,2,2,2,2,1099.99,'2022-01-20','15:00:00'),(21,3,3,3,3,899.99,'2022-01-21','16:00:00'),(22,4,4,4,NULL,599.99,'2022-01-22','17:00:00'),(23,5,5,5,NULL,899.99,'2022-01-23','18:00:00'),(24,6,6,6,4,299.99,'2022-01-24','19:00:00'),(25,5,13,13,NULL,699.99,'2022-01-25','15:30:00');
/*!40000 ALTER TABLE OnlineOrder ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view outofstock
--

DROP TABLE IF EXISTS outofstock;
/*!50001 DROP VIEW IF EXISTS outofstock*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW outofstock AS SELECT 
 1 AS SKU,
 1 AS ProductName,
 1 AS SupplierName,
 1 AS SupplierEmail,
 1 AS SupplierPhone*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table Payment
--

DROP TABLE IF EXISTS Payment;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Payment (
  PaymentID int NOT NULL AUTO_INCREMENT,
  CustomerID int NOT NULL,
  Brand varchar(16) NOT NULL,
  CardNumber bigint NOT NULL,
  ExpirationDate date NOT NULL,
  FirstName varchar(16) NOT NULL,
  LastName varchar(16) NOT NULL,
  SecurityCode smallint NOT NULL,
  PRIMARY KEY (PaymentID),
  UNIQUE KEY PaymentID (PaymentID),
  UNIQUE KEY CardNumber (CardNumber),
  KEY CustomerID (CustomerID),
  CONSTRAINT payment_ibfk_1 FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Payment
--

LOCK TABLES Payment WRITE;
/*!40000 ALTER TABLE Payment DISABLE KEYS */;
INSERT INTO Payment VALUES (1,1,'Visa',1234567812345678,'2025-06-30','John','Doe',123),(2,2,'Mastercard',1345678923456789,'2024-12-31','Jane','Doe',456),(3,3,'American Express',1456789034567890,'2023-09-30','Bob','Smith',789),(4,4,'Visa',1567890145678901,'2024-03-31','Alice','Johnson',234),(5,5,'Mastercard',1678901256789012,'2025-12-31','Tom','Lee',567),(6,6,'American Express',1789012367890123,'2022-06-30','Sara','Garcia',890),(7,7,'Visa',1890123478901234,'2023-10-31','David','Brown',123),(8,8,'Mastercard',1901234589012345,'2022-09-30','Amy','Taylor',456),(9,9,'American Express',1012345690123456,'2024-06-30','Michael','Johnson',789),(10,10,'Visa',1114567812345678,'2025-06-30','Linda','Davis',234),(11,1,'Mastercard',1115678923456789,'2024-12-31','John','Doe',567),(12,3,'American Express',1116789034567890,'2023-09-30','Bob','Smith',890),(13,5,'Visa',1117890145678901,'2024-03-31','Tom','Lee',123);
/*!40000 ALTER TABLE Payment ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view pendingcheckouts
--

DROP TABLE IF EXISTS pendingcheckouts;
/*!50001 DROP VIEW IF EXISTS pendingcheckouts*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW pendingcheckouts AS SELECT 
 1 AS FirstName,
 1 AS LastName,
 1 AS Email,
 1 AS Total*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table Product
--

DROP TABLE IF EXISTS Product;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Product (
  ProductID int NOT NULL AUTO_INCREMENT,
  ProductName varchar(32) NOT NULL,
  SKU varchar(10) NOT NULL,
  Cost decimal(6,2) NOT NULL,
  Price decimal(6,2) NOT NULL,
  CategoryID int NOT NULL,
  ProductDescription varchar(128) NOT NULL,
  Quantity int NOT NULL,
  SupplierID int NOT NULL,
  PRIMARY KEY (ProductID),
  UNIQUE KEY ProductID (ProductID),
  UNIQUE KEY ProductName (ProductName),
  UNIQUE KEY SKU (SKU),
  KEY CategoryID (CategoryID),
  KEY SupplierID (SupplierID),
  CONSTRAINT product_ibfk_1 FOREIGN KEY (CategoryID) REFERENCES Category (CategoryID),
  CONSTRAINT product_ibfk_2 FOREIGN KEY (SupplierID) REFERENCES Supplier (SupplierID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Product
--

LOCK TABLES Product WRITE;
/*!40000 ALTER TABLE Product DISABLE KEYS */;
INSERT INTO Product VALUES (1,'Samsung Galaxy S21','SGS21',700.00,799.99,1,'The latest flagship smartphone from Samsung',100,1),(2,'iPhone 13 Pro','IP13P',999.00,1099.99,1,'The latest flagship smartphone from Apple',50,2),(3,'Dell XPS 13','DX13',900.00,999.99,2,'A popular ultrabook from Dell',20,3),(4,'HP Pavilion','HPPAV',500.00,599.99,2,'A budget laptop from HP',30,4),(5,'Sony Bravia','SBRV',800.00,899.99,3,'A 4K HDR TV from Sony',15,5),(6,'LG OLED','LGOLED',1000.00,1199.99,3,'A high-end OLED TV from LG',10,6),(7,'Bose QuietComfort 35 II','BQC35',300.00,349.99,4,'A popular noise-cancelling headphone from Bose',25,7),(8,'JBL Charge 5','JBLCH5',100.00,129.99,4,'A portable Bluetooth speaker from JBL',50,8),(9,'Canon EOS Rebel T7','CNEOSR',500.00,599.99,5,'A popular entry-level DSLR camera from Canon',20,9),(10,'Nikon D7500','NKND75',900.00,999.99,5,'A mid-range DSLR camera from Nikon',15,10),(11,'Google Pixel 6','GPX6',600.00,699.99,1,'The latest flagship smartphone from Google',75,1),(12,'OnePlus 9 Pro','OP9P',800.00,899.99,1,'A high-end smartphone from OnePlus',50,2),(13,'Lenovo ThinkPad X1 Carbon','LTDX1C',1200.00,1399.99,2,'A premium ultrabook from Lenovo',10,3),(14,'ASUS VivoBook 15','ASVB15',400.00,499.99,2,'A budget laptop from ASUS',40,4),(15,'Samsung QLED','SGQLED',1500.00,1699.99,3,'A high-end QLED TV from Samsung',5,5),(16,'Sony WH-1000XM4','SWH1KXM4',350.00,399.99,4,'The latest noise-cancelling headphones from Sony',30,7),(17,'Apple AirPods Pro','AAPPRO',200.00,249.99,4,'The latest true wireless earbuds from Apple',50,2),(18,'Sony A7 III','SA7III',2000.00,2199.99,5,'A popular full-frame mirrorless camera from Sony',10,5),(19,'Fujifilm X-T4','FJFXT4',1500.00,1699.99,5,'A high-end APS-C mirrorless camera from Fujifilm',15,10),(20,'Logitech C920','LGC920',100.00,119.99,5,'A popular webcam for video conferencing',100,9),(21,'Samsung Galaxy A52 5G','SGA525G',350.00,399.99,1,'A mid-range 5G smartphone from Samsung',30,1),(22,'Sony VAIO Z','SVAIOZ',3000.00,3579.99,2,'A high-end laptop from Sony',10,5),(23,'HP Pavilion x360','HPPX360',650.00,749.99,2,'A versatile 2-in-1 laptop from HP',12,2),(24,'Amazon Echo Dot (4th Gen)','AE4',30.00,49.99,4,'A smart speaker with Alexa voice assistant from Amazon',50,5),(25,'DJI Mavic 2 Pro','DM2P',1500.00,1699.99,5,'A professional-grade drone from DJI',3,9);
/*!40000 ALTER TABLE Product ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table Supplier
--

DROP TABLE IF EXISTS Supplier;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE Supplier (
  SupplierID int NOT NULL AUTO_INCREMENT,
  SupplierName varchar(16) NOT NULL,
  Email varchar(32) NOT NULL,
  Phone bigint NOT NULL,
  PRIMARY KEY (SupplierID),
  UNIQUE KEY SupplierID (SupplierID),
  UNIQUE KEY SupplierName (SupplierName),
  UNIQUE KEY Email (Email),
  UNIQUE KEY Phone (Phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table Supplier
--

LOCK TABLES Supplier WRITE;
/*!40000 ALTER TABLE Supplier DISABLE KEYS */;
INSERT INTO Supplier VALUES (1,'Samsung','samsung@example.com',1231231230),(2,'Apple','apple@example.com',1241241240),(3,'Dell','dell@example.com',1251251250),(4,'HP','hp@example.com',1001001000),(5,'Sony','sony@example.com',1101101100),(6,'LG','lg@example.com',1261262160),(7,'Bose','bose@example.com',1271271270),(8,'JBL','jbl@example.com',1901114567),(9,'Canon','canon@example.com',1011145678),(10,'Nikon','nikon@example.com',1234511890);
/*!40000 ALTER TABLE Supplier ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view multipleaddresses
--

/*!50001 DROP VIEW IF EXISTS multipleaddresses*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=root@localhost SQL SECURITY DEFINER */
/*!50001 VIEW multipleaddresses AS select c.FirstName AS FirstName,c.LastName AS LastName,ha.Line1 AS Line1,ha.Line2 AS Line2,ha.City AS City,ha.PostalCode AS PostalCode,ha.Country AS Country from (customer c join homeaddress ha) where ((c.CustomerID = ha.CustomerID) and c.CustomerID in (select homeaddress.CustomerID from homeaddress group by homeaddress.CustomerID having (count(0) > 1))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view outofstock
--

/*!50001 DROP VIEW IF EXISTS outofstock*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=root@localhost SQL SECURITY DEFINER */
/*!50001 VIEW outofstock (SKU,ProductName,SupplierName,SupplierEmail,SupplierPhone) AS select product.SKU AS SKU,product.ProductName AS ProductName,supplier.SupplierName AS SupplierName,supplier.Email AS Email,supplier.Phone AS Phone from (product join supplier) where ((product.SupplierID = supplier.SupplierID) and (product.Quantity = 0)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view pendingcheckouts
--

/*!50001 DROP VIEW IF EXISTS pendingcheckouts*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=root@localhost SQL SECURITY DEFINER */
/*!50001 VIEW pendingcheckouts (FirstName,LastName,Email,Total) AS select customer.FirstName AS FirstName,customer.LastName AS LastName,customer.Email AS Email,cart.Total AS Total from (cart join customer) where ((cart.CustomerID = customer.CustomerID) and (cart.Total > 0)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-28 17:39:44
