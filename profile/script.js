document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    let shortGoal = document.getElementById("shortgoal").value.trim();

    if (shortGoal.length < 10) {
        alert("Please enter at least 10 characters for your short-term goal.");
        return;
    }

    let longGoal = document.getElementById("longgoal").value.trim();

    if (longGoal.length < 10) {
    alert("Please enter at least 10 characters for your long-term goal.");
    return;
}

alert("Your fitness profile has been submitted successfully!");

});

