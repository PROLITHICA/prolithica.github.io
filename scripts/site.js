import { sendEnquiry } from "./enquiry.mjs";
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#mobile-menu");
function closeMenu(returnFocus = false) {
  menu.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  if (returnFocus) toggle.focus();
}
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  });
  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    closeMenu();
    if (link.hash && link.pathname === location.pathname) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) closeMenu(true);
  });
  matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}
const form = document.querySelector("#enquiry-form");
if (form) {
  const status = document.querySelector("#form-status");
  const button = form.querySelector('button[type="submit"]');
  const originalButton = button.innerHTML;
  const controls = [
    ...form.querySelectorAll(
      "input[required],textarea[required],select[required]",
    ),
  ];
  function validate(control) {
    control.setCustomValidity(
      control.value.trim() ? "" : "Please complete this field.",
    );
  }
  controls.forEach((control) =>
    control.addEventListener("input", () => validate(control)),
  );
  document.querySelectorAll("[data-interest]").forEach((link) =>
    link.addEventListener("click", () => {
      form.elements.interest.value = link.dataset.interest;
      form.elements.interest.setCustomValidity("");
    }),
  );
  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    controls.forEach(validate);
    if (!form.reportValidity()) return;
    if (form.elements._honey.value) return;
    button.disabled = true;
    button.textContent = "Sending enquiry…";
    form.setAttribute("aria-busy", "true");
    showStatus("Sending your enquiry. Please keep this page open.", "pending");
    try {
      await sendEnquiry(new FormData(form));
      form.reset();
      showStatus(
        "Your enquiry has been accepted by our form service. Thank you for getting in touch. If you need to follow up, email info@prolithica.com.",
        "success",
      );
    } catch {
      showStatus(
        "We couldn’t confirm your enquiry was sent. Your entries are still here. Please try again, or email info@prolithica.com. If the request timed out, it may already have reached the service.",
        "error",
      );
    } finally {
      button.disabled = false;
      button.innerHTML = originalButton;
      form.removeAttribute("aria-busy");
      status.focus({ preventScroll: true });
    }
  });
}
