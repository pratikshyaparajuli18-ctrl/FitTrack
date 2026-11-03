
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    let shortGoal = document.getElementById("shortgoal").value.trim();
    let longGoal = document.getElementById("longgoal").value.trim();

    // Check short-term goal length
    if (shortGoal.length < 10) {
        alert("Please enter at least 10 characters for your short-term goal.");
        document.getElementById("shortgoal").focus();
        return;
    }

    // Check long-term goal length
    if (longGoal.length < 10) {
        alert("Please enter at least 10 characters for your long-term goal.");
        document.getElementById("longgoal").focus();
        return;
    }

    // Check that at least one workout is selected
    let workouts = document.querySelectorAll('input[name="workout"]:checked');

    if (workouts.length === 0) {
        alert("Please select at least one preferred workout.");
        document.getElementById("cardio").focus();
        return;
    }

    // Frontend prototype only - no data is saved
    alert("Fitness profile validated successfully! This is a demo, so your information has not been saved.");
});
