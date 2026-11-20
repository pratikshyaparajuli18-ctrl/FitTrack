<?php
session_start();
require_once "db_connect.php";

$user_id = $_SESSION["user_id"] ?? null;

if (!$user_id) {
    http_response_code(403);
    exit("Please log in to view your goals.");
}

$stmt = $pdo->prepare(
    "SELECT goal_id, goal_type, target_value,
            current_value, status, created_at
     FROM fitness_goals
     WHERE user_id = ?
     ORDER BY created_at DESC, goal_id DESC"
);

$stmt->execute([$user_id]);
$goals = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles.css">
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>FitTrack - My Goals</title>
</head>
<body>
    <h1>My Fitness Goals</h1>

    <?php if (empty($goals)): ?>
        <p>No goals saved yet.</p>
    <?php else: ?>
        <table border="1" cellpadding="10">
            <tr>
                <th>Goal Type</th>
                <th>Target</th>
                <th>Current</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Date Created</th>
            </tr>

            <?php foreach ($goals as $goal): ?>
                <tr>
                    <td><?= htmlspecialchars($goal["goal_type"]) ?></td>
                    <td><?= htmlspecialchars($goal["target_value"]) ?></td>
                    
<td>
    <form action="update_goal.php" method="POST">
        <input type="hidden" name="goal_id"
               value="<?= (int)$goal['goal_id'] ?>">

        <input type="number" name="current_value"
               value="<?= htmlspecialchars($goal['current_value']) ?>"
               min="0" step="0.01" required>

        <button type="submit">Update Progress</button>
    </form>
</td>

                    <td><?= htmlspecialchars($goal["status"]) ?></td>

<td>
    <form action="delete_goal.php" method="POST"
          onsubmit="return confirm('Are you sure you want to delete this goal?');">

        <input type="hidden" name="goal_id"
               value="<?= (int)$goal['goal_id'] ?>">

        <button type="submit">Delete Goal</button>
    </form>
</td>

                    <td><?= htmlspecialchars($goal["created_at"]) ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>

    <p><a href="goals.php">Add Another Goal</a></p>
</body>
</html>
