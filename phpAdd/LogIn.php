<?php
session_start();
//check for form submission
if(isset($_POST['submit'])) 
{
	
	require_once('FTDBconn.php');
	
	$username = trim($_POST['username']);
	$password = trim($_POST['password']);
	
	//get the userkey from the newly created entry
	$query = $dbconn->prepare("SELECT UID FROM users WHERE username = ? AND pass = ? LIMIT 1");
	$query->bind_param("ss", $username, $password);
	
	$query->execute();
	
	//get result from select statement
	$result= $query->get_result();
	$key = $result->fetch_assoc();
	
	$_SESSION['userkey'] = $key;

	header("Location: index.php");
}
exit;
?>
