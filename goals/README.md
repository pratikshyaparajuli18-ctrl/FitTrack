FitTrack Fitness Goals Backend

Overview
The Fitness Goals module is part of the FitTrack fitness tracking website. It allows logged-in users to create, view, update, and delete their fitness goals.

Features
- Create fitness goals for weight loss, muscle gain, or endurance.
- Set target and current values.
- View saved fitness goals.
- Update goal progress.
- Delete fitness goals.

Technologies
- HTML and CSS
- PHP
- MySQL
- WAMP Server

Database
The module uses the `fitness_goals` table to store goal information, including the user ID, goal type, target value, current value, status, and creation date.

Security
- PHP session-based login checks
- Prepared SQL statements
- Server-side input validation
- CSRF protection for Save, Update, and Delete operations
- User-specific database queries

Local Setup
1. Install and start WAMP Server.
2. Create the database using `fitness_goals.sql`.
3. Copy `db_connect.example.php` to `db_connect.php` and configure the local database connection.
4. Connect the module to the team's login system.
5. Open `goals.php` through localhost after logging in.

Testing
The Create, Read, Update, and Delete operations were tested locally using a temporary test session. Login restrictions and CSRF protection were also tested.

Integration Status
The Fitness Goals module is awaiting integration with the team's login system and final combined application testing.
