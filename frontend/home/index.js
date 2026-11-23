const asset_base = new URL(
  "/backend/exercises/exercise-images/",
  document.baseURI,
);

const workout_data_url = new URL(
  "/frontend/home/workouts.json",
  document.baseURI,
);

const workout_list = document.querySelector(".left-pane");
const exercise_list = document.querySelector("#exercise-list");

const workout_name = document.querySelector("#workout-name");
const workout_info = document.querySelector("#workout-info");
const exercise_name = document.querySelector("#exercise-name");
const exercise_info = document.querySelector("#exercise-info");
const main_image = document.querySelector("#current-image");

let workouts = [];
const exercise_by_id = new Map();

let selected_workout = null;
let selected_exercise = null;

let animation_timer = null;
let animation_generation = 0;

async function fetch_json(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`${url}: HTTP ${response.status}`);
    }

    const body = await response.text();

    if (body.trimStart().startsWith("<")) {
      throw new Error(
        `The server returned HTML instead of JSON for ${response.url || url}. ` +
          "Check this URL against the PHP document root and the file location.",
      );
    }

    return JSON.parse(body);
  } finally {
    clearTimeout(timeout);
  }
}

function make_button(label, class_name, on_click) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = class_name;
  button.textContent = label;

  if (on_click) {
    button.addEventListener("click", on_click);
  }

  return button;
}

function list_placeholder(container, class_name, label) {
  const button = make_button(label, class_name);
  button.disabled = true;
  container.replaceChildren(button);
}

function mark_active(container, matches) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", matches(button));
  });
}

function show_placeholder(title, message) {
  const placeholder = document.createElement("div");
  placeholder.className = "media-placeholder";

  const heading = document.createElement("strong");
  const description = document.createElement("p");

  heading.textContent = title;
  description.textContent = message;

  placeholder.append(heading, description);
  main_image.replaceChildren(placeholder);
}

