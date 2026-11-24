<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plans</title>
    <link rel="stylesheet" href="styles.css" />
    <script src="background/background.js" defer></script>
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

      <main class="plans-main">
        <h1>Choose a plan!</h1>
        <p>Start with the essentials and stay small or get swole</p>

        <div class="plans-grid">
          <article class="plan-card">
            <h2>Free</h2>
            <p class="plan-price">Completely Free!</p>
            <p>Only the essentials.</p>
            <ul>
              <li>Browse the exercise library</li>
              <li>follow preset workout routines</li>
              <li>View exercise images</li>
            </ul>
            <a class="plan-button" href="SignUp.php?plan=free">
              Get started free
            </a>
          </article>

          <article class="plan-card premium">
            <h2>Premium</h2>
            <p class="plan-price">$4.99 <span>/ month</span></p>
            <p>More control over your training so you get swole.</p>
            <ul>
              <li>Everything in Free tier (duh).</li>
              <li>Create custom workout routines</li>
              <li>Track your workout progress</li>
            </ul>
            <a class="plan-button" href="SignUp.php?plan=premium">
              Choose Premium
            </a>
          </article>
        </div>
      </main>
    </div>

    <footer class="contact-footer" id="contact">
      <h2>Contact FitTrack</h2>
      <p>Have a question or suggestion? Get in touch.</p>
      <a href="mailto:contact@example.com">contact@example.com</a>
    </footer>
  </body>
</html>
