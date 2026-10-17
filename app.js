/* App logic. You normally never need to touch this file. Edit content.js. */
(function () {
  const app = document.getElementById("app");
  const tabs = document.querySelectorAll(".tabs a");
  const brand = document.getElementById("brand");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let cleanup = null;      // tears down the slider when leaving it
  let savedIndex = 0;      // remembers which slide you were on

  brand.textContent = ABOUT.name;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const assetPath = (p, src) => (/^(https?:)?\/\//.test(src) || src.includes("/") ? src : `projects/${p.slug}/${src}`);
  const coverOf = (p) => (p.cover ? assetPath(p, p.cover) : `projects/${p.slug}/cover.jpg`);
  const normImages = (p) => (p.images || []).map((im) => (typeof im === "string" ? { src: im } : im)).filter((im) => im && im.src);

  function setTab(name) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  }

  /* ---------- router ---------- */
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    const path = (location.hash.replace(/^#/, "") || "/").replace(/\/+$/, "") || "/";
    window.scrollTo(0, 0);

    if (path === "/about") return renderAbout();
    const m = path.match(/^\/p\/(.+)$/);
    if (m) {
      const i = PROJECTS.findIndex((p) => p.slug === decodeURIComponent(m[1]));
      if (i !== -1) return renderProject(i);
    }
    renderSlider();
  }
  window.addEventListener("hashchange", route);

  /* ---------- About ---------- */
  function renderAbout() {
    document.body.classList.remove("lock");
    setTab("about");
    document.title = `About · ${ABOUT.name}`;
    app.innerHTML = `
      <section class="page view">
        <p class="kicker">// about</p>
        <h1 class="statement">${ABOUT.statement.map((l) => `<span>${esc(l)}</span>`).join("")}</h1>
        <div class="bio">${ABOUT.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="link-row">
          ${(ABOUT.links || []).map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}
          <a class="btn" href="#/">See projects →</a>
        </div>
      </section>`;
  }

  /* ---------- Project detail ---------- */
  function renderProject(i) {
    const p = PROJECTS[i];
    savedIndex = i;
    document.body.classList.remove("lock");
    setTab("projects");
    document.title = `${p.title} · ${ABOUT.name}`;

    const imgs = normImages(p);
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(i + 1) % PROJECTS.length];

    const gallery = imgs.length
      ? imgs.map((im, k) => `
          <figure class="shot">
            <img src="${esc(assetPath(p, im.src))}" alt="${esc(im.caption || p.title)}" loading="lazy" />
            ${im.caption ? `<figcaption><b>${pad(k + 1)}</b>${esc(im.caption)}</figcaption>` : ""}
          </figure>`).join("")
      : `<div class="empty">No photos yet. Drop them in <code>projects/${esc(p.slug)}/</code> and list them under <code>images</code> in content.js</div>`;

    app.innerHTML = `
      <article class="page view">
        <a class="back" href="#/">← All projects</a>
        <p class="kicker">// ${pad(i + 1)} / ${pad(PROJECTS.length)}</p>
        <h1 class="p-title">${esc(p.title)}</h1>
        <div class="p-meta">
          <span class="p-year">${esc(p.year)}</span>
          ${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
        </div>
        <p class="p-summary">${esc(p.summary)}</p>
        ${(p.links || []).length ? `<div class="link-row" style="margin:-24px 0 56px">${p.links.map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>` : ""}
        <div class="gallery">
          <figure class="shot cover-shot"><img src="${esc(coverOf(p))}" alt="${esc(p.title)}" /></figure>
          ${gallery}
        </div>
        ${PROJECTS.length > 1 ? `
        <nav class="p-next">
          <a href="#/p/${encodeURIComponent(prev.slug)}">← ${esc(prev.title)}</a>
          <a href="#/p/${encodeURIComponent(next.slug)}">${esc(next.title)} →</a>
        </nav>` : ""}
      </article>`;

    // Hide the cover block if there's no cover.jpg yet
    const cover = app.querySelector(".cover-shot img");
    cover.addEventListener("error", () => cover.parentElement.remove());

    const onKey = (e) => { if (e.key === "Escape") location.hash = "#/"; };
    window.addEventListener("keydown", onKey);
    cleanup = () => window.removeEventListener("keydown", onKey);
  }

  /* ---------- Projects slider (home) ---------- */
  function renderSlider() {
    document.body.classList.add("lock");
    setTab("projects");
    document.title = ABOUT.name;
    const n = PROJECTS.length;

    const tickCount = Math.max(21, n * 6 + 1);
    app.innerHTML = `
      <section class="slider view" aria-label="Projects">
        <div class="ticks" aria-hidden="true">
          ${Array.from({ length: tickCount }, (_, k) => `<i class="${k % 6 === 0 ? "major" : ""}"></i>`).join("")}
          <span class="window"></span>
        </div>
        <div class="track">
          ${PROJECTS.map((p, i) => `
            <div class="slide" data-i="${i}">
              <div class="slide-label"><span><span class="num">${pad(i + 1)}</span>&nbsp;&nbsp;${esc(p.title)}</span><span>${esc(p.year)}</span></div>
              <a class="slide-frame" href="#/p/${encodeURIComponent(p.slug)}" draggable="false" aria-label="Open ${esc(p.title)}">
                <div class="ph">
                  <span class="ph-num">${pad(i + 1)} / ${pad(n)}</span>
                  <span class="ph-title">${esc(p.title)}</span>
                  <span class="ph-note">add projects/${esc(p.slug)}/cover.jpg</span>
                </div>
                <img src="${esc(coverOf(p))}" alt="" draggable="false" />
                <span class="slide-open">Open project →</span>
              </a>
            </div>`).join("")}
        </div>
        <div class="slider-foot">
          <span class="hint">Scroll or drag →</span>
          <span class="count"><b>01</b> / ${pad(n)}</span>
        </div>
      </section>`;

    const slider = app.querySelector(".slider");
    const track = app.querySelector(".track");
    const slides = [...app.querySelectorAll(".slide")];
    const imgs = slides.map((s) => s.querySelector("img"));
    const ticks = app.querySelector(".ticks");
    const win = app.querySelector(".ticks .window");
    const countEl = app.querySelector(".count b");

    imgs.forEach((img) => img.addEventListener("error", () => img.remove()));

    let step = 1, max = 0, target = 0, current = 0, raf = 0, active = -1;
    let snapTimer = 0;

    function measure() {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      step = slides[0].offsetWidth + gap;
      max = step * (n - 1);
      target = clamp(savedIndex * step, 0, max);
      current = target;
      // tick window = about 3 tick spaces wide
      win.style.width = `${Math.max(16, ticks.offsetWidth / Math.max(n, 3))}px`;
    }

    const snap = () => { target = clamp(Math.round(target / step) * step, 0, max); };
    const goTo = (i) => { target = clamp(i, 0, n - 1) * step; };

    function frame() {
      current += (target - current) * (reduceMotion ? 1 : 0.12);
      if (Math.abs(target - current) < 0.1) current = target;
      track.style.transform = `translate3d(${-current}px,0,0)`;

      // parallax on images
      slides.forEach((s, i) => {
        const img = imgs[i];
        if (img && img.isConnected) img.style.transform = `translate3d(${((i * step - current) / step) * -40}px,0,0)`;
      });

      const idx = clamp(Math.round(current / step), 0, n - 1);
      if (idx !== active) {
        if (slides[active]) slides[active].classList.remove("is-active");
        slides[idx].classList.add("is-active");
        countEl.textContent = pad(idx + 1);
        active = idx;
        savedIndex = idx;
      }
      const prog = max ? current / max : 0;
      win.style.left = `${prog * (ticks.offsetWidth - win.offsetWidth)}px`;
      raf = requestAnimationFrame(frame);
    }

    // Mouse wheel / trackpad: vertical scroll moves sideways
    function onWheel(e) {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      target = clamp(target + d * (e.deltaMode === 1 ? 32 : 1), 0, max);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 180);
    }

    // Drag (mouse + touch)
    let dragging = false, startX = 0, startTarget = 0, moved = 0, lastX = 0, lastT = 0, vel = 0;
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true; moved = 0; vel = 0;
      startX = lastX = e.clientX; startTarget = target; lastT = performance.now();
      clearTimeout(snapTimer);
    }
    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) slider.classList.add("dragging");
      target = clamp(startTarget - dx * 1.2, -step * 0.15, max + step * 0.15);
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      slider.classList.remove("dragging");
      target = clamp(target - vel * 260, 0, max);  // fling
      snap();
    }
    // A drag should not count as a click on the card
    function onClick(e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; }
    }

    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(active + 1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(active - 1); }
      else if (e.key === "Enter" && document.activeElement === document.body) { location.hash = `#/p/${encodeURIComponent(PROJECTS[active].slug)}`; }
    }

    // Clicking a slide that is not centered just centers it
    slides.forEach((s, i) => s.querySelector(".slide-frame").addEventListener("click", (e) => {
      if (i !== active && moved <= 6) { e.preventDefault(); goTo(i); }
    }));

    const onResize = () => { savedIndex = active < 0 ? savedIndex : active; measure(); };

    slider.addEventListener("wheel", onWheel, { passive: false });
    slider.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    slider.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    measure();
    raf = requestAnimationFrame(frame);

    cleanup = () => {
      cancelAnimationFrame(raf);
      clearTimeout(snapTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }

  route();
})();
