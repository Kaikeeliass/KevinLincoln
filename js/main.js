document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initScrollAnimations();
    initFaqAccordion();
    initMobileMenu();
    initFlipCards();
    initCarousel();
    initLazyVideos();
    document.getElementById('ano-atual').textContent = new Date().getFullYear();
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

            document.querySelectorAll(".faq-item").forEach(i =>
                i.classList.remove("active")
            );

            if (!isActive) item.classList.add("active");
        });
    });
}

/* =========================
   MENU MOBILE
========================= */
function initMobileMenu() {
    const btnOpen = document.getElementById('openMenu');
    const btnClose = document.getElementById('closeMenu');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-desk a');

    if (!btnOpen || !btnClose || !menu) return;

    btnOpen.addEventListener('click', () => menu.classList.add('active'));
    btnClose.addEventListener('click', () => menu.classList.remove('active'));
    links.forEach(link => link.addEventListener('click', () => menu.classList.remove('active')));
}

/* =========================
   FLIP CARDS
========================= */
function initFlipCards() {
    // Desktop: clique alterna
    window.toggleCard = function (card) {
        if (window.innerWidth > 768) {
            const allCards = document.querySelectorAll('.card');
            if (card.classList.contains('is-flipped')) {
                card.classList.remove('is-flipped');
            } else {
                allCards.forEach(c => c.classList.remove('is-flipped'));
                card.classList.add('is-flipped');
            }
        }
    };

    // Mobile: vira ao entrar na viewport
    const flipObserver = new IntersectionObserver((entries) => {
        if (window.innerWidth <= 768) {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-flipped', entry.isIntersecting);
            });
        }
    }, { threshold: 0.5 });

    document.querySelectorAll('.card').forEach(card => flipObserver.observe(card));
}

/* =========================
   CARROSSEL DE DEPOIMENTOS
========================= */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    const btnPrev = document.getElementById('carouselPrev');
    const btnNext = document.getElementById('carouselNext');

    if (!track || !dotsWrap || !btnPrev || !btnNext) return;

    const slides = Array.from(track.querySelectorAll('.tc-slide'));
    if (!slides.length) return;

    let current = 0;
    let autoTimer = null;

    /* quantos slides ficam visíveis por vez */
    function getVisible() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    /* índice máximo que current pode ter */
    function maxIndex() {
        return Math.max(0, slides.length - getVisible());
    }

    /* largura de um slide + margin lateral (10px de cada lado = 20px) */
    function slideWidth() {
        return slides[0].offsetWidth + 20;
    }

    /* marca quais slides estão "ativos" (visíveis) */
    function updateActiveSlides() {
        const vis = getVisible();
        slides.forEach((slide, i) => {
            const isActive = i >= current && i < current + vis;
            slide.classList.toggle('tc-active', isActive);

            /* se o card de depoimento está dentro do slide */
            const card = slide.querySelector('.testimonial-card');
            if (card) card.classList.toggle('tc-active', isActive);
        });
    }

    /* atualiza os dots */
    function buildDots() {
        dotsWrap.innerHTML = '';
        const total = maxIndex() + 1;

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === current ? ' on' : '');
            dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        }
    }

    /* atualiza estado dos botões prev/next */
    function updateButtons() {
        btnPrev.disabled = current === 0;
        btnNext.disabled = current >= maxIndex();
    }

    /* vai para o índice indicado */
    function goTo(index) {
        current = Math.max(0, Math.min(index, maxIndex()));

        track.style.transform = `translateX(${-current * slideWidth()}px)`;

        updateActiveSlides();
        updateButtons();

        /* atualiza dots */
        dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('on', i === current);
        });
    }

    /* autoplay */
    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
            goTo(current >= maxIndex() ? 0 : current + 1);
        }, 4500);
    }

    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    /* eventos dos botões */
    btnPrev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    btnNext.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    /* pausa o autoplay ao passar o mouse */
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    /* swipe touch para mobile */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
        stopAuto();
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            goTo(diff > 0 ? current + 1 : current - 1);
        }
        startAuto();
    }, { passive: true });

    /* recalcula ao redimensionar */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            /* garante que current não ultrapasse o novo maxIndex */
            current = Math.min(current, maxIndex());
            buildDots();
            goTo(current);
        }, 150);
    });

    /* inicializa */
    buildDots();
    goTo(0);
    startAuto();
}

/* =========================
   LAZY VIDEOS
========================= */
function initLazyVideos() {
    const lazyVideos = document.querySelectorAll('video[data-src]');
    if (!lazyVideos.length) return;

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.querySelectorAll('source[data-src]').forEach(source => {
                    source.src = source.dataset.src;
                });
                video.src = video.dataset.src;
                video.load();
                video.play();
                videoObserver.unobserve(video);
            }
        });
    }, { rootMargin: '200px' });

    lazyVideos.forEach(v => videoObserver.observe(v));
}