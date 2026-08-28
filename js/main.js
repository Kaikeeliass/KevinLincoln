/**
 * KEVIN LINCOLN — NUTRICIONISTA
 * JavaScript Principal e Modular Multipáginas
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initReadProgress();
  initScrollAnimations();
  initCountUp();
  initFaqAccordion();
  initTestimonialFilter();
  initFormAndModal();
  initFloatingWA();
  initCurrentYear();
  checkUrlParamsForService();
  initAtlasStartExperience();
});

/* ==========================================================================
   01. HEADER & NAVEGAÇÃO ATIVA
   ========================================================================== */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Destaca link ativo baseado no caminho atual
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link, .dropdown-link, .mobile-sublink");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("/").pop().split("#")[0];

    if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ==========================================================================
   02. MENU MOBILE (DRAWER)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("mobileDrawerClose");
  const overlay = document.getElementById("mobileDrawerOverlay");
  const drawer = document.getElementById("mobileDrawer");

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("active")) {
      closeMenu();
    }
  });

  // Fecha drawer ao clicar em qualquer link
  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

/* ==========================================================================
   03. BARRA DE PROGRESSO DE LEITURA
   ========================================================================== */
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

/* ==========================================================================
   04. ANIMAÇÕES DE ENTRADA (SCROLL REVEAL)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".js-fade-up");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   05. CONTADORES / ESTATÍSTICAS
   ========================================================================== */
function initCountUp() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * ease) + suffix;
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => observer.observe(el));
}

/* ==========================================================================
   06. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const triggers = document.querySelectorAll(".faq-trigger");
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".faq-card");
      const content = card.querySelector(".faq-content");
      const isActive = card.classList.contains("active");

      // Fecha todos os outros do mesmo container
      const parentContainer = card.parentElement;
      parentContainer.querySelectorAll(".faq-card").forEach(c => {
        c.classList.remove("active");
        const cContent = c.querySelector(".faq-content");
        if (cContent) cContent.style.maxHeight = null;
      });

      if (!isActive) {
        card.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   07. FILTRO DE DEPOIMENTOS (RESULTADOS)
   ========================================================================== */
function initTestimonialFilter() {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".testimonial-card-pro[data-category]");
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.filter;

      cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   08. MÁSCARA TELEFÔNICA E BLOQUEIO DE DÍGITOS
   ========================================================================== */
function mascaraTelefone(input) {
  if (!input) return;

  input.addEventListener("input", function () {
    let digits = this.value.replace(/\D/g, "").slice(0, 11);
    let formatted = "";

    if (digits.length === 0) {
      formatted = "";
    } else if (digits.length <= 2) {
      formatted = "(" + digits;
    } else if (digits.length <= 6) {
      formatted = "(" + digits.slice(0, 2) + ") " + digits.slice(2);
    } else if (digits.length <= 10) {
      formatted = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 6) + "-" + digits.slice(6);
    } else {
      formatted = "(" + digits.slice(0, 2) + ") " + digits.slice(2, 7) + "-" + digits.slice(7);
    }

    this.value = formatted;
  });

  input.addEventListener("keydown", function (e) {
    const allowed = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });
}

function bloquearNumerosNome(input) {
  if (!input) return;
  input.addEventListener("keydown", function (e) {
    if (/^\d$/.test(e.key)) e.preventDefault();
  });
  input.addEventListener("input", function () {
    const pos = this.selectionStart;
    const newVal = this.value.replace(/\d/g, "");
    if (this.value !== newVal) {
      this.value = newVal;
      this.setSelectionRange(pos - 1, pos - 1);
    }
  });
}

/* ==========================================================================
   09. MODAL GLOBAL & ENVIO DE FORMULÁRIO (EmailJS)
   ========================================================================== */
function initFormAndModal() {
  // Inicializa máscaras em inputs presentes
  document.querySelectorAll("input[type='tel'], #f-whats, #m-whats").forEach(mascaraTelefone);
  document.querySelectorAll("#f-nome, #m-nome").forEach(bloquearNumerosNome);

  // Inicializa EmailJS se o SDK estiver carregado
  if (typeof emailjs !== "undefined") {
    emailjs.init("uikqMZyeHWmzNWxR6");
  }
}

