const workout_buttons = document.querySelectorAll(".workout");
const image_buttons = document.querySelectorAll(".image");
const workout_name = document.querySelector("#workout-name");
const workout_info = document.querySelector("#workout-info");
const main_image = document.querySelector("#current-image");

let selected_workout = 0;

function select_image(index) {
  main_image.textContent = `Workout ${selected_workout + 1} Image ${index + 1}`;
  image_buttons.forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });
}

workout_buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    selected_workout = index;
    workout_name.textContent = `Workout ${index + 1}`;
    workout_info.textContent = `Information about Workout ${index + 1}`;
    workout_buttons.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
    select_image(0);
  });
});

image_buttons.forEach((button, index) => {
  button.addEventListener("click", () => select_image(index));
});
