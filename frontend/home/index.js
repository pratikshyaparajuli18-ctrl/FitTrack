const $ = (selector) => document.querySelector(selector);
// textContent keeps names from being treated as html
const element = (tag, text, class_name = "") =>
  Object.assign(document.createElement(tag), {
    textContent: text,
    className: class_name,
  });
const asset_base = new URL(
  "/backend/exercises/exercise-images/",
  document.baseURI,
);
const workout_list = $(".left-pane"),
  exercise_list = $("#exercise-list"),
  preview = $("#current-image");
let workouts = [],
  selected_workout = null,
  animation_timer,
  animation_version = 0;
let catalog = new Map();

async function fetch_json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const body = await response.text();
  // a bad path can return html even when the server reports a successful request
  if (body.trimStart().startsWith("<")) {
    throw new Error(
      `Expected JSON but received HTML from ${response.url || url}`,
    );
  }
  return JSON.parse(body);
}

function render_buttons(container, labels, class_name, select) {
  container.replaceChildren(
    ...labels.map((label, index) => {
      const button = element("button", label, class_name);
      button.type = "button";
      // leaving out select makes the same renderer produce placeholder buttons
      button.disabled = !select;
      button.onclick = select ? () => select(index) : null;
      return button;
    }),
  );
}

function activate(container, index) {
  [...container.children].forEach((button, i) =>
    button.classList.toggle("active", i === index),
  );
}

function exercise_label(id) {
  return (
    catalog.get(id)?.name ||
    id.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function reset_preview(
  title = "Preview unavailable",
  message = "Choose another exercise or workout.",
) {
  clearInterval(animation_timer);
  animation_timer = null;
  // invalidate images that are still loading for the previous selection
  animation_version++;
  const box = element("div", "", "media-placeholder");
  box.append(element("strong", title), element("p", message));
  preview.replaceChildren(box);
  return animation_version;
}

function empty_page(title, message) {
  selected_workout = null;
  $("#workout-name").textContent = title;
  $("#workout-info").textContent = message;
  $("#exercise-name").textContent = "Exercise preview";
  $("#exercise-info").textContent = "Choose a workout to see its exercises.";
  render_buttons(workout_list, ["No workouts"], "workout");
  render_buttons(exercise_list, ["No exercises"], "exercise");
  reset_preview(title, message);
}

function select_workout(index) {
  const workout = workouts[index];
  if (!workout) return;
  selected_workout = workout;
  activate(workout_list, index);
  const count = workout.exercises.length;
  $("#workout-name").textContent = workout.name;
  $("#workout-info").textContent = [
    workout.description,
    `${count} ${count === 1 ? "exercise" : "exercises"}`,
  ]
    .filter(Boolean)
    .join(" · ");
  render_buttons(
    exercise_list,
    workout.exercises.map((e) => exercise_label(e.exercise_id)),
    "exercise",
    select_exercise,
  );
  if (count) select_exercise(0);
  else {
    $("#exercise-name").textContent = "No exercises yet";
    $("#exercise-info").textContent = "This workout is empty.";
    render_buttons(exercise_list, ["No exercises"], "exercise");
    reset_preview("No exercise selected", "Add a movement to this workout.");
  }
}

function select_exercise(index) {
  const entry = selected_workout?.exercises[index];
  if (!entry) return;
  const exercise = catalog.get(entry.exercise_id);
  activate(exercise_list, index);
  $("#exercise-name").textContent = exercise_label(entry.exercise_id);
  // keep values like 0, but leave out missing or empty fields
  const details = Object.entries({
    Equipment: exercise?.equipmentLabel,
    "Main muscles": (exercise?.muscles?.primary || [])
      .join(", ")
      .replaceAll("_", " "),
    Difficulty: exercise?.level,
    Sets: entry.sets,
    Reps: entry.reps,
  })
    .filter(([, value]) => value != null && value !== "")
    .map(([label, value]) => `${label}: ${value}`);
  if (entry.notes) details.push(entry.notes);
  $("#exercise-info").textContent =
    details.join(" · ") || "Exercise details are unavailable.";
  animate_images(exercise);
}

function preload_image(exercise, frame) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    // load, error and timeout all need to clear the same timer and handlers
    const finish = (success) => {
      clearTimeout(timer);
      image.onload = image.onerror = null;
      success
        ? resolve(image)
        : reject(new Error("Image unavailable or timed out"));
    };
    const timer = setTimeout(() => finish(false), 12000);
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.alt = `${exercise.name}: ${frame} position`;
    image.src = new URL(exercise.images[frame], asset_base).href;
  });
}

async function animate_images(exercise) {
  const frames = (exercise?.frames || []).filter(
    (frame) => exercise.images?.[frame],
  );
  if (!frames.length) return reset_preview();
  const version = reset_preview(
    "Loading preview…",
    "Your exercise images will appear here.",
  );
  // preload to avoid flickering, and keep working frames if one fails
  const results = await Promise.allSettled(
    frames.map((frame) => preload_image(exercise, frame)),
  );
  // another exercise may have been selected while these images were loading
  if (version !== animation_version) return;
  const images = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  if (!images.length) return reset_preview();
  let index = 0;
  // % wraps back to the start and index++ advances after choosing
  const show = () => preview.replaceChildren(images[index++ % images.length]);
  show();
  if (images.length > 1) animation_timer = setInterval(show, 1000);
}

async function load_workouts() {
  // a failed image catalog should not discard the workout definitions
  const [routine_data, exercise_data] = await Promise.allSettled([
    fetch_json("/frontend/home/workouts.json"),
    fetch_json(new URL("exercises.json", asset_base)),
  ]);
  if (routine_data.status === "rejected") throw routine_data.reason;
  workouts = routine_data.value.workouts;
  if (!Array.isArray(workouts)) throw new Error("Expected a workouts array.");
  for (const workout of workouts) {
    if (
      !workout?.id ||
      !workout.name ||
      !Array.isArray(workout.exercises) ||
      workout.exercises.some((entry) => typeof entry?.exercise_id !== "string")
    ) {
      throw new Error(`Invalid workout: ${workout?.id || "missing id"}`);
    }
  }
  if (new Set(workouts.map((workout) => workout.id)).size !== workouts.length) {
    throw new Error("Duplicate workout IDs.");
  }
  if (
    exercise_data.status === "fulfilled" &&
    Array.isArray(exercise_data.value.exercises)
  ) {
    catalog = new Map(
      exercise_data.value.exercises.map((exercise) => [exercise.id, exercise]),
    );
  } else console.error("Exercise catalog unavailable:", exercise_data);
  render_buttons(
    workout_list,
    workouts.map((workout) => workout.name),
    "workout",
    select_workout,
  );
  if (workouts.length) select_workout(0);
  else empty_page("No workouts yet", "Your workouts will appear here.");
}

render_buttons(workout_list, ["Loading…"], "workout");
render_buttons(exercise_list, ["Loading…"], "exercise");
load_workouts().catch((error) => {
  console.error(error);
  empty_page("Workouts unavailable", "Refresh the page to try again.");
});
