<?php
session_start();
require_once "db_connect.php";

$user_id = $_SESSION["user_id"] ?? null;

if (!$user_id) {
    http_response_code(403);
    exit("Please log in to update your goal.");
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed.");
}

$goal_id = filter_var(
    $_POST["goal_id"] ?? null,
    FILTER_VALIDATE_INT
);

$current = filter_var(
    $_POST["current_value"] ?? null,
    FILTER_VALIDATE_FLOAT
);

if ($goal_id === false || $goal_id === null ||
    $goal_id <= 0 ||
    $current === false || $current === null ||
    $current < 0) {
    exit("Invalid goal information.");
}

$stmt = $pdo->prepare(
    "UPDATE fitness_goals
     SET current_value = ?
     WHERE goal_id = ? AND user_id = ?"
);

$stmt->execute([$current, $goal_id, $user_id]);

header("Location: view_goals.php");
exit;
?>
