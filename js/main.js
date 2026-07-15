document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initReadProgress();
    initScrollAnimations();
    initFaqAccordion();
    initMobileMenu();
    initFlipCards();
    initCarousel();
    initLazyVideos();
    initHeroParticles();
    initCountUp();
    initActiveNavLinks();
    initFloatingWA();
    document.getElementById('ano-atual').textContent = new Date().getFullYear();
});

/* =========================
   HEADER SCROLL + GLASSMORPHISM
========================= */
function initHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 60);
    });
}

/* =========================
   BARRA DE PROGRESSO DE LEITURA
========================= */
function initReadProgress() {
    const bar = document.getElementById("read-progress");
    if (!bar) return;

    window.addEventListener("scroll", () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const pct = docH > 0 ? (scrolled / docH) * 100 : 0;
        bar.style.width = pct + "%";
    }, { passive: true });
}

/* =========================
   ACTIVE NAV LINKS (SCROLL SPY)
========================= */
function initActiveNavLinks() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-desk a[data-section]");
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle("nav-active", link.dataset.section === id);
                });
            }
        });
    }, { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" });

    sections.forEach(section => observer.observe(section));
}

/* =========================
   SCROLL ANIMATIONS (fade-up / fade-in)
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
        { threshold: 0.15 }
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

    function getVisible() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function maxIndex() {
        return Math.max(0, slides.length - getVisible());
    }

    function slideWidth() {
        return slides[0].offsetWidth + 20;
    }

    function updateActiveSlides() {
        const vis = getVisible();
        slides.forEach((slide, i) => {
            const isActive = i >= current && i < current + vis;
            slide.classList.toggle('tc-active', isActive);
            const card = slide.querySelector('.testimonial-card');
            if (card) card.classList.toggle('tc-active', isActive);
        });
    }

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

    function updateButtons() {
        btnPrev.disabled = current === 0;
        btnNext.disabled = current >= maxIndex();
    }

    function goTo(index) {
        current = Math.max(0, Math.min(index, maxIndex()));
        track.style.transform = `translateX(${-current * slideWidth()}px)`;
        updateActiveSlides();
        updateButtons();
        dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('on', i === current);
        });
    }

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

    btnPrev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    btnNext.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

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

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            current = Math.min(current, maxIndex());
            buildDots();
            goTo(current);
        }, 150);
    });

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

/* =========================
   HERO PARTICLES (CANVAS)
========================= */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 14000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.4,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                alpha: Math.random() * 0.5 + 0.1,
                // alternating primary / secondary colors
                color: Math.random() > 0.6
                    ? `rgba(214, 90, 90,`
                    : `rgba(14, 181, 92,`
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 110;

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(214, 90, 90, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${p.alpha})`;
            ctx.fill();

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animId);
            resize();
            createParticles();
            drawParticles();
        }, 200);
    });
}

/* =========================
   COUNT-UP ANIMATION
========================= */
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const startTime = performance.now();
            const startVal = 0;

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing: ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(startVal + (target - startVal) * eased);
                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + suffix;
                }
            }

            requestAnimationFrame(update);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

/* =========================
   FLOATING WA — mostrar após scroll
========================= */
function initFloatingWA() {
    const btn = document.getElementById('floatingWa');
    if (!btn) return;

    // Esconde inicialmente
    btn.style.opacity = '0';
    btn.style.transform = 'scale(0.8) translateY(20px)';
    btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1) translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0.8) translateY(20px)';
        }
    }, { passive: true });
}