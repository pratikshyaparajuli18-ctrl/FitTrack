<?php
session_start();
require_once __DIR__ . "/../phpAdd/FTDBconn.php";

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


// Goals must belong to an authenticated user.
// Dylon's login system will need to set this session value.
$user_id = $_SESSION["userkey"] ?? null;

if (!$user_id) {
    http_response_code(403);
    exit("Please log in before saving a goal.");
}

$goal_type = trim($_POST["goal_type"] ?? "");
$target = filter_var($_POST["target_value"] ?? null, FILTER_VALIDATE_FLOAT);
$current = filter_var($_POST["current_value"] ?? null, FILTER_VALIDATE_FLOAT);

$allowed = ["Weight Loss", "Muscle Gain", "Endurance"];

if (!in_array($goal_type, $allowed, true) ||
    $target === false || $target <= 0 ||
    $current === false || $current < 0) {
    exit("Invalid goal information.");
}

$stmt = $pdo->prepare(
    "INSERT INTO fitness_goals
    (user_id, goal_type, target_value, current_value)
    VALUES (?, ?, ?, ?)"
);

$stmt->execute([$user_id, $goal_type, $target, $current]);

header("Location: view_goals.php");
exit;
?>
