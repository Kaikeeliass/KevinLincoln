/**
 * KEVIN LINCOLN — NUTRICIONISTA
 * JavaScript principal (multipáginas). Sem dependências além do EmailJS.
 */

const WA_NUMBER = "5517981114500";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initReveal();
  initFormAndModal();
  initFloatingUI();
  initCurrentYear();
  initTestimonialFilter();
  initFaqSystem();
  initDetailsGroups();
});

/* ── 01. HEADER: estado ao rolar + link ativo ───────────────────────────── */
function initHeader() {
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const norm = (p) => p.split("#")[0].split("?")[0].split("/").pop() || "index.html";
  const current = norm(window.location.pathname);
  document.querySelectorAll(".nav a, .drawer-nav a").forEach((link) => {
    const href = norm(link.getAttribute("href") || "#");
    if (href && href === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ── 02. MENU MOBILE ────────────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("mobileDrawerOverlay");
  const closeBtn = document.getElementById("mobileDrawerClose");
  if (!toggle || !drawer || !overlay) return;

  const open = () => {
    drawer.classList.add("active");
    overlay.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtn?.focus());
  };
  const close = () => {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", open);
  closeBtn?.addEventListener("click", () => { close(); toggle.focus(); });
  overlay.addEventListener("click", close);
  drawer.querySelectorAll("a, button.btn").forEach((el) => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("active")) { close(); toggle.focus(); }
  });
}

/* ── 03. REVEAL AO ROLAR ────────────────────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

/* ── 04. <details> em grupo: abre um por vez ────────────────────────────── */
function initDetailsGroups() {
  document.querySelectorAll("[data-accordion]").forEach((group) => {
    const items = group.querySelectorAll("details");
    items.forEach((d) => d.addEventListener("toggle", () => {
      if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
    }));
  });
}

/* ── 05. MÁSCARAS ───────────────────────────────────────────────────────── */
function mascaraTelefone(input) {
  if (!input) return;
  input.addEventListener("input", function () {
    const d = this.value.replace(/\D/g, "").slice(0, 11);
    let f = "";
    if (d.length === 0) f = "";
    else if (d.length <= 2) f = "(" + d;
    else if (d.length <= 6) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
    else if (d.length <= 10) f = "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    else f = "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    this.value = f;
  });
}

function bloquearNumerosNome(input) {
  if (!input) return;
  input.addEventListener("input", function () {
    const clean = this.value.replace(/\d/g, "");
    if (clean !== this.value) this.value = clean;
  });
}

/* ── 06. MODAL & FORMULÁRIO (EmailJS) ───────────────────────────────────── */
function initFormAndModal() {
  document.querySelectorAll("#f-whats, #m-whats").forEach(mascaraTelefone);
  document.querySelectorAll("#f-nome, #m-nome").forEach(bloquearNumerosNome);
  if (typeof emailjs !== "undefined") emailjs.init("uikqMZyeHWmzNWxR6");

  // Botões com data-open-form="Serviço" abrem o modal sem JS inline
  document.querySelectorAll("[data-open-form]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.abrirFormulario();
    });
  });

  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.validarEEnviarFormulario(form.getAttribute("data-form"));
    });
  });

  const overlay = document.getElementById("modal-overlay");
  overlay?.addEventListener("click", (e) => { if (e.target === overlay) window.fecharFormulario(); });
  overlay?.querySelector(".modal-close")?.addEventListener("click", () => window.fecharFormulario());
  overlay?.querySelectorAll("[data-close-modal]").forEach((b) => b.addEventListener("click", () => window.fecharFormulario()));
}

let modalReturnFocus = null;

window.abrirFormulario = function () {
  const modal = document.getElementById("modal-overlay");
  if (!modal) {
    window.location.href = "contato.html";
    return;
  }
  modalReturnFocus = document.activeElement;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.querySelector("#m-nome")?.focus());
};

window.fecharFormulario = function () {
  const modal = document.getElementById("modal-overlay");
  if (!modal || !modal.classList.contains("active")) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalReturnFocus?.focus?.();
};

