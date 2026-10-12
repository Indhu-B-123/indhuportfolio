(function () {
  "use strict";

  /* ============ CONFIG (edit these) ============ */
  // To make the contact form send messages directly, create a free form at https://formspree.io
  // and paste its endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
  // While this is empty, the form falls back to opening the visitor's email app (mailto).
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "indhs3456@gmail.com";
  /* ============================================== */

  var root = document.documentElement;
  root.classList.add("js");

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeBtn = $("#theme-toggle");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0a0f1e" : "#f6f8fc");
  }
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  applyTheme(saved === "light" ? "light" : "dark");
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  var hamburger = $("#hamburger");
  var menu = $("#nav-menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  hamburger.addEventListener("click", function () {
    setMenu(hamburger.getAttribute("aria-expanded") !== "true");
  });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); hamburger.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- Sticky nav shadow, back-to-top ---------- */
  var navbar = $("#navbar");
  var topBtn = $("#back-to-top");
  function onScroll() {
    var y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 10);
    topBtn.hidden = y < 500;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  topBtn.addEventListener("click", function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- Active nav link on scroll ---------- */
  var links = $$(".nav-link");
  var map = {};
  links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (l) { l.classList.remove("active"); l.removeAttribute("aria-current"); });
          map[en.target.id].classList.add("active");
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });

    /* ---------- Scroll reveal ---------- */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      io.observe(el);
    });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Resume button: show only if resume.pdf exists ---------- */
  var resumeBtn = $("#resume-btn");
  if (resumeBtn && location.protocol.indexOf("http") === 0) {
    fetch(resumeBtn.getAttribute("href"), { method: "HEAD" })
      .then(function (r) { if (r.ok) resumeBtn.hidden = false; })
      .catch(function () {});
  }

  /* ---------- Project filters ---------- */
  var filterBtns = $$(".filter");
  var cards = $$(".project");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      cards.forEach(function (c) {
        c.classList.toggle("is-hidden", f !== "all" && c.getAttribute("data-category") !== f);
      });
    });
  });

  /* ---------- Project details toggle ---------- */
  $$(".details-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var list = btn.nextElementSibling;
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? "View features" : "Hide features";
      list.hidden = open;
    });
  });

  /* ---------- Contact form ---------- */
  var form = $("#contact-form");
  var statusEl = $("#form-status");
  var sendBtn = $("#send-btn");

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."; },
    subject: function (v) { return v.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters)."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Your message should be at least 10 characters."; }
  };

  function validateField(name) {
    var input = form.elements[name];
    var msg = rules[name](input.value);
    $("#" + name + "-err").textContent = msg;
    input.closest(".field").classList.toggle("invalid", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  Object.keys(rules).forEach(function (n) {
    form.elements[n].addEventListener("blur", function () { validateField(n); });
    form.elements[n].addEventListener("input", function () {
      if (form.elements[n].closest(".field").classList.contains("invalid")) validateField(n);
    });
  });

  function setStatus(type, text) {
    statusEl.className = "form-status " + type;
    statusEl.textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.elements._gotcha.value) return; // bot

    var firstBad = null;
    Object.keys(rules).forEach(function (n) {
      if (!validateField(n) && !firstBad) firstBad = form.elements[n];
    });
    if (firstBad) {
      setStatus("error", "Please fix the highlighted fields and try again.");
      firstBad.focus();
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim()
    };

    if (FORM_ENDPOINT) {
      sendBtn.disabled = true;
      setStatus("info", "Sending…");
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        setStatus("success", "Thank you! Your message was sent. I'll get back to you soon.");
      }).catch(function () {
        setStatus("error", "Sorry, something went wrong. Please email me directly at " + CONTACT_EMAIL + ".");
      }).then(function () { sendBtn.disabled = false; });
    } else {
      // No backend configured: open the visitor's email client with the message pre-filled.
      var body = data.message + "\n\n— " + data.name + " (" + data.email + ")";
      var href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);
      setStatus("info", "Opening your email app to send this message. If nothing opens, write to " + CONTACT_EMAIL + ".");
      window.location.href = href;
    }
  });
})();
