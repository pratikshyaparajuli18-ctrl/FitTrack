<?php
	session_start();
	
	require_once('FTDBconn.php');
	
	$username = trim($_POST['username']);
	$password = trim($_POST['password']);

	$query = $pdo->prepare('INSERT INTO users (username, pass) VALUES (:user, :pass) ');
	$query->execute([':user' => $username, ':pass' => $password]);

	$stmt = $pdo->prepare('SELECT username FROM users WHERE username = :user');

	$stmt->execute([':user' => 'active']);
	$result = $stmt->fetchAll();

	if(!empty($result)) {
		header("Location: SignUp.php");
		exit();
	} 
	else {
		$_SESSION['UN'] = $username;
		$_SESSION['PW'] = $password;
		header("Location: ProfileGoals.php");
		exit();
	}
?>
