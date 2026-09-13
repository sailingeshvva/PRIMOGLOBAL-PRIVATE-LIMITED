const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const form = document.querySelector("[data-enquiry-form]");
const startedAt = document.querySelector("[data-started-at]");
const statusNode = document.querySelector("[data-form-status]");

const emailRoutes = {
  general: "info@primeglobal.org.in",
  product: "sales@primeglobal.org.in",
  supplier: "sales@primeglobal.org.in",
  technical: "tech@primeglobal.org.in",
  career: "hr@primeglobal.org.in"
};

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

if (startedAt) {
  startedAt.value = Date.now().toString();
}

function fieldValue(data, key) {
  return (data.get(key) || "").toString().trim();
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const honeypot = fieldValue(data, "website");
  const elapsed = Date.now() - Number(fieldValue(data, "startedAt"));

  if (honeypot || elapsed < 2200) {
    statusNode.textContent = "Your enquiry could not be submitted. Please try again.";
    return;
  }

  const type = fieldValue(data, "type");
  const route = emailRoutes[type] || emailRoutes.general;
  const subject = encodeURIComponent(`Primoglobal enquiry - ${fieldValue(data, "company") || fieldValue(data, "name")}`);
  const lines = [
    `Enquiry type: ${type}`,
    `Name: ${fieldValue(data, "name")}`,
    `Company: ${fieldValue(data, "company")}`,
    `Country: ${fieldValue(data, "country")}`,
    `Business email: ${fieldValue(data, "email")}`,
    `Phone/WhatsApp: ${fieldValue(data, "phone")}`,
    `Product interested in: ${fieldValue(data, "product")}`,
    `Required quantity: ${fieldValue(data, "quantity")}`,
    `Expected purchase frequency: ${fieldValue(data, "frequency")}`,
    `Specification: ${fieldValue(data, "specification")}`,
    `Packaging requirement: ${fieldValue(data, "packaging")}`,
    `Destination port/country: ${fieldValue(data, "destination")}`,
    `Message: ${fieldValue(data, "message")}`
  ];

  const payload = Object.fromEntries(data.entries());
  statusNode.textContent = "Submitting your enquiry...";

  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      statusNode.innerHTML = `Thank you. Your enquiry has been routed to <strong>${result.route || route}</strong>. Primoglobal will review the requirement and respond professionally.`;
      form.reset();
      if (startedAt) startedAt.value = Date.now().toString();
      return;
    }
  } catch {
    // Local static previews do not run the serverless email endpoint.
  }

  statusNode.innerHTML = `Thank you. Your enquiry is prepared for <strong>${route}</strong>. Your email app will open so it can be sent from this preview environment.`;
  window.location.href = `mailto:${route}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
});
