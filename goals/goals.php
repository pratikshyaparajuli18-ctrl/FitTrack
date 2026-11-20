<?php
require_once "db_connect.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles.css">
    <meta charset="UTF-8">
    <title>FitTrack - Add Fitness Goal</title>
</head>
<body>
    <h1>FitTrack Fitness Goals</h1>

    <form action="save_goal.php" method="POST">
        <label for="goal_type">Goal Type:</label>
        <select name="goal_type" id="goal_type" required>
            <option value="">Select a goal</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Endurance">Endurance</option>
        </select>

        <br><br>

        <label for="target_value">Target Value:</label>
        <input type="number" name="target_value"
               id="target_value" min="0.01"
               step="0.01" required>

        <br><br>

        <label for="current_value">Current Value:</label>
        <input type="number" name="current_value"
               id="current_value" min="0"
               step="0.01" required>

        <br><br>

        <button type="submit">Save Goal</button>
    </form>
</body>
</html>

