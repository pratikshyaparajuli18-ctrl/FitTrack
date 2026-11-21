<?php
	session_start();
	
	require_once('FTDBconn.php');
	
	$username = trim($_POST['username']);
	$password = trim($_POST['password']);
	
	$stmt = $dbconn->prepare("SELECT username FROM users WHERE username = ?");
	
	$stmt->bind_param("s", $username);
	
	$stmt->execute();
	
	$result = $stmt->fetch();
	
	
	if(!empty($result)) {
		header("Location: SignUp.php");
		exit();
	} else {
		$_SESSION['UN'] = $username;
		$_SESSION['PW'] = $password;
		header("Location: ProfileGoals.php");
		exit();
	}
?>