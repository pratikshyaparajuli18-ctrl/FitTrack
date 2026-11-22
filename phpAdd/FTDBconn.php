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

$connString = "pgsql:host=$host;port=$port;dbname=$db;";

DEFINE("host", $connString);
DEFINE("user", $user);
DEFINE("pass", $pass);
DEFINE("db", $db);

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die("Database connection error.");
}

/*
$dbconn = new mysqli(host, user, pass, db);
	
	if(mysqli_connect_errno()) {
		printf("Cannot connect." %s\n, mysqli_connect_error());
	}
*/	

?>
</body>
</html>
