import { sendEnquiry } from "./enquiry.mjs";
const form = document.querySelector("#conversation-form");
const steps = [...document.querySelectorAll(".conversation-step")];
const back = document.querySelector("#application-back");
const next = document.querySelector("#application-next");
const error = document.querySelector("#application-error");
const progress = document.querySelector("#application-progress");
let current = 0,
  timer,
  busy = false;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
function typeQuestion() {
  clearTimeout(timer);
  const step = steps[current],
    span = step.querySelector(".typed-question"),
    text = step.dataset.question;
  span.classList.remove("finished");
  if (reduced.matches) {
    span.textContent = text;
    span.classList.add("finished");
    return;
  }
  span.textContent = "";
  let pos = 0;
  function tick() {
    span.textContent = text.slice(0, ++pos);
    if (pos < text.length) timer = setTimeout(tick, 24);
    else span.classList.add("finished");
  }
  tick();
}
reduced.addEventListener("change", typeQuestion);
function review() {
  const list = document.querySelector("#application-review");
  list.replaceChildren();
  for (const step of steps.slice(0, -1)) {
    const input = step.querySelector("input,textarea");
    const row = document.createElement("div"),
      dt = document.createElement("dt"),
      dd = document.createElement("dd");
    dt.textContent = step.dataset.question;
    dd.textContent = input.value.trim() || "Not provided";
    row.append(dt, dd);
    list.append(row);
  }
}
function show(focus = true) {
  steps.forEach((step, i) => {
    step.hidden = i !== current;
  });
  back.hidden = current === 0;
  next.textContent =
    current === steps.length - 1 ? "Send Application ↗" : "Continue →";
  document.querySelector("#step-count").textContent =
    current === steps.length - 1
      ? "Review your introduction"
      : `Question ${current + 1} of 6`;
  progress.value = current + 1;
  error.hidden = true;
  if (current === steps.length - 1) review();
  typeQuestion();
  if (focus) {
    const target =
      steps[current].querySelector("input,textarea") ||
      steps[current].querySelector("h2");
    if (target.tagName === "H2") target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
}
form.addEventListener("input", (e) => {
  if (e.target.matches("input,textarea")) {
    e.target.setCustomValidity("");
    e.target.removeAttribute("aria-invalid");
  }
});
back.addEventListener("click", () => {
  if (!busy && current > 0) {
    current--;
    show();
  }
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  if (current < steps.length - 1) {
    const field = steps[current].querySelector("input,textarea");
    field.setCustomValidity(
      field.required && !field.value.trim()
        ? "Please add your answer to continue."
        : "",
    );
    if (!field.reportValidity()) {
      field.setAttribute("aria-invalid", "true");
      return;
    }
    current++;
    show();
    return;
  }
  busy = true;
  next.disabled = true;
  back.disabled = true;
  next.textContent = "Sending…";
  form.setAttribute("aria-busy", "true");
  error.hidden = true;
  try {
    await sendEnquiry(new FormData(form));
    clearTimeout(timer);
    form.hidden = true;
    document.querySelector(".conversation-progress").hidden = true;
    progress.hidden = true;
    const success = document.querySelector("#application-success");
    success.hidden = false;
    success.focus();
    form.reset();
  } catch {
    error.textContent =
      "We couldn’t confirm your application was sent. Your answers are still here. Try again, or email info@prolithica.com. A timed-out request may already have reached the service.";
    error.hidden = false;
  } finally {
    busy = false;
    next.disabled = false;
    back.disabled = false;
    next.textContent = "Send Application ↗";
    form.removeAttribute("aria-busy");
  }
});
show(false);
