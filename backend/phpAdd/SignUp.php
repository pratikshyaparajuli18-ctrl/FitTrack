<!DOCTYPE html>	
<html>
	<head>
		<meta="UTF-8">
		<title>FitTrack - Log In Page</title>

		<link href="styles.css" rel="stylesheet" />
		<script src="background/background.js" defer></script>
	</head>

	<body>
		<!-- create the form for submission -->
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

		<form action="Gateway.php" method="post">
			<fieldset>
				<h1>Sign Up</h1>
				<br></br>
				<label for="username">Username:</label>
				<input type="text" id="username" name="username"  minlength="8" required />
				<br></br>
				<label for="password">Password:</label>
				<input type="password" id="password" name="password" minlength="12" required />
				<br></br>
				<br></br>
				<p><a href="SignIn.php">already have an account?</a></p>
				<button type="submit" name="submit">Sign Up</button>
			</fieldset>
		</form>
	</body>

</html>
