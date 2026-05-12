const mainNav = document.getElementById("main-nav");
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const backToTop = document.getElementById("back-to-top");
const progressBar = document.getElementById("progress-bar");
const pageLoader = document.getElementById("page-loader");
const skillFills = document.querySelectorAll(".skill-fill");
const sections = Array.from(document.querySelectorAll("section[id]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("load", () => {
    if (pageLoader) {
        pageLoader.classList.add("hidden");
        setTimeout(() => {
            pageLoader.style.display = "none";
        }, 500);
    }
});

if (navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.contains("open");
        navMenu.classList.toggle("open", !isOpen);
        navToggle.classList.toggle("active", !isOpen);
        navToggle.setAttribute("aria-expanded", String(!isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
            navMenu.classList.remove("open");
            navToggle.classList.remove("active");
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;

        if (!target) return;

        event.preventDefault();
        const offset = mainNav.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });

        if (navMenu.classList.contains("open")) {
            navMenu.classList.remove("open");
            navToggle.classList.remove("active");
        }
    });
});

const updateScrollState = () => {
    const scrollTop = window.scrollY;

    mainNav.classList.toggle("scrolled", scrollTop > 50);
    backToTop.classList.toggle("visible", scrollTop > 520);

    let currentSectionId = "hero";
    sections.forEach((section) => {
        const top = section.offsetTop - mainNav.offsetHeight - 120;
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
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            if (entry.target.querySelector(".skill-fill")) {
                entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
                    const width = bar.dataset.width;
                    setTimeout(() => {
                        bar.style.width = `${width}%`;
                    }, 200);
                });
            }

            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    }
);

document.querySelectorAll(".reveal").forEach((target) => revealObserver.observe(target));

if (prefersReducedMotion.matches) {
    skillFills.forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
    });
}

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();