<?php
//this is a private unintegrated webaddress to make the tables in the db for the website

session_start();
	
require_once('FTDBconn.php');

$stmt = pdo->prepare("CREATE TABLE fitness_goals (
    goal_id INT INCREMENT BY 1 PRIMARY KEY,
    user_id INT NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)");

/*
$stmt = $pdo->prepare('CREATE TABLE users (
  UID INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1000 INCREMENT BY 1) PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  pass VARCHAR(20) NOT NULL
)');
*/

$stmt->execute();
$result = $stmt->fetchAll();


?>
