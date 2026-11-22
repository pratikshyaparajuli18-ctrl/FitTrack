<html>

<head></head>

<body>

<?php
//connect to the db

$host = getenv('HOST');
$port = getenv('PORT');
$db = getenv('DATABASE');
$user = getenv('USERNAME');
$pass = getenv('PASSWORD');

$connString = "pgsql:host=$host;port=$port;dbname=$db";

DEFINE("host", $connString);
DEFINE("user", $user);
DEFINE("pass", $pass);
DEFINE("db", $db);

$dbconn = new mysqli(host, user, pass, db);
	
	if(mysqli_connect_errno()) {
		printf("Cannot connect." %s\n, mysqli_connect_error());
	}
	

?>
</body>
</html>
