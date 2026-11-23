<?php
session_start();
require_once "db_connect.php";

$user_id = $_SESSION["userkey"] ?? null;

if (!$user_id) {
    http_response_code(403);
    exit("Please log in to delete a goal.");
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed.");
}

if (
    empty($_SESSION["csrf_token"]) ||
    !is_string($_POST["csrf_token"] ?? null) ||
    !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])
) {
    http_response_code(403);
    exit("Invalid security token.");
}


$goal_id = filter_var(
    $_POST["goal_id"] ?? null,
    FILTER_VALIDATE_INT
);

if ($goal_id === false || $goal_id === null || $goal_id <= 0) {
    http_response_code(400);
    exit("Invalid goal ID.");
}

$stmt = $pdo->prepare(
    "DELETE FROM fitness_goals
     WHERE goal_id = ? AND user_id = ?"
);

$stmt->execute([$goal_id, $user_id]);

header("Location: view_goals.php");
exit;
?>