function display_id(id) {
  return id
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function load_workouts() {
  const [workout_result, catalog_result] = await Promise.allSettled([
    fetch_json(workout_data_url),
    fetch_json(new URL("exercises.json", asset_base)),
  ]);

  if (workout_result.status === "rejected") {
    throw workout_result.reason;
  }

  workouts = workout_result.value.workouts;

  if (!Array.isArray(workouts)) {
    throw new Error("Expected a workouts array.");
  }

  const ids = new Set();

  for (const workout of workouts) {
    if (!workout.id || !workout.name || !Array.isArray(workout.exercises)) {
      throw new Error("Each workout needs id, name, and exercises fields.");
    }

    if (ids.has(workout.id)) {
      throw new Error(`Duplicate workout: ${workout.id}`);
    }

    ids.add(workout.id);

    for (const entry of workout.exercises) {
      if (typeof entry?.exercise_id !== "string") {
        throw new Error(`Invalid exercise entry in ${workout.id}`);
      }
    }
  }

  if (
    catalog_result.status === "fulfilled" &&
    Array.isArray(catalog_result.value.exercises)
  ) {
    for (const exercise of catalog_result.value.exercises) {
      exercise_by_id.set(exercise.id, exercise);
    }
  } else {
    console.error("Exercise catalog unavailable:", catalog_result);
  }

  workout_list.replaceChildren();

  for (const workout of workouts) {
    const button = make_button(workout.name, "workout", () => {
      select_workout(workout.id);
    });

    button.dataset.workoutId = workout.id;
    workout_list.append(button);
  }

  if (workouts.length) {
    select_workout(workouts[0].id);
  } else {
    show_empty_page("No workouts yet", "Your workouts will appear here.");
  }
}

function select_workout(id) {
  const workout = workouts.find((item) => item.id === id);

  if (!workout) return;

  selected_workout = workout;
  selected_exercise = null;

  workout_name.textContent = workout.name;

  const count = workout.exercises.length;

  workout_info.textContent = [
    workout.description,
    `${count} ${count === 1 ? "exercise" : "exercises"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  mark_active(workout_list, (button) => button.dataset.workoutId === id);

  exercise_list.replaceChildren();

  workout.exercises.forEach((entry, index) => {
    const exercise = exercise_by_id.get(entry.exercise_id);
    const label = exercise?.name || display_id(entry.exercise_id);

    const button = make_button(label, "exercise", () => {
      select_exercise(index);
    });

    button.dataset.exerciseIndex = String(index);
    exercise_list.append(button);
  });

  if (count) {
    select_exercise(0);
  } else {
    stop_image_animation();

    exercise_name.textContent = "No exercises yet";
    exercise_info.textContent = "This workout is empty.";

    list_placeholder(exercise_list, "exercise", "No exercises");

    show_placeholder("No exercise selected", "Add a movement to this workout.");
  }
}

function select_exercise(index) {
  const entry = selected_workout?.exercises[index];

  if (!entry) return;

  const exercise = exercise_by_id.get(entry.exercise_id);
  selected_exercise = exercise || null;

  mark_active(
    exercise_list,
    (button) => Number(button.dataset.exerciseIndex) === index,
  );

  exercise_name.textContent = exercise?.name || display_id(entry.exercise_id);

  const details = [];

  if (exercise?.equipmentLabel) {
    details.push(`Equipment: ${exercise.equipmentLabel}`);
  }

  const muscles = exercise?.muscles?.primary || [];

  if (muscles.length) {
    const names = muscles.map((tag) => tag.replaceAll("_", " ")).join(", ");

    details.push(`Main muscles: ${names}`);
  }

  if (exercise?.level) {
    details.push(`Difficulty: ${exercise.level}`);
  }

  if (entry.sets != null) {
    details.push(`Sets: ${entry.sets}`);
  }

  if (entry.reps != null) {
    details.push(`Reps: ${entry.reps}`);
  }

  if (entry.notes) {
    details.push(entry.notes);
  }

  exercise_info.textContent =
    details.join(" · ") || "Exercise details are unavailable.";

  animate_images(exercise);
}

function stop_image_animation() {
  clearInterval(animation_timer);
  animation_timer = null;
  animation_generation++;
}

function preload_image(exercise, frame) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.alt = `${exercise.name}: ${frame} position`;

    const finish = (error) => {
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;

      if (error) {
        reject(error);
      } else {
        resolve(image);
      }
    };

    const timeout = setTimeout(() => {
      finish(new Error("Image timed out"));
    }, 12000);

    image.onload = () => finish();
    image.onerror = () => finish(new Error("Image unavailable"));

    image.src = new URL(exercise.images[frame], asset_base).href;
  });
}

async function animate_images(exercise) {
  stop_image_animation();

  const generation = animation_generation;

  const frames = (exercise?.frames || []).filter(
    (frame) => exercise.images?.[frame],
  );

  if (!frames.length) {
    show_placeholder(
      "Preview unavailable",
      "Choose another exercise or workout.",
    );
    return;
  }

  show_placeholder(
    "Loading preview…",
    "Your exercise images will appear here.",
  );

  const results = await Promise.allSettled(
    frames.map((frame) => preload_image(exercise, frame)),
  );

  // A newer selection may have replaced this exercise while loading.
  if (generation !== animation_generation) return;

  const images = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (!images.length) {
    show_placeholder(
      "Preview unavailable",
      "Choose another exercise or workout.",
    );
    return;
  }

  let index = 0;

  const show_frame = () => {
    main_image.replaceChildren(images[index]);
    index = (index + 1) % images.length;
  };

  show_frame();

  if (images.length > 1) {
    animation_timer = setInterval(show_frame, 1000);
  }
}

function show_empty_page(title, message) {
  stop_image_animation();

  selected_workout = null;
  selected_exercise = null;

  workout_name.textContent = title;
  workout_info.textContent = message;

  exercise_name.textContent = "Exercise preview";
  exercise_info.textContent = "Choose a workout to see its exercises.";

  list_placeholder(workout_list, "workout", "No workouts");
  list_placeholder(exercise_list, "exercise", "No exercises");

  show_placeholder(title, message);
}

load_workouts().catch((error) => {
  console.error("Workouts unavailable:", error);

  show_empty_page("Workouts unavailable", "Refresh the page to try again.");
});
