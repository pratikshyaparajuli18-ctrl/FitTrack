<?php

//start the session
session_start();
if(!isset($_SESSION['userkey'])) {
	$_SESSION['userkey']='';
}

if ($_SESSION['userkey'] != '') {
	$_SESSION['logged'] = true;
} else {
	$_SESSION['logged'] = false;
}

?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FitTrack</title>
    <link rel="stylesheet" href="styles.css" />
    <script src="background/background.js" defer></script>
    <script src="index.js" defer></script>
  </head>
  <body>
    <canvas id="background" data-shader="wave.glsl"></canvas>
    <!-- background.js looks for this if the animation cannot load -->
    <div id="shader-error" hidden></div>

    <div class="page">
      <header class="banner">
        <nav class="menu">
          <a href="index.php">Home</a>
          <a href="plans.php">Plans</a>
          <a href="#contact">Contact</a>
			<?php if($_SESSION['logged'] == true): ?>
          <a href="ProfileGoals.php">Workout Goals</a>
			<?php endif; ?>

          <div class="account-links">
			<?php if ($_SESSION['logged']): ?>
				<a class="login" href="SignOut.php">Log Out</a>
			<?php else: ?>
				<a class="login" href="SignIn.php">Log In</a>
			<?php endif; ?>
						<a class="login" href="SignUp.php">Sign Up</a>
          </div>
        </nav>
      </header>

      <!-- index.js fills the empty workout and exercise lists -->
      <main class="layout" id="main">
  <nav class="left-pane"></nav>

  <section class="right-pane">
    <div class="workout-controls">
      <div class="info">
        <h1 id="workout-name">Loading workouts…</h1>
        <p id="workout-info"></p>
      </div>

      <nav class="exercise-list" id="exercise-list"></nav>
    </div>

    <div class="workout-preview">
      <h2 class="exercise-title" id="exercise-name"></h2>

      <section class="media" id="current-image"></section>

      <p class="exercise-details" id="exercise-info"></p>
    </div>
  </section>
</main>
    </div>

    <footer class="contact-footer" id="contact">
      <h2>Contact FitTrack</h2>
      <p>Have a question or suggestion? Get in touch.</p>
      <a href="mailto:contact@example.com">contact@example.com</a>
    </footer>
  </body>
</html>
