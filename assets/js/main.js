// Bolivas Burguer Artesanal — interações do site
(function () {
  "use strict";

  // Ano dinâmico no rodapé
  var anoEl = document.getElementById("anoAtual");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     Hero: a arte oficial é o fundo da seção (background cover).
     As áreas clicáveis são posicionadas por cima reproduzindo a mesma
     geometria do "background-size: cover / background-position: center top",
     para que fiquem exatamente sobre os elementos desenhados na arte.
     --------------------------------------------------------------- */
  var ART_W = 1536;
  var ART_H = 1024;
  var heroArt = document.getElementById("heroArt");
  var hotspots = heroArt ? heroArt.querySelectorAll(".hotspot") : [];

  function layoutHotspots() {
    if (!heroArt || !hotspots.length) return;
    var boxW = heroArt.clientWidth;
    var boxH = heroArt.clientHeight;
    var artRatio = ART_W / ART_H;
    var usaContain = getComputedStyle(heroArt).backgroundSize === "contain";

    var drawW, drawH, offsetX, offsetY;
    if (usaContain) {
      // No celular a arte inteira aparece centralizada sobre o fundo preto
      var escala = Math.min(boxW / ART_W, boxH / ART_H);
      drawW = ART_W * escala;
      drawH = ART_H * escala;
      offsetX = (boxW - drawW) / 2;
      offsetY = (boxH - drawH) / 2;
    } else {
      // Mesma conta que o navegador faz para "cover" com "center top"
      if (boxW / boxH > artRatio) {
        drawW = boxW;
        drawH = boxW / artRatio;
      } else {
        drawH = boxH;
        drawW = boxH * artRatio;
      }
      offsetX = (boxW - drawW) / 2;
      offsetY = 0;
    }

    for (var i = 0; i < hotspots.length; i++) {
      var el = hotspots[i];
      var parts = (el.getAttribute("data-rect") || "").split(",");
      if (parts.length !== 4) continue;
      el.style.left = offsetX + parseFloat(parts[0]) * drawW + "px";
      el.style.top = offsetY + parseFloat(parts[1]) * drawH + "px";
      el.style.width = parseFloat(parts[2]) * drawW + "px";
      el.style.height = parseFloat(parts[3]) * drawH + "px";
    }
  }

  if (heroArt) {
    layoutHotspots();
    if (window.ResizeObserver) {
      new ResizeObserver(layoutHotspots).observe(heroArt);
    }
    window.addEventListener("resize", layoutHotspots);
    window.addEventListener("orientationchange", layoutHotspots);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutHotspots);
    // Reposiciona quando a imagem de fundo terminar de carregar
    var artProbe = new Image();
    artProbe.onload = layoutHotspots;
    var isMobile = window.matchMedia("(max-width: 780px)").matches;
    artProbe.src = isMobile ? "/assets/images/banner-hero.webp" : "/assets/images/hero-art-1536.webp";
  }

  /* O menu do topo já está desenhado na arte, então o cabeçalho real
     só aparece depois que a Hero sai da tela. */
  var siteHeader = document.querySelector(".site-header");
  function toggleHeader() {
    if (!siteHeader || !heroArt) return;
    // No celular a arte fica pequena, então o cabeçalho real continua sempre visível
    if (window.matchMedia("(max-width: 780px)").matches) {
      siteHeader.classList.remove("is-hidden");
      return;
    }
    var limite = heroArt.offsetHeight - siteHeader.offsetHeight;
    siteHeader.classList.toggle("is-hidden", window.scrollY < limite);
  }
  if (siteHeader && heroArt) {
    toggleHeader();
    window.addEventListener("scroll", toggleHeader, { passive: true });
    window.addEventListener("resize", toggleHeader);
  }

  // Menu mobile drawer
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var navOverlay = document.getElementById("navOverlay");
  var navClose = document.getElementById("navClose");

  function closeNav() {
    mainNav.classList.remove("is-open");
    navOverlay.classList.remove("is-visible");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openNav() {
    mainNav.classList.add("is-open");
    navOverlay.classList.add("is-visible");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mainNav && navOverlay) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (mainNav.classList.contains("is-open")) closeNav();
      else openNav();
    });

    if (navClose) {
      navClose.addEventListener("click", function (e) {
        e.stopPropagation();
        closeNav();
      });
    }

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    navOverlay.addEventListener("click", closeNav);

    // Deslizar o dedo para a direita fecha o menu
    var touchStartX = 0;
    var touchStartY = 0;
    mainNav.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mainNav.addEventListener("touchmove", function (e) {
      if (!mainNav.classList.contains("is-open")) return;
      var diffX = e.touches[0].clientX - touchStartX;
      var diffY = e.touches[0].clientY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && diffX > 70) closeNav();
    }, { passive: true });

    document.addEventListener("click", function (e) {
      if (mainNav.classList.contains("is-open") &&
          !navToggle.contains(e.target) &&
          !mainNav.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("is-open")) closeNav();
    });
  }

  // Animação de entrada ao rolar a página
  var revealTargets = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Estado ativo do menu conforme a rolagem (scroll-spy)
  var navLinks = document.querySelectorAll(".nav-link");
  var spySections = ["sobre", "cardapio", "localizacao", "contato"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function updateActiveNav() {
    var headerH = document.querySelector(".site-header").offsetHeight;
    var scrollPos = window.scrollY + headerH + 20;
    var current = "topo";
    spySections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + window.scrollY;
      if (scrollPos >= top) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-section") === current);
    });
  }

  if (navLinks.length) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });
    updateActiveNav();
  }

  /* ---------------------------------------------------------------
     Carrossel de avaliações do Google
     3 cards por vez no computador, 2 no tablet e 1 no celular.
     Setas, pontinhos, arrasto com o dedo e rotação automática lenta.
     --------------------------------------------------------------- */
  var carrossel = document.getElementById("carrosselAvaliacoes");
  if (carrossel) {
    var trilha = document.getElementById("avaliacoesTrilha");
    var cards = trilha.querySelectorAll(".avaliacao-card");
    var pontosBox = document.getElementById("avaliacoesPontos");
    var btnAnterior = document.getElementById("avAnterior");
    var btnProximo = document.getElementById("avProximo");
    var ESPACO = 24; // precisa bater com o gap do CSS
    var TEMPO_AUTO = 6000;

    var indice = 0;
    var porTela = 1;
    var maxIndice = 0;
    var timerAuto = null;
    var movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function cardsPorTela() {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function montarPontos() {
      pontosBox.innerHTML = "";
      for (var i = 0; i <= maxIndice; i++) {
        var ponto = document.createElement("button");
        ponto.type = "button";
        ponto.className = "carrossel-ponto";
        ponto.setAttribute("aria-label", "Ir para a avaliação " + (i + 1));
        ponto.dataset.indice = i;
        ponto.addEventListener("click", function () {
          irPara(Number(this.dataset.indice));
          reiniciarAuto();
        });
        pontosBox.appendChild(ponto);
      }
    }

    function atualizarPontos() {
      var pontos = pontosBox.querySelectorAll(".carrossel-ponto");
      for (var i = 0; i < pontos.length; i++) {
        var ativo = i === indice;
        pontos[i].classList.toggle("is-ativo", ativo);
        pontos[i].setAttribute("aria-current", ativo ? "true" : "false");
      }
    }

    function irPara(novo) {
      if (novo < 0) novo = maxIndice;
      if (novo > maxIndice) novo = 0;
      indice = novo;
      var passo = cards[0].getBoundingClientRect().width + ESPACO;
      trilha.style.transform = "translateX(" + -(indice * passo) + "px)";
      atualizarPontos();
    }

    function medir() {
      porTela = cardsPorTela();
      maxIndice = Math.max(0, cards.length - porTela);
      if (indice > maxIndice) indice = maxIndice;
      // Divide a largura da janela entre os cards visíveis, descontando os vãos
      var largura = "calc((100% - " + (porTela - 1) * ESPACO + "px) / " + porTela + ")";
      trilha.style.setProperty("--gap-cards", ESPACO + "px");
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.setProperty("--largura-card", largura);
      }
      montarPontos();
      irPara(indice);
    }

    function reiniciarAuto() {
      if (movimentoReduzido) return;
      clearInterval(timerAuto);
      timerAuto = setInterval(function () { irPara(indice + 1); }, TEMPO_AUTO);
    }

    btnAnterior.addEventListener("click", function () { irPara(indice - 1); reiniciarAuto(); });
    btnProximo.addEventListener("click", function () { irPara(indice + 1); reiniciarAuto(); });

    // Pausa a rotação enquanto a pessoa está lendo
    carrossel.addEventListener("mouseenter", function () { clearInterval(timerAuto); });
    carrossel.addEventListener("mouseleave", reiniciarAuto);
    carrossel.addEventListener("focusin", function () { clearInterval(timerAuto); });
    carrossel.addEventListener("focusout", reiniciarAuto);

    // Arrastar com o dedo no celular
    var toqueX = null;
    carrossel.addEventListener("touchstart", function (e) {
      toqueX = e.touches[0].clientX;
      clearInterval(timerAuto);
    }, { passive: true });
    carrossel.addEventListener("touchend", function (e) {
      if (toqueX === null) return;
      var distancia = e.changedTouches[0].clientX - toqueX;
      if (Math.abs(distancia) > 40) irPara(distancia < 0 ? indice + 1 : indice - 1);
      toqueX = null;
      reiniciarAuto();
    }, { passive: true });

    // Setas do teclado
    carrossel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { irPara(indice - 1); reiniciarAuto(); }
      if (e.key === "ArrowRight") { irPara(indice + 1); reiniciarAuto(); }
    });

    window.addEventListener("resize", medir);
    medir();
    reiniciarAuto();
  }

  // Registro de cliques no cardápio (fica pronto para o GA4; sem GA4 configurado, apenas ignora)
  document.querySelectorAll("[data-event]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (typeof window.gtag === "function") {
        window.gtag("event", el.getAttribute("data-event"), {
          event_category: "cardapio",
          event_label: "Bolivas Burguer",
        });
      }
    });
  });
})();
