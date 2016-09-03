CREATE DATABASE  IF NOT EXISTS `blindgo` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `blindgo`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: blindgo
-- ------------------------------------------------------
-- Server version	5.6.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blinduser`
--

DROP TABLE IF EXISTS `blinduser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blinduser` (
  `BID` varchar(45) NOT NULL,
  `detail` text,
  `current_x` double DEFAULT NULL,
  `current_y` double DEFAULT NULL,
  `phone1` varchar(12) NOT NULL,
  `phone2` varchar(12) DEFAULT NULL,
  `isneedhelp` tinyint(4) DEFAULT '0',
  `target_x` double DEFAULT '0',
  `target_y` double DEFAULT '0',
  `isneedcalling` tinyint(4) DEFAULT '0',
  `work` varchar(45) DEFAULT NULL,
  `blindusercol` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`BID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blinduser`
--

LOCK TABLES `blinduser` WRITE;
/*!40000 ALTER TABLE `blinduser` DISABLE KEYS */;
INSERT INTO `blinduser` VALUES ('qwer0001','I am a blindmen who was no money',116.36,39.63,'13261192585','13261192585',0,116.4569,39.9,1,'0',NULL),('qwer0002','I love yuanYuanDan,wo zhen de hao xiang ni',116.36,39.63,'13261192585',NULL,1,113.39,39.63,0,'0',NULL);
/*!40000 ALTER TABLE `blinduser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history` (
  `BID` varchar(45) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `s_x` double DEFAULT NULL,
  `s_y` double DEFAULT NULL,
  `e_x` double DEFAULT NULL,
  `e_y` double DEFAULT NULL,
  PRIMARY KEY (`BID`,`start_time`),
  CONSTRAINT `BID` FOREIGN KEY (`BID`) REFERENCES `blinduser` (`BID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES ('qwer0001','2016-07-16 12:20:33','2016-07-30 17:12:31',12.15,12.16,116.36,39.63),('qwer0001','2016-08-20 18:39:19','2016-08-20 18:39:28',116.36,39.63,116.36,39.63),('qwer0001','2016-08-20 19:00:42','2016-08-20 19:00:48',116.36,39.63,116.36,39.63),('qwer0001','2016-08-20 19:25:49','2016-08-20 19:25:52',116.36,39.63,116.36,39.63),('qwer0001','2016-08-20 19:25:52','2016-08-20 19:26:03',116.36,39.63,116.36,39.63),('qwer0001','2016-09-01 11:08:19','2016-09-01 11:08:29',116.36,39.63,116.36,39.63),('qwer0001','2016-09-01 11:08:38','2016-09-01 11:08:45',116.36,39.63,116.36,39.63),('qwer0001','2016-09-03 10:58:33','2016-09-03 10:58:43',116.36,39.63,116.36,39.63),('qwer0001','2016-09-03 10:58:56','2016-09-03 10:59:41',116.36,39.63,116.36,39.63),('qwer0001','2016-09-03 11:01:38','2016-09-03 11:02:05',116.36,39.63,116.36,39.63),('qwer0001','2016-09-03 11:02:13','2016-09-03 11:02:22',116.36,39.63,116.36,39.63);
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insole`
--

DROP TABLE IF EXISTS `insole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insole` (
  `ID` varchar(45) NOT NULL,
  `isUse` tinyint(4) DEFAULT '0',
  `isDiscard` tinyint(4) DEFAULT '0',
  `produce_date` date DEFAULT NULL,
  `discard_date` date DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insole`
--

LOCK TABLES `insole` WRITE;
/*!40000 ALTER TABLE `insole` DISABLE KEYS */;
INSERT INTO `insole` VALUES ('qwer0001',0,0,NULL,NULL),('qwer0002',0,0,NULL,NULL),('qwer0003',0,0,NULL,NULL);
/*!40000 ALTER TABLE `insole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `normaluser`
--

DROP TABLE IF EXISTS `normaluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `normaluser` (
  `username` varchar(30) NOT NULL,
  `password` varchar(45) NOT NULL,
  `B_ID` varchar(45) DEFAULT NULL,
  `scores` int(11) DEFAULT '0',
  `isworking` tinyint(4) NOT NULL DEFAULT '0',
  `phone` varchar(45) NOT NULL,
  PRIMARY KEY (`username`),
  KEY `BID_idx` (`B_ID`),
  CONSTRAINT `B_ID` FOREIGN KEY (`B_ID`) REFERENCES `blinduser` (`BID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='This table contains detail of volunteer and famliy';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `normaluser`
--

LOCK TABLES `normaluser` WRITE;
/*!40000 ALTER TABLE `normaluser` DISABLE KEYS */;
INSERT INTO `normaluser` VALUES ('shenjialiang','123456',NULL,NULL,0,'13261192585'),('test1','123456',NULL,0,0,'13261192585'),('yifangqi','123456',NULL,NULL,0,'13261192585'),('yifangqiu','123456','qwer0001',NULL,0,'13261192585');
/*!40000 ALTER TABLE `normaluser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `normaluser_history`
--

DROP TABLE IF EXISTS `normaluser_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `normaluser_history` (
  `time` datetime NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `scores` int(11) NOT NULL DEFAULT '0',
  `username` varchar(30) NOT NULL,
  `BID` varchar(45) NOT NULL,
  `issuccess` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`BID`,`time`,`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `normaluser_history`
--

LOCK TABLES `normaluser_history` WRITE;
/*!40000 ALTER TABLE `normaluser_history` DISABLE KEYS */;
INSERT INTO `normaluser_history` VALUES ('2016-08-17 14:42:21',116.36,39.63,1,'yifangqiu','qwer0001',1),('2016-08-17 14:47:34',116.36,39.63,1,'yifangqiu','qwer0001',1);
/*!40000 ALTER TABLE `normaluser_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-03 14:20:20