// Abre o modal de avaliação e pré-seleciona serviço se informado
window.abrirFormulario = function (servico = "") {
  const modal = document.getElementById("modal-overlay");
  if (!modal) {
    window.location.href = "contato.html" + (servico ? `?servico=${encodeURIComponent(servico)}` : "");
    return;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  if (servico) {
    preencherServicoFormulario(servico, "m-");
  }
};

window.fecharFormulario = function () {
  const modal = document.getElementById("modal-overlay");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

window.fecharSeClicarFora = function (e) {
  if (e.target.id === "modal-overlay") {
    fecharFormulario();
  }
  if (e.target.id === "modal-relato-overlay") {
    fecharRelatoCompleto();
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    fecharFormulario();
    fecharRelatoCompleto();
  }
});

// Pré-seleciona opção de serviço nos formulários
function preencherServicoFormulario(servico, prefix = "") {
  const cleanServico = servico.toLowerCase().trim();
  let targetRadioId = "";
  
  if (cleanServico.includes("start") || cleanServico.includes("24") || cleanServico.includes("projeto")) {
    targetRadioId = prefix + "servico-start";
  } else if (cleanServico.includes("trimestral")) {
    targetRadioId = prefix + "servico-trimestral";
  } else if (cleanServico.includes("semestral")) {
    targetRadioId = prefix + "servico-semestral";
  } else if (cleanServico.includes("anual") || cleanServico.includes("jornada")) {
    targetRadioId = prefix + "servico-anual";
  } else if (cleanServico.includes("atlas") || cleanServico.includes("acompanhamento")) {
    targetRadioId = prefix + "servico-trimestral"; // Sugestão padrão
  }

  if (targetRadioId) {
    const radio = document.getElementById(targetRadioId);
    if (radio) radio.checked = true;
  }
}

// Verifica parâmetros na URL ao carregar páginas
function checkUrlParamsForService() {
  const params = new URLSearchParams(window.location.search);
  const servicoParam = params.get("servico") || params.get("plano");
  if (servicoParam) {
    preencherServicoFormulario(servicoParam, "f-");
    preencherServicoFormulario(servicoParam, "m-");
  }
}

// Validação e Envio
window.validarEEnviarFormulario = async function (formType = "page") {
  const prefix = formType === "modal" ? "m-" : "f-";
  const btnId = formType === "modal" ? "m-btn-enviar" : "f-btn-enviar";
  const formBoxId = formType === "modal" ? "modal-form-content" : "page-form-content";
  const successBoxId = formType === "modal" ? "modal-form-sucesso" : "page-form-sucesso";

  const nomeEl = document.getElementById(prefix + "nome");
  const idadeEl = document.getElementById(prefix + "idade");
  const emailEl = document.getElementById(prefix + "email");
  const whatsEl = document.getElementById(prefix + "whats");
  const pesoEl = document.getElementById(prefix + "peso");
  const alturaEl = document.getElementById(prefix + "altura");

  // Limpa erros
  document.querySelectorAll(".form-error").forEach(el => el.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

  let valido = true;

  function setErro(el, msg) {
    if (!el) return;
    el.classList.add("input-error");
    const err = document.createElement("span");
    err.className = "form-error";
    err.textContent = msg;
    el.parentNode.appendChild(err);
    valido = false;
  }

  const nome = (nomeEl?.value || "").trim();
  if (nome.length < 3 || !nome.includes(" ")) {
    setErro(nomeEl, "Informe seu nome e sobrenome.");
  }

  const idade = parseInt(idadeEl?.value || "0", 10);
  if (isNaN(idade) || idade < 12 || idade > 99) {
    setErro(idadeEl, "Informe uma idade válida (12 a 99).");
  }

  const email = (emailEl?.value || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setErro(emailEl, "Informe um e-mail válido.");
  }

  const whats = (whatsEl?.value || "").trim();
  const digitsWhats = whats.replace(/\D/g, "");
  if (digitsWhats.length < 10 || digitsWhats.length > 11) {
    setErro(whatsEl, "Informe seu WhatsApp completo: (XX) 9XXXX-XXXX.");
  }

  const peso = parseFloat(pesoEl?.value || "0");
  if (isNaN(peso) || peso < 30 || peso > 280) {
    setErro(pesoEl, "Informe um peso válido em kg.");
  }

  const altura = parseInt(alturaEl?.value || "0", 10);
  if (isNaN(altura) || altura < 110 || altura > 240) {
    setErro(alturaEl, "Informe sua altura em cm.");
  }

  function getRadioChecked(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.nextElementSibling.textContent.trim() : "";
  }

  const objetivo = getRadioChecked(prefix + "obj") || "Emagrecimento";
  const servico = getRadioChecked(prefix + "servico") || "A definir na avaliação";
  const treino = getRadioChecked(prefix + "treino") || "Não informado";
  const alimentacao = getRadioChecked(prefix + "alim") || "Não informado";
  const restricoes = (document.getElementById(prefix + "restr")?.value || "").trim() || "Nenhuma";
  const mensagem = (document.getElementById(prefix + "msg")?.value || "").trim() || "Sem observações adicionais";

  if (!valido) {
    const firstError = document.querySelector(".input-error");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const btn = document.getElementById(btnId);
  if (btn) {
    btn.disabled = true;
    btn.textContent = "ENVIANDO DADOS...";
  }

  const params = {
    nome: nome,
    idade: idade,
    email_paciente: email,
    whats: whats,
    peso: peso,
    altura: altura,
    objetivo: objetivo,
    servico_desejado: servico,
    treino: treino,
    alimentacao: alimentacao,
    restricoes: restricoes,
    mensagem: mensagem
  };

  try {
    if (typeof emailjs !== "undefined") {
      await emailjs.send("service_6w1t7v2", "template_doox4c8", params);
    }
    
    // Atualiza interface para Sucesso
    const formBox = document.getElementById(formBoxId);
    const successBox = document.getElementById(successBoxId);
    if (formBox) formBox.style.display = "none";
    if (successBox) successBox.classList.add("active");

    // Prepara botão de WhatsApp de confirmação direta
    const btnWaSucesso = successBox?.querySelector(".btn-wa-confirmar");
    if (btnWaSucesso) {
      const msgEncoded = encodeURIComponent(
        `Olá Kevin! Acabei de enviar meu formulário de avaliação pelo site.\n\n` +
        `*Nome:* ${nome}\n` +
        `*Objetivo:* ${objetivo}\n` +
        `*Acompanhamento:* ${servico}\n\n` +
        `Gostaria de confirmar o recebimento e saber os próximos passos!`
      );
      btnWaSucesso.setAttribute("href", `https://wa.me/5517981114500?text=${msgEncoded}`);
    }
  } catch (err) {
    console.error("Erro no envio:", err);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ENVIAR AVALIAÇÃO →";
    }
    alert("Ocorreu um erro temporário ao enviar. Você também pode falar diretamente no WhatsApp (17) 98111-4500.");
  }
};

/* ==========================================================================
   10. FLOATING WHATSAPP BUTTON (SHOW ON SCROLL)
   ========================================================================== */
function initFloatingWA() {
  const floatWa = document.getElementById("floatingWa");
  if (!floatWa) return;

  floatWa.style.opacity = "0";
  floatWa.style.transform = "scale(0.8) translateY(20px)";
  floatWa.style.transition = "opacity 0.35s ease, transform 0.35s ease";

  window.addEventListener("scroll", () => {
    const show = window.scrollY > 280;
    floatWa.style.opacity = show ? "1" : "0";
    floatWa.style.transform = show ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)";
    floatWa.style.pointerEvents = show ? "auto" : "none";
  }, { passive: true });
}

/* ==========================================================================
   11. ANO ATUAL NO FOOTER
   ========================================================================== */
function initCurrentYear() {
  const el = document.getElementById("ano-atual");
  if (el) el.textContent = new Date().getFullYear();
}

/* ==========================================================================
   12. ATLAS START — EXPERIÊNCIA DE AUTOIDENTIFICAÇÃO & STICKY CTA
   ========================================================================== */
function initAtlasStartExperience() {
  // 1. Interação "Em qual momento você está?"
  const momentCards = document.querySelectorAll(".moment-card");
  const feedbackText = document.getElementById("momentFeedbackText");

  const momentTexts = {
    "1": "O Start organiza suas prioridades e entrega um plano alimentar inicial sob medida para quebrar a inércia e começar com clareza imediata, sem adivinhações.",
    "2": "Dietas extremas geram desistência rápida. O Start adapta a alimentação à sua rotina real, facilitando a consistência e a adesão desde a primeira semana.",
    "3": "Uma estrutura calculada de refeições, metas calóricas e distribuição de nutrientes para você ter previsibilidade, energia e praticidade no seu dia a dia.",
    "4": "Você recebe orientações práticas e substituições inteligentes adaptadas aos seus horários de trabalho, treinos e compromissos reais."
  };

  if (momentCards.length > 0 && feedbackText) {
    momentCards.forEach(card => {
      card.addEventListener("click", () => {
        const momentId = card.getAttribute("data-moment");
        
        momentCards.forEach(c => {
          c.classList.remove("active");
          c.setAttribute("aria-checked", "false");
        });

        card.classList.add("active");
        card.setAttribute("aria-checked", "true");

        if (momentTexts[momentId]) {
          feedbackText.style.opacity = "0";
          feedbackText.style.transition = "opacity 0.2s ease";
          setTimeout(() => {
            feedbackText.textContent = momentTexts[momentId];
            feedbackText.style.opacity = "1";
          }, 150);
        }
      });

      // Acessibilidade via Teclado (Enter / Space)
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // 2. Mobile Sticky CTA Bar
  const stickyCta = document.getElementById("mobileStickyCta");
  const heroSection = document.querySelector(".hero-start") || document.querySelector(".hero-atlas") || document.querySelector(".hero-main");
  const finalCtaSection = document.getElementById("cta-final");
  const plansSection = document.getElementById("planos");

  if (stickyCta && heroSection) {
    window.addEventListener("scroll", () => {
      if (window.innerWidth > 768) {
        stickyCta.classList.remove("active");
        return;
      }

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const finalCtaTop = finalCtaSection ? finalCtaSection.offsetTop - 80 : document.documentElement.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;

      // Check if plans section is currently in view (on pages with #planos)
      let isPlansInView = false;
      if (plansSection) {
        const plansTop = plansSection.offsetTop;
        const plansBottom = plansTop + plansSection.offsetHeight;
        if (window.scrollY + window.innerHeight > plansTop + 50 && window.scrollY < plansBottom - 50) {
          isPlansInView = true;
        }
      }

      if (window.scrollY > heroBottom - 60 && currentScroll < finalCtaTop && !isPlansInView) {
        stickyCta.classList.add("active");
      } else {
        stickyCta.classList.remove("active");
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   CARROSSEL EDITORIAL DA TRAJETÓRIA DO KEVIN (RESULTADOS)
   ========================================================================== */
function initTrajectoryCarousel() {
  const slides = document.querySelectorAll(".trajectory-slide");
  const dots = document.querySelectorAll(".trajectory-dot-btn");
  const prevBtn = document.getElementById("trajectoryPrev");
  const nextBtn = document.getElementById("trajectoryNext");
  const carouselWrap = document.querySelector(".trajectory-editorial-wrap");

  if (!slides.length) return;

  let currentSlide = 0;
  let autoplayTimer = null;

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;

    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentSlide);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentSlide);
      dot.setAttribute("aria-selected", idx === currentSlide ? "true" : "false");
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showSlide(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 7000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Touch Swipe para dispositivos móveis
  let touchStartX = 0;
  let touchEndX = 0;

  if (carouselWrap) {
    carouselWrap.addEventListener("mouseenter", stopAutoplay);
    carouselWrap.addEventListener("mouseleave", startAutoplay);
    carouselWrap.addEventListener("focusin", stopAutoplay);
    carouselWrap.addEventListener("focusout", startAutoplay);

    carouselWrap.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carouselWrap.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 45) {
        nextSlide();
      } else if (touchEndX > touchStartX + 45) {
        prevSlide();
      }
      resetAutoplay();
    }, { passive: true });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!carouselWrap) return;
    const rect = carouselWrap.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === "ArrowRight") { nextSlide(); resetAutoplay(); }
      if (e.key === "ArrowLeft") { prevSlide(); resetAutoplay(); }
    }
  });

  startAutoplay();
}

/* ==========================================================================
   MODAL DE RELATO COMPLETO (RESULTADOS)
   ========================================================================== */
function abrirRelatoCompleto(nome, categoria, texto, avatar) {
  const modal = document.getElementById("modal-relato-overlay");
  if (!modal) return;

  const modalNome = document.getElementById("relatoModalNome");
  const modalCat = document.getElementById("relatoModalCat");
  const modalTexto = document.getElementById("relatoModalTexto");
  const modalAvatar = document.getElementById("relatoModalAvatar");

  if (modalNome) modalNome.textContent = nome;
  if (modalCat) modalCat.textContent = categoria;
  if (modalTexto) modalTexto.textContent = `"${texto}"`;
  if (modalAvatar) modalAvatar.textContent = avatar;

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function fecharRelatoCompleto() {
  const modal = document.getElementById("modal-relato-overlay");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

/* ==========================================================================
   SISTEMA DE DÚVIDAS / FAQ — BUSCA, FILTROS, ACCORDION & DEEP LINKING
   ========================================================================== */
function initFaqSystem() {
  const searchInput = document.getElementById("faqSearchInput");
  const clearBtn = document.getElementById("faqSearchClear");
  const searchCounter = document.getElementById("faqSearchCounter");
  const filterChips = document.querySelectorAll(".faq-chip-btn");
  const faqItems = document.querySelectorAll(".faq-item-box");
  const emptyState = document.getElementById("faqEmptyState");
  const categoryGroups = document.querySelectorAll(".faq-category-group");

  if (!faqItems.length) return;

  let currentCategory = "todos";
  let currentSearchQuery = "";
  let searchDebounceTimer = null;

  // Armazena textos originais das perguntas para restauração de destaque
  faqItems.forEach(item => {
    const questionTextEl = item.querySelector(".faq-question-text");
    if (questionTextEl) {
      item.dataset.originalText = questionTextEl.textContent.trim();
    }
  });

  // 1. Accordion Toggle
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question-btn");
    const copyBtn = item.querySelector(".faq-copy-btn");

    if (btn) {
      btn.addEventListener("click", (e) => {
        // Ignora se o clique for no botão de copiar
        if (e.target.closest(".faq-copy-btn")) return;

        const isCurrentlyActive = item.classList.contains("active");

        // Fecha outros itens dentro do mesmo grupo ou visualização atual
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherBtn = otherItem.querySelector(".faq-question-btn");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });

        // Alterna o item clicado
        if (isCurrentlyActive) {
          item.classList.remove("active");
          btn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const itemId = item.id;
        if (itemId) {
          copiarLinkDuvida(itemId);
        }
      });
    }
  });

  // 2. Filtro de Categorias
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentCategory = chip.dataset.category || "todos";
      aplicarFiltrosEBusca();
    });
  });

  // 3. Busca em Tempo Real com Debounce
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentSearchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) {
          clearBtn.classList.toggle("visible", currentSearchQuery.length > 0);
        }
        aplicarFiltrosEBusca();
      }, 120);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentSearchQuery = "";
        clearBtn.classList.remove("visible");
        searchInput.focus();
        aplicarFiltrosEBusca();
      });
    }

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        currentSearchQuery = "";
        if (clearBtn) clearBtn.classList.remove("visible");
        aplicarFiltrosEBusca();
      }
    });
  }

  // 4. Função Principal de Filtragem e Busca
  function aplicarFiltrosEBusca() {
    let totalVisiveis = 0;

    faqItems.forEach(item => {
      const itemCat = item.dataset.category || "";
      const originalText = item.dataset.originalText || "";
      const answerEl = item.querySelector(".faq-answer-inner");
      const answerText = answerEl ? answerEl.textContent.toLowerCase() : "";
      const questionTextEl = item.querySelector(".faq-question-text");

      const matchCategory = (currentCategory === "todos" || itemCat === currentCategory);
      let matchQuery = true;

      if (currentSearchQuery.length > 0) {
        const queryInQuestion = originalText.toLowerCase().includes(currentSearchQuery);
        const queryInAnswer = answerText.includes(currentSearchQuery);
        matchQuery = queryInQuestion || queryInAnswer;

        // Destaque sutil no título se houver correspondência
        if (questionTextEl && queryInQuestion) {
          const regex = new RegExp(`(${escapeRegExp(currentSearchQuery)})`, "gi");
          questionTextEl.innerHTML = originalText.replace(regex, `<span class="faq-term-highlight">$1</span>`);
        } else if (questionTextEl) {
          questionTextEl.textContent = originalText;
        }
      } else {
        if (questionTextEl) {
          questionTextEl.textContent = originalText;
        }
      }

      if (matchCategory && matchQuery) {
        item.style.display = "block";
        totalVisiveis++;
      } else {
        item.style.display = "none";
      }
    });

    // Oculta títulos de categorias que não têm perguntas visíveis
    categoryGroups.forEach(group => {
      const visibleItemsInGroup = group.querySelectorAll(".faq-item-box:not([style*='display: none'])");
      group.style.display = visibleItemsInGroup.length > 0 ? "block" : "none";
    });

    // Contador e estado vazio
    if (emptyState) {
      emptyState.classList.toggle("active", totalVisiveis === 0);
    }

    if (searchCounter) {
      if (currentSearchQuery.length > 0) {
        searchCounter.textContent = totalVisiveis === 1 ? "1 resposta encontrada" : `${totalVisiveis} respostas encontradas`;
      } else {
        searchCounter.textContent = "";
      }
    }
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 5. Deep Linking no Carregamento
  function checkHashAndOpen() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const targetId = hash.substring(1);
      const targetItem = document.getElementById(targetId);
      if (targetItem && targetItem.classList.contains("faq-item-box")) {
        // Ativa a categoria do item se necessário
        const itemCat = targetItem.dataset.category;
        if (itemCat) {
          filterChips.forEach(chip => {
            if (chip.dataset.category === itemCat || chip.dataset.category === "todos") {
              chip.classList.toggle("active", chip.dataset.category === "todos");
            }
          });
          currentCategory = "todos";
          aplicarFiltrosEBusca();
        }

        // Abre o item e rola suavemente
        targetItem.classList.add("active");
        const btn = targetItem.querySelector(".faq-question-btn");
        if (btn) btn.setAttribute("aria-expanded", "true");

        targetItem.classList.add("highlight-target");
        setTimeout(() => {
          targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);

        setTimeout(() => {
          targetItem.classList.remove("highlight-target");
        }, 2200);
      }
    }
  }

  window.addEventListener("hashchange", checkHashAndOpen);
  checkHashAndOpen();
}

// Copiar Link da Dúvida
function copiarLinkDuvida(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      mostrarFaqToast("Link da pergunta copiado!");
    }).catch(() => {
      mostrarFaqToast("Link copiado!");
    });
  } else {
    mostrarFaqToast("Link copiado!");
  }
}

function mostrarFaqToast(mensagem) {
  let toast = document.getElementById("faqCopyToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "faqCopyToast";
    toast.className = "faq-copy-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 2400);
}

document.addEventListener("DOMContentLoaded", () => {
  initTrajectoryCarousel();
  initFaqSystem();
});