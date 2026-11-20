<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitTrack - Fitness Goals</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav aria-label="Main navigation">
        <a href="../frontpage.html">Home</a>
        <a href="../SignIn.html">Log In</a>
        <a href="../SignUp.html">Sign Up</a>
        <a href="index.php" aria-current="page">Fitness Profile</a>
    </nav>

    <h1>FitTrack</h1>
    <p>Fitness Goals and Progress Tracking</p>
<form>

<br>

<fieldset>
    <legend>Fitness Goals</legend>

    <p>Select your main fitness goal:</p>

    <input type="radio" id="weightloss" name="goal" value="weightloss" required>
    <label for="weightloss">Weight Loss</label>

    <br>
    <input type="radio" id="musclegain" name="goal" value="musclegain">
    <label for="musclegain">Muscle Gain</label>

    <br>
    <input type="radio" id="endurance" name="goal" value="endurance">
    <label for="endurance">Improve Endurance</label>

    <br><br>
    <label for="experience">Experience Level:</label>
    <select id="experience" name="experience" required>
        <option value="">Select your level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>

    </select>
    <br><br>
    <p>Preferred Workout Types:</p>

    <input type="checkbox" id="cardio" name="workout" value="cardio">
    <label for="cardio">Cardio</label>

    <br>
    <input type="checkbox" id="strength" name="workout" value="strength">
    <label for="strength">Strength Training</label>

    <br>
    <input type="checkbox" id="yoga" name="workout" value="yoga">
    <label for="yoga">Yoga</label>

    <br><br>
    <label for="shortgoal">Short-Term Fitness Goal:</label>
    <br>
    <textarea id="shortgoal" name="shortgoal" rows="4" cols="40" maxlength="200" required></textarea>

    <br><br>
    <label for="longgoal">Long-Term Fitness Goal:</label>
    <br>
    <textarea id="longgoal" name="longgoal" rows="4" cols="40" maxlength="300" required></textarea>

    </fieldset>

    <br>
    <button type="submit">Save Fitness Profile</button>

    
    </form>
    <script src="script.js"></script>
</body>
</html>
