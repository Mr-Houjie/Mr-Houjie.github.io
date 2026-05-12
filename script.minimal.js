const navbar = document.getElementById("navbar");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-links");
const backToTop = document.getElementById("back-to-top");
const progressBar = document.getElementById("scroll-progress");
const revealTargets = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-track span");
const sections = Array.from(document.querySelectorAll("section[id]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const closeMenu = () => {
    navMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        const willOpen = !navMenu.classList.contains("active");
        navMenu.classList.toggle("active", willOpen);
        menuToggle.setAttribute("aria-expanded", String(willOpen));
    });
}

document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
        closeMenu();
    });
});

const updateScrollState = () => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    navbar.classList.toggle("scrolled", scrollTop > 24);
    backToTop.classList.toggle("visible", scrollTop > 520);

    let currentSectionId = sections[0]?.id;

    sections.forEach((section) => {
        const top = section.offsetTop - navbar.offsetHeight - 80;
        const bottom = top + section.offsetHeight;

        if (scrollTop >= top && scrollTop < bottom) {
            currentSectionId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentSectionId}`;
        link.classList.toggle("active", isActive);
    });
};

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("active");

            if (entry.target.matches(".skill-panel")) {
                entry.target.querySelectorAll(".skill-track span").forEach((bar) => {
                    bar.style.width = `${bar.dataset.progress}%`;
                });
            }

            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px"
    }
);

revealTargets.forEach((target) => revealObserver.observe(target));

if (prefersReducedMotion.matches) {
    skillBars.forEach((bar) => {
        bar.style.width = `${bar.dataset.progress}%`;
    });
}

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();
