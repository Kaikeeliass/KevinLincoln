document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initScrollAnimations();
    initFaqAccordion();
});

/* =========================
   HEADER SCROLL
========================= */
function initHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    });
}

/* =========================
   SCROLL ANIMATIONS
========================= */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        ".js-scroll-fade-up, .js-scroll-fade-in"
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
}

/* =========================
   FAQ ACCORDION
========================= */
function initFaqAccordion() {
    const headers = document.querySelectorAll(".faq-header");
    if (!headers.length) return;

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isActive = item.classList.contains("active");

            // Fecha todos
            document.querySelectorAll(".faq-item").forEach(i =>
                i.classList.remove("active")
            );

            // Abre somente se não estava ativo
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}
