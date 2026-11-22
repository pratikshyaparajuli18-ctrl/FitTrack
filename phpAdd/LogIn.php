<?php
session_start();
//check for form submission
if(isset($_POST['submit'])) 
{
	
	require_once('FTDBconn.php');
	
	$username = trim($_POST['username']);
	$password = trim($_POST['password']);
	
	//get the userkey from the newly created entry
	$query = $pdo->prepare("SELECT UID FROM users WHERE username = :user AND pass = :pass LIMIT 1");
	$query->execute([
					':user' => $username,
					':pass' => $password
	]);
	
	//get result from select statement
	$result= $query->fetchAll();
	$key = array_first($result);
	
	$_SESSION['userkey'] = $key;

	header("Location: index.php");
}
exit;
?>
