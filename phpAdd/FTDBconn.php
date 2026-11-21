<html>

<head></head>

<body>

<?php
//connect to the db

DEFINE("host", "localhost");
DEFINE("user","guest");
DEFINE("pass","LeastPriv21");
DEFINE("db","fittrackdb");

$dbconn = new mysqli(host, user, pass, db);
	
	if(mysqli_connect_errno()) {
		printf("Cannot connect." %s\n, mysqli_connect_error());
	}
	

?>
</body>
</html>