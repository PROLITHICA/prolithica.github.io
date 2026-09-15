import { sendEnquiry } from "./enquiry.mjs";

// Keep decorative arrows consistent, including button labels updated later by
// the multi-step forms. The original text remains available to assistive tech.
const arrowCharacters = new Set(["→", "↗", "↑", "↓", "←"]);

function circleArrows(root = document) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, svg, code, pre, textarea, .arrow-circle")) {
        return NodeFilter.FILTER_REJECT;
      }
      return [...node.textContent].some((character) => arrowCharacters.has(character))
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/([→↗↑↓←])/)) {
      if (arrowCharacters.has(part)) {
        const badge = document.createElement("span");
        badge.className = "arrow-circle";
        badge.setAttribute("aria-hidden", "true");
        badge.textContent = part;
        fragment.append(badge);
      } else {
        fragment.append(document.createTextNode(part));
      }
    }
    node.replaceWith(fragment);
  }

  root.querySelectorAll?.("a svg").forEach((icon) => {
    if (icon.parentElement?.classList.contains("arrow-circle")) return;
    const badge = document.createElement("span");
    badge.className = "arrow-circle";
    badge.setAttribute("aria-hidden", "true");
    icon.parentNode.insertBefore(badge, icon);
    badge.append(icon);
  });
}

function installScrollMotion() {
  circleArrows();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const arrowObserver = new MutationObserver(() => circleArrows());
    arrowObserver.observe(document.body, { childList: true, subtree: true });
    return;
  }

  const installTargets = () => {
    document.querySelectorAll(".section, .folder-card, .site-footer").forEach((element) => {
      if (element.hasAttribute("data-scroll-fade")) return;
      element.setAttribute("data-scroll-fade", "");
      fadeObserver.observe(element);
    });
    document.querySelectorAll("h1, .section-heading h2").forEach(prepareTypewriter);
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-in-view", entry.isIntersecting);
    }
  }, { threshold: 0.08 });

  function prepareTypewriter(heading) {
    if (heading.hasAttribute("data-scroll-typewriter")) return;
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let index = 0;
    for (const textNode of textNodes) {
      const fragment = document.createDocumentFragment();
      for (const character of textNode.textContent) {
        if (/\s/.test(character)) {
          fragment.append(document.createTextNode(character));
          continue;
        }
        const span = document.createElement("span");
        span.className = "scroll-type-char";
        span.style.setProperty("--char-index", index++);
        span.textContent = character;
        fragment.append(span);
      }
      textNode.replaceWith(fragment);
    }
    heading.style.setProperty("--char-count", Math.max(index, 1));
    heading.setAttribute("data-scroll-typewriter", "");
  }

  const contentObserver = new MutationObserver((records) => {
    circleArrows();
    if (records.some((record) => record.addedNodes.length)) installTargets();
  });

  installTargets();
  contentObserver.observe(document.body, { childList: true, subtree: true });
}

installScrollMotion();
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
