(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menu mobile */
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Barre de progression */
  var progress = document.getElementById("scrollProgress");
  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
  }
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* Lien actif dans la nav */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("active", match);
    });
  }
  document.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* Apparition au scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 0.06 + "s";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Main qui salue */
  var waveHand = document.getElementById("waveHand");
  var waveGreeting = document.getElementById("waveGreeting");
  if (waveHand && waveGreeting) {
    var greetings = ["Bonjour !", "Hello !", "¡Hola!"];
    var greetIndex = 0;
    waveHand.addEventListener("click", function () {
      waveGreeting.textContent = greetings[greetIndex % greetings.length];
      greetIndex++;
      if (!reduceMotion) {
        waveHand.classList.remove("wave-click");
        void waveHand.offsetWidth;
        waveHand.classList.add("wave-click");
      }
    });
    waveHand.addEventListener("animationend", function (e) {
      if (e.animationName === "wave-click") waveHand.classList.remove("wave-click");
    });
  }

  /* Pointillés + halo qui suit la souris */
  /* Les blocs de EXCLUDE n'ont pas de pointillés */
  var canvas = document.getElementById("fxGrid");
  if (canvas && canvas.getContext) {
    var EXCLUDE = ".site-nav, .case-study, .project-grid, .gh-item a, .btn, .tag, .trait, .case-tag, .about-portrait img, .contact, .site-footer";
    var PAD = 8;
    var blocks = Array.prototype.slice.call(document.querySelectorAll(EXCLUDE));
    var rects = [];

    var ctx = canvas.getContext("2d");
    var css = getComputedStyle(document.documentElement);
    var GOLD = css.getPropertyValue("--gold").trim() || "#c2953c";
    var BASE = css.getPropertyValue("--muted").trim() || "#57635a";
    var w = 0, h = 0, gap = 30, RADIUS = 150;
    var ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, s: 0, ts: 0 };
    var running = false;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 560 ? 24 : 30;
      draw(performance.now());
    }

    function collectRects() {
      rects.length = 0;
      for (var i = 0; i < blocks.length; i++) {
        var r = blocks[i].getBoundingClientRect();
        if (r.bottom < -PAD || r.top > h + PAD || r.width === 0) continue;
        rects.push([r.left - PAD, r.top - PAD, r.right + PAD, r.bottom + PAD]);
      }
    }
    function blocked(x, y) {
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]) return true;
      }
      return false;
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ptr.x += (ptr.tx - ptr.x) * 0.18;
      ptr.y += (ptr.ty - ptr.y) * 0.18;
      ptr.s += (ptr.ts - ptr.s) * 0.08;
      collectRects();

      var sy = window.scrollY || 0;
      var ox = (w % gap) / 2;
      var r0 = Math.floor(sy / gap) - 1, r1 = Math.ceil((sy + h) / gap) + 1;

      for (var r = r0; r <= r1; r++) {
        var py = r * gap;
        var vy = py - sy;
        if (vy < -gap || vy > h + gap) continue;

        for (var x0 = ox; x0 < w + gap; x0 += gap) {
          if (blocked(x0, vy)) continue;

          var dx = x0 - ptr.x, dy = vy - ptr.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var f = dist < RADIUS ? Math.pow(1 - dist / RADIUS, 2) * ptr.s : 0;

          var amb = reduceMotion ? 0 : (Math.sin((x0 + py) * 0.011 - t * 0.0009) + 1) / 2;
          var push = f * 12 / (dist || 1);
          var x = x0 + dx * push, y = vy + dy * push;

          ctx.globalAlpha = 0.14 + amb * 0.1;
          ctx.fillStyle = BASE;
          ctx.beginPath(); ctx.arc(x, y, 1.1 + amb * 0.3 + f * 1.8, 0, 6.2832); ctx.fill();
          if (f > 0.03) {
            ctx.globalAlpha = Math.min(f * 1.1, 0.95);
            ctx.fillStyle = GOLD;
            ctx.beginPath(); ctx.arc(x, y, 1.6 + f * 2.2, 0, 6.2832); ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      if (!running) return;
      draw(t);
      requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", function (e) {
      ptr.tx = e.clientX; ptr.ty = e.clientY;
      if (ptr.ts === 0) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
      ptr.ts = 1;
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { ptr.ts = 0; });
    window.addEventListener("blur", function () { ptr.ts = 0; });
    window.addEventListener("resize", resize);

    resize();
    if (!reduceMotion) { running = true; requestAnimationFrame(loop); }
    else { document.addEventListener("scroll", function () { draw(0); }, { passive: true }); }
  }
})();
