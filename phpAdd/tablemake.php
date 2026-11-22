<?php
//this is a private unintegrated webaddress to make the tables in the db for the website

session_start();
	
require_once('FTDBconn.php');
	
$username = trim($_POST['username']);
$password = trim($_POST['password']);

$stmt = $pdo->prepare('CREATE TABLE users (
  UID INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1000 INCREMENT BY 1) PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  pass VARCHAR(20) NOT NULL
)');

$stmt->execute();
$result = $stmt->fetchAll();


?>
