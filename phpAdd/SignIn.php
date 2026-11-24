<?php
	session_start();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>FitTrack - Log In Page</title>

		<link href="styles.css" rel="stylesheet" />
		<script src="background/background.js" defer></script>

	</head>

	<body>
		<canvas id="background" data-shader="background/wave.glsl"></canvas>

      <header class="banner">
        <nav class="menu">
          <a href="index.php">Home</a>
          <a href="plans.php">Plans</a>
          <a href="#contact">Contact</a>

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

		<form action="LogIn.php" method="post">
			<fieldset>
				<h1>Log In</h1>
				<br>
				<label for="username">Username:</label>
				<input type="text" id="username" name="username" required />
				<br>
				<label for="password">Password:</label>
				<input type="password" id="password" name="password" required />
				<?php if (isset($_SESSION['retry'])): ?>
					<p>Invalid Log in information.</p>
				<?php unset($_SESSION['retry']); else: ?>
					<br>
				<?php endif; ?>
				<br>
				<p><a href="SignUp.php">don't have an account?</a></p>
				<button type="submit" name="submit">Log In</button>
			</fieldset>
		</form>
	</body>
</html>
