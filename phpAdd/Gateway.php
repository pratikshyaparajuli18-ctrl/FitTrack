<?php
	session_start();
	
	require_once('FTDBconn.php');
	
	$username = trim($_POST['username']);
	$password = trim($_POST['password']);

	$query = $pdo->prepare('INSERT INTO users (username, pass) VALUES (:user, :pass) ');
	$query->execute([':user' => $username, ':pass' => $password]);

	$stmt = $pdo->prepare('SELECT UID FROM users WHERE username = :user AND pass = :pass');

	$stmt->execute([':user' => $username, ':pass' => $password]);
	$result = $stmt->fetch(PDO::FETCH_ASSOC);

	if(!empty($result)) {
		$_SESSION['userkey'] = $result['uid'];
		header("Location: ProfileGoals.php");
		exit();
	} 
	else {
		$_SESSION['retry2'] = 'retry';
		header("Location: SignUp.php");
		exit();
	}
?>
