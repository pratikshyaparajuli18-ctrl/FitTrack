<?php
//instant log out and redirect to homepage
session_start();

session_unset();
header("Location: index.php");

exit;
?>