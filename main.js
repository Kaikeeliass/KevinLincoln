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
const btnOpen = document.getElementById('openMenu');
const btnClose = document.getElementById('closeMenu');
const menu = document.getElementById('navMenu');
const links = document.querySelectorAll('.nav-desk a');

// Abrir menu
btnOpen.addEventListener('click', () => {
    menu.classList.add('active');
});

// Fechar menu
btnClose.addEventListener('click', () => {
    menu.classList.remove('active');
});

// Fechar ao clicar em um link (para navegar até a seção)
links.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});

function toggleCard(card) {
    // Desktop: Clique alterna e fecha os outros
    if (window.innerWidth > 768) {
        const allCards = document.querySelectorAll('.card');
        
        if (card.classList.contains('is-flipped')) {
            card.classList.remove('is-flipped');
        } else {
            allCards.forEach(c => c.classList.remove('is-flipped'));
            card.classList.add('is-flipped');
        }
    }
}

// Mobile: Virar ao scroll automaticamente
const observer = new IntersectionObserver((entries) => {
    if (window.innerWidth <= 768) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-flipped');
            } else {
                entry.target.classList.remove('is-flipped');
            }
        });
    }
}, { threshold: 0.5 });

document.querySelectorAll('.card').forEach(card => observer.observe(card));

// Atualiza o ano do copyright automaticamente no footer
document.getElementById('ano-atual').textContent = new Date().getFullYear();

