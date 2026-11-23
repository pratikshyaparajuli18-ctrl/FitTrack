// Paths are relative to the HTML page.
const asset_base = new URL(
  "/backend/exercises/exercise-images/",
  document.baseURI,
);
const workout_data_url = new URL("./workouts.json", document.baseURI);

const workout_list = document.querySelector(".left-pane");
const exercise_list = document.querySelector("#exercise-list");
const image_list = document.querySelector(".images");

const workout_name = document.querySelector("#workout-name");
const workout_info = document.querySelector("#workout-info");
const exercise_name = document.querySelector("#exercise-name");
const exercise_info = document.querySelector("#exercise-info");
const main_image = document.querySelector("#current-image");

let workouts = [];
const exercise_by_id = new Map();

let selected_workout = null;
let selected_exercise = null;

async function fetch_json(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load ${url}: HTTP ${response.status}`);
  }

  return response.json();
}

function make_button(label, class_name, on_click) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = class_name;
  button.textContent = label;
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", on_click);

  return button;
}

function mark_active(button, active) {
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", String(active));
}

function display_tags(tags) {
  return tags.map((tag) => tag.replaceAll("_", " ")).join(", ");
}

async function load_workouts() {
  // Load the exercise catalog and our workout definitions once.
  const [catalog, workout_data] = await Promise.all([
    fetch_json(new URL("exercises.json", asset_base)),
    fetch_json(workout_data_url),
  ]);

  if (
    !Array.isArray(catalog.exercises) ||
    !Array.isArray(workout_data.workouts)
  ) {
    throw new Error(
      "Expected exercises and workouts arrays in the data files.",
    );
  }

  for (const exercise of catalog.exercises) {
    exercise_by_id.set(exercise.id, exercise);
  }

  workouts = workout_data.workouts;

  // Validate workout definitions and exercise references.
  const workout_ids = new Set();

  for (const workout of workouts) {
    if (!workout.id || !workout.name || !Array.isArray(workout.exercises)) {
      throw new Error("Each workout needs an id, name, and exercises array.");
    }

    if (workout_ids.has(workout.id)) {
      throw new Error(`Duplicate workout ID: ${workout.id}`);
    }

    workout_ids.add(workout.id);

    for (const entry of workout.exercises) {
      if (!exercise_by_id.has(entry.exercise_id)) {
        throw new Error(
          `Unknown exercise ID in ${workout.id}: ${entry.exercise_id}`,
        );
      }
    }
  }

  workout_list.replaceChildren();

  for (const workout of workouts) {
    const button = make_button(workout.name, "workout", () => {
      select_workout(workout.id);
    });

    button.dataset.workoutId = workout.id;
    workout_list.append(button);
  }

  if (workouts.length > 0) {
    select_workout(workouts[0].id);
  } else {
    workout_name.textContent = "No workouts yet";
    workout_info.textContent = "";
  }
}

function select_workout(id) {
  const workout = workouts.find((workout) => workout.id === id);

  if (!workout) return;

  selected_workout = workout;
  selected_exercise = null;

  workout_name.textContent = workout.name;

  const count = workout.exercises.length;

  workout_info.textContent =
    `${workout.description || ""} · ` +
    `${count} ${count === 1 ? "exercise" : "exercises"}`;

  workout_list.querySelectorAll(".workout").forEach((button) => {
    mark_active(button, button.dataset.workoutId === workout.id);
  });

  // Generate the selected workout's exercise buttons.
  exercise_list.replaceChildren();
  image_list.replaceChildren();
  main_image.replaceChildren();

  workout.exercises.forEach((entry, index) => {
    const exercise = exercise_by_id.get(entry.exercise_id);

    const button = make_button(exercise.name, "exercise", () => {
      select_exercise(index);
    });

    button.dataset.exerciseIndex = String(index);
    button.dataset.exerciseId = exercise.id;

    exercise_list.append(button);
  });

  if (workout.exercises.length > 0) {
    select_exercise(0);
  } else {
    exercise_name.textContent = "No exercises yet";
    exercise_info.textContent = "This workout has no exercises.";
  }
}

function select_exercise(index) {
  const entry = selected_workout?.exercises[index];

  if (!entry) return;

  const exercise = exercise_by_id.get(entry.exercise_id);
  selected_exercise = exercise;

  exercise_name.textContent = exercise.name;

  const details = [
    `Equipment: ${exercise.equipmentLabel}`,
    `Main muscles: ${display_tags(exercise.muscles.primary)}`,
    `Difficulty: ${exercise.level}`,
  ];

  // Optional fields belonging to this exercise within this workout.
  if (entry.sets != null) {
    details.push(`Sets: ${entry.sets}`);
  }

  if (entry.reps != null) {
    details.push(`Reps: ${entry.reps}`);
  }

  if (entry.notes) {
    details.push(entry.notes);
  }

  exercise_info.textContent = details.join(" · ");

  exercise_list.querySelectorAll(".exercise").forEach((button) => {
    mark_active(button, Number(button.dataset.exerciseIndex) === index);
  });

  // Generate buttons for the images this exercise actually has.
  image_list.replaceChildren();
  main_image.replaceChildren();

  const frame_labels = {
    start: "Start",
    mid: "Middle",
    end: "End",
    hold: "Hold",
  };

  for (const frame of exercise.frames) {
    const button = make_button(frame_labels[frame] || frame, "image", () =>
      select_image(frame),
    );

    button.dataset.frame = frame;
    image_list.append(button);
  }

  if (exercise.frames.length > 0) {
    select_image(exercise.frames[0]);
  } else {
    main_image.textContent = "No images available.";
  }
}

function select_image(frame) {
  const image_path = selected_exercise?.images[frame];

  if (!image_path) return;

  const image = document.createElement("img");

  image.src = new URL(image_path, asset_base).href;
  image.alt = `${selected_exercise.name}: ${frame} position`;
  image.width = selected_exercise.width;
  image.height = selected_exercise.height;
  image.decoding = "async";

  image.addEventListener("error", () => {
    // An old image's failure should not replace a newer selection.
    if (main_image.contains(image)) {
      main_image.textContent = "Image unavailable.";
    }
  });

  main_image.replaceChildren(image);

  image_list.querySelectorAll(".image").forEach((button) => {
    mark_active(button, button.dataset.frame === frame);
  });
}

load_workouts().catch((error) => {
  console.error(error);

  workout_list.replaceChildren();
  exercise_list.replaceChildren();
  image_list.replaceChildren();
  main_image.replaceChildren();

  workout_name.textContent = "Unable to load workouts";
  workout_info.textContent = "Please try again.";
  exercise_name.textContent = "";
  exercise_info.textContent = "";
});
