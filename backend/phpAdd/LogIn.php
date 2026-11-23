<?php
session_start();
//check for form submission
if(isset($_POST['submit'])) 
{
	
	require_once('FTDBconn.php');
	
	$username = trim($_POST['username']);
	$password = trim($_POST['password']);
	
	//get the userkey from the newly created entry
	$query = $pdo->prepare('SELECT UID AS uid FROM users WHERE username = :user AND pass = :pass LIMIT 1');
	$query->execute([
					':user' => $username,
					':pass' => $password
	]);
	$user = $query->fetch(PDO::FETCH_ASSOC);

	if ($user) {
		$_SESSION['userkey'] = $user['uid'];
		header("Location: index.php");
		exit;
	} else {
		$_SESSION['retry'] = "retry";
		header("Location: SignIn.php");
		exit;
	}
}
?>
