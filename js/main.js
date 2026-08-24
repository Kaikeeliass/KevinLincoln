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
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharFormulario();
});

// Pré-seleciona opção de serviço nos formulários
function preencherServicoFormulario(servico, prefix = "") {
  const cleanServico = servico.toLowerCase().trim();
  let targetRadioId = "";
  
  if (cleanServico.includes("24") || cleanServico.includes("projeto")) {
    targetRadioId = prefix + "servico-p24";
  } else if (cleanServico.includes("trimestral")) {
    targetRadioId = prefix + "servico-trimestral";
  } else if (cleanServico.includes("semestral")) {
    targetRadioId = prefix + "servico-semestral";
  } else if (cleanServico.includes("anual")) {
    targetRadioId = prefix + "servico-anual";
  } else if (cleanServico.includes("premium") || cleanServico.includes("mensal")) {
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