// Compatibilidade com chamadas antigas
window.fecharSeClicarFora = function (e) {
  if (e.target.id === "modal-overlay") window.fecharFormulario();
};

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("modal-overlay");
  if (!modal?.classList.contains("active")) return;
  if (e.key === "Escape") { window.fecharFormulario(); return; }
  if (e.key === "Tab") {
    const focusable = Array.from(modal.querySelectorAll("button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled])"))
      .filter((el) => el.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

window.validarEEnviarFormulario = async function (formType = "page") {
  const prefix = formType === "modal" ? "m-" : "f-";
  const btn = document.getElementById(formType === "modal" ? "m-btn-enviar" : "f-btn-enviar");
  const formBox = document.getElementById(formType === "modal" ? "modal-form-content" : "page-form-content");
  const successBox = document.getElementById(formType === "modal" ? "modal-form-sucesso" : "page-form-sucesso");
  const scope = formBox || document;

  scope.querySelectorAll(".form-error, .submit-error").forEach((el) => el.remove());
  scope.querySelectorAll(".input-error").forEach((el) => { el.classList.remove("input-error"); el.removeAttribute("aria-invalid"); });

  const $ = (id) => document.getElementById(prefix + id);
  let valido = true;
  const setErro = (el, msg) => {
    if (!el) return;
    el.classList.add("input-error");
    el.setAttribute("aria-invalid", "true");
    const err = document.createElement("span");
    err.className = "form-error";
    err.setAttribute("role", "alert");
    err.textContent = msg;
    el.parentNode.appendChild(err);
    valido = false;
  };

  const nome = ($("nome")?.value || "").trim();
  if (nome.length < 3 || !nome.includes(" ")) setErro($("nome"), "Informe seu nome e sobrenome.");

  const email = ($("email")?.value || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setErro($("email"), "Informe um e-mail válido.");

  const whats = ($("whats")?.value || "").trim();
  const digits = whats.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) setErro($("whats"), "Informe seu WhatsApp completo: (XX) 9XXXX-XXXX.");

  const radio = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.nextElementSibling.textContent.trim() : "";
  };

  if (!valido) {
    scope.querySelector(".input-error")?.focus();
    return;
  }

  const objetivo = radio(prefix + "obj") || "Emagrecimento";
  const servico = "Plano Trimestral (3 meses)";

  const params = {
    nome,
    idade: "Não informado no primeiro contato",
    email_paciente: email,
    whats,
    peso: "Não informado no primeiro contato",
    altura: "Não informado no primeiro contato",
    objetivo,
    servico_desejado: servico,
    treino: "Não informado",
    alimentacao: "Não informado",
    restricoes: "Nenhuma",
    mensagem: ($("msg")?.value || "").trim() || "Sem observações adicionais"
  };

  const labelOriginal = btn ? btn.innerHTML : "";
  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

  try {
    if (typeof emailjs === "undefined") throw new Error("EmailJS indisponível");
    await emailjs.send("service_6w1t7v2", "template_doox4c8", params);

    if (formBox) formBox.style.display = "none";
    if (successBox) {
      successBox.classList.add("active");
      successBox.setAttribute("tabindex", "-1");
      successBox.focus();
      const wa = successBox.querySelector(".btn-wa-confirmar");
      if (wa) {
        const msg = encodeURIComponent(
          `Olá Kevin! Acabei de enviar minha solicitação pelo site.\n\n*Nome:* ${nome}\n*Objetivo:* ${objetivo}\n*Interesse:* ${servico}\n\nQuero saber os próximos passos!`
        );
        wa.setAttribute("href", `https://wa.me/${WA_NUMBER}?text=${msg}`);
      }
    }
    if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { servico });
  } catch (err) {
    console.error("Erro no envio:", err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = labelOriginal;
      const p = document.createElement("p");
      p.className = "submit-error";
      p.setAttribute("role", "alert");
      p.append("Não foi possível enviar agora. Você pode ");
      const a = document.createElement("a");
      a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Olá Kevin! Quero saber mais sobre: ${servico}. Meu nome é ${nome}.`)}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "falar com o Kevin pelo WhatsApp";
      p.append(a, ".");
      btn.parentNode.appendChild(p);
    }
  }
};

/* ── 07. WHATSAPP FLUTUANTE + CTA FIXO NO MOBILE ────────────────────────── */
function initFloatingUI() {
  const wa = document.getElementById("floatingWa");
  const sticky = document.getElementById("mobileStickyCta");
  const hero = document.querySelector("[data-hero]") || document.querySelector(".hero, .page-hero");
  const endZones = Array.from(document.querySelectorAll("[data-hide-sticky], #cta-final, .site-footer"));
  if (!wa && !sticky) return;

  const inEndZone = () => endZones.some((z) => {
    const r = z.getBoundingClientRect();
    return r.top < window.innerHeight - 80 && r.bottom > 0;
  });

  const update = () => {
    const pastHero = hero ? hero.getBoundingClientRect().bottom < 80 : window.scrollY > 400;
    const hidden = inEndZone();
    wa?.classList.toggle("visible", window.scrollY > 320 && !hidden);
    sticky?.classList.toggle("active", pastHero && !hidden);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

/* ── 08. ANO NO RODAPÉ ──────────────────────────────────────────────────── */
function initCurrentYear() {
  const el = document.getElementById("ano-atual");
  if (el) el.textContent = new Date().getFullYear();
}

/* ── 09. FILTRO DE DEPOIMENTOS ──────────────────────────────────────────── */
function initTestimonialFilter() {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".testimonial-card-pro[data-category]");
  if (!tabs.length || !cards.length) return;
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-pressed", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-pressed", "true");
    const cat = tab.dataset.filter;
    cards.forEach((c) => { c.style.display = (cat === "all" || c.dataset.category.split(" ").includes(cat)) ? "" : "none"; });
  }));
}

/* ── 10. CENTRAL DE DÚVIDAS: busca, categorias, accordion, deep link ───── */
function initFaqSystem() {
  const items = document.querySelectorAll(".faq-item-box");
  if (!items.length) return;
  const search = document.getElementById("faqSearchInput");
  const clear = document.getElementById("faqSearchClear");
  const counter = document.getElementById("faqSearchCounter");
  const chips = document.querySelectorAll(".faq-chip-btn");
  const empty = document.getElementById("faqEmptyState");
  const groups = document.querySelectorAll(".faq-category-group");
  let category = "todos";
  let query = "";
  let timer = null;

  items.forEach((item) => {
    const q = item.querySelector(".faq-question-text");
    if (q) item.dataset.originalText = q.textContent.trim();
    const btn = item.querySelector(".faq-question-btn");
    btn?.addEventListener("click", () => {
      const willOpen = !item.classList.contains("active");
      items.forEach((o) => { o.classList.remove("active"); o.querySelector(".faq-question-btn")?.setAttribute("aria-expanded", "false"); });
      if (willOpen) { item.classList.add("active"); btn.setAttribute("aria-expanded", "true"); }
    });
    item.querySelector(".faq-copy-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      copiarLinkDuvida(item.id);
    });
  });

  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
    chip.classList.add("active");
    chip.setAttribute("aria-pressed", "true");
    category = chip.dataset.category || "todos";
    aplicar();
  }));

  if (search) {
    search.addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        query = e.target.value.trim().toLowerCase();
        clear?.classList.toggle("visible", query.length > 0);
        aplicar();
      }, 120);
    });
    search.addEventListener("keydown", (e) => { if (e.key === "Escape") limpar(); });
    clear?.addEventListener("click", () => { limpar(); search.focus(); });
  }

  function limpar() {
    if (!search) return;
    search.value = "";
    query = "";
    clear?.classList.remove("visible");
    aplicar();
  }

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function aplicar() {
    let total = 0;
    items.forEach((item) => {
      const original = item.dataset.originalText || "";
      const answer = (item.querySelector(".faq-answer-inner")?.textContent || "").toLowerCase();
      const qEl = item.querySelector(".faq-question-text");
      const matchCat = category === "todos" || item.dataset.category === category;
      let matchQ = true;
      if (query) {
        const inQ = original.toLowerCase().includes(query);
        matchQ = inQ || answer.includes(query);
        if (qEl) qEl.innerHTML = inQ ? escapeHtml(original).replace(new RegExp(`(${escapeRe(escapeHtml(query))})`, "gi"), '<span class="faq-term-highlight">$1</span>') : escapeHtml(original);
      } else if (qEl) {
        qEl.textContent = original;
      }
      const show = matchCat && matchQ;
      item.hidden = !show;
      if (show) total++;
    });
    groups.forEach((g) => { g.hidden = !g.querySelector(".faq-item-box:not([hidden])"); });
    empty?.classList.toggle("active", total === 0);
    if (counter) counter.textContent = query ? (total === 1 ? "1 resposta encontrada" : `${total} respostas encontradas`) : "";
  }

  function abrirPorHash() {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("faq-item-box")) return;
    category = "todos";
    chips.forEach((c) => c.classList.toggle("active", c.dataset.category === "todos"));
    aplicar();
    items.forEach((o) => o.classList.remove("active"));
    target.classList.add("active", "highlight-target");
    target.querySelector(".faq-question-btn")?.setAttribute("aria-expanded", "true");
    setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    setTimeout(() => target.classList.remove("highlight-target"), 2200);
  }
  window.addEventListener("hashchange", abrirPorHash);
  abrirPorHash();
}

function copiarLinkDuvida(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  const done = () => mostrarToast("Link da pergunta copiado!");
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
  else done();
}

function mostrarToast(msg) {
  let t = document.getElementById("faqCopyToast");
  if (!t) {
    t = document.createElement("div");
    t.id = "faqCopyToast";
    t.className = "faq-copy-toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("active");
  setTimeout(() => t.classList.remove("active"), 2400);
}
