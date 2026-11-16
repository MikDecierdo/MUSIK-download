  // Theme toggle: follows the system until clicked; the choice is remembered on this browser only
  (function () {
    var root = document.documentElement, button = document.getElementById("theme");
    try {
      var saved = localStorage.getItem("musik-theme");
      if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
    } catch (e) {}
    function current() {
      var set = root.getAttribute("data-theme");
      if (set) return set;
      return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function label() { button.textContent = current() === "dark" ? "Light" : "Dark"; }
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("musik-theme", next); } catch (e) {}
      label();
    });
    label();
  })();

  // Screenshot slideshow: swipe or scroll the strip; arrows, dots and arrow keys move one slide.
  // It moves on its own every 5 s until someone touches it (and never with reduced motion).
  (function () {
    var strip = document.getElementById("slides"), dotsBox = document.getElementById("dots");
    if (!strip) return;
    var slides = strip.children, dots = [], auto = null;
    function index() { return Math.round(strip.scrollLeft / strip.clientWidth); }
    function go(i) {
      i = (i + slides.length) % slides.length;
      strip.scrollTo({ left: i * strip.clientWidth, behavior: "smooth" });
    }
    function stop() { if (auto) { clearInterval(auto); auto = null; } }
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Screenshot " + (i + 1) + ": " + slides[i].getAttribute("aria-label"));
      dot.addEventListener("click", (function (n) { return function () { stop(); go(n); }; })(i));
      dotsBox.appendChild(dot);
      dots.push(dot);
    }
    function mark() {
      var n = index();
      dots.forEach(function (d, k) { d.setAttribute("aria-current", k === n ? "true" : "false"); });
    }
    strip.addEventListener("scroll", mark, { passive: true });
    document.querySelectorAll(".slide-btn").forEach(function (b) {
      b.addEventListener("click", function () { stop(); go(index() + Number(b.dataset.step)); });
    });
    strip.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); stop(); go(index() + (e.key === "ArrowRight" ? 1 : -1)); }
    });
    ["pointerdown", "wheel", "touchstart"].forEach(function (t) { strip.addEventListener(t, stop, { passive: true }); });
    mark();
    var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) auto = setInterval(function () { if (!document.hidden) go(index() + 1); }, 5000);
  })();
