// Highlight the current section in the nav as you scroll.
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");

const setActive = () => {
  let current = "";
  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.style.color = link.getAttribute("href") === `#${current}` ? "var(--text)" : "";
  });
};

window.addEventListener("scroll", setActive, { passive: true });
setActive();
