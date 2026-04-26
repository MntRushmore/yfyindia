import gsap from "gsap";

/* ─────────────────────────────────────────────
   Youth for Yoga — Cinematic Homepage Film

   Architecture: each "scene" is a fullscreen
   absolutely-positioned div that fades/slides
   in and out. No scrolling, no virtual viewport.
   GSAP timeline is the only driver.
───────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

  /* ══════════════════════════════════════════
     SCENE DEFINITIONS
     Each scene has: id, duration, build fn
  ══════════════════════════════════════════ */
  const SCENES = [
    { id: "scene-hero",        label: "Youth for Yoga",               dur: 6  },
    { id: "scene-heroimg",     label: "India Journey 2025",           dur: 6  },
    { id: "scene-mission-1",   label: "Teaching Yoga to 500+ Students", dur: 5 },
    { id: "scene-mission-2",   label: "5 Schools Across India",       dur: 5  },
    { id: "scene-mission-3",   label: "Ferozabad, Uttar Pradesh",     dur: 5  },
    { id: "scene-mission-4",   label: "Focus, Resilience & Connection", dur: 5 },
    { id: "scene-mission-5",   label: "A Movement Built by Youth",    dur: 5  },
    { id: "scene-services-hdr",label: "Our Mission in Action",        dur: 5  },
    { id: "scene-card-1",      label: "Teaching Yoga",                dur: 5  },
    { id: "scene-card-2",      label: "Student Home Visits",          dur: 5  },
    { id: "scene-card-3",      label: "Hugs & Lots of Love",          dur: 5  },
    { id: "scene-card-4",      label: "Taj Mahal & Beyond",           dur: 5  },
    { id: "scene-stats",       label: "Our Journey in Numbers",       dur: 6  },
    { id: "scene-partners",    label: "Our Partners",                 dur: 5  },
    { id: "scene-footer",      label: "Youth for Yoga",               dur: 6  },
  ];

  /* compute start times from durations */
  let cursor = 0;
  SCENES.forEach(s => { s.start = cursor; cursor += s.dur; });
  const TOTAL = cursor; // ~84 s

  /* ══════════════════════════════════════════
     BUILD SCENE DOM
  ══════════════════════════════════════════ */
  const stage = document.getElementById("film-stage");

  /* helper: create a fullscreen scene div */
  function makeScene(id, bgColor, fgColor) {
    const div = document.createElement("div");
    div.id = id;
    div.className = "film-scene";
    div.style.cssText = `
      position:absolute;inset:0;
      background:${bgColor || "var(--bg)"};
      color:${fgColor || "var(--fg)"};
      opacity:0;pointer-events:none;
      display:flex;flex-direction:column;
      justify-content:center;align-items:center;
      overflow:hidden;
    `;
    stage.appendChild(div);
    return div;
  }

  /* hero cycling images */
  let heroImgEl = null;
  let heroInterval = null;
  let currentHeroIdx = 1;

  function startHeroCycle() {
    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => {
      currentHeroIdx = currentHeroIdx >= 15 ? 1 : currentHeroIdx + 1;
      if (heroImgEl) heroImgEl.src = `/images/hero/hero-${currentHeroIdx}.jpg`;
    }, 250);
  }

  /* ── SCENE 0: Hero text ── */
  (() => {
    const s = makeScene("scene-hero", "var(--bg)", "var(--fg)");
    /* mandala */
    const mandala = document.createElement("div");
    mandala.style.cssText = `
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      width:min(70vw,70vh);height:min(70vw,70vh);
      background:url('/images/mandala.png') center/contain no-repeat;
      opacity:0.12;pointer-events:none;
    `;
    s.appendChild(mandala);
    /* "YOUTH" */
    const h1 = document.createElement("h1");
    h1.textContent = "Youth";
    h1.style.cssText = `font-size:15vw;line-height:0.9;color:var(--accent1);transform:translateX(-20%);position:relative;z-index:1;`;
    /* "FOR YOGA" */
    const h2 = document.createElement("h1");
    h2.textContent = "for Yoga";
    h2.style.cssText = `font-size:15vw;line-height:0.9;transform:translateX(20%);position:relative;z-index:2;`;
    /* footer caption */
    const cap = document.createElement("p");
    cap.className = "mn";
    cap.textContent = "India Journey / 2025";
    cap.style.cssText = `position:absolute;bottom:2em;left:50%;transform:translateX(-50%);opacity:0.6;`;
    s.append(h1, h2, cap);
    s._els = { h1, h2, cap };
  })();

  /* ── SCENE 1: Hero image ── */
  (() => {
    const s = makeScene("scene-heroimg", "var(--bg)", "var(--fg)");
    s.style.padding = "2em";
    const frame = document.createElement("div");
    frame.style.cssText = `
      width:100%;height:100%;
      border:0.3em solid var(--fg);
      border-radius:2em;overflow:hidden;
      transform:scale(0.25) rotate(-15deg);
    `;
    const img = document.createElement("img");
    img.src = "/images/hero/hero-1.jpg";
    img.alt = "Youth for Yoga";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    heroImgEl = img;
    frame.appendChild(img);
    s.appendChild(frame);
    s._frame = frame;
  })();

  /* ── SCENES 2-6: Mission slides (each with big text + image strip) ── */
  const missionData = [
    { title: "Teaching Yoga\nto 500+ Students", img: "/images/hero/hero-3.jpg" },
    { title: "5 Schools\nAcross India",         img: "/images/gallery/teaching-yoga/IMG_4288.jpg" },
    { title: "Ferozabad,\nUttar Pradesh",        img: "/images/gallery/entering-school/IMG_4232.jpg" },
    { title: "Focus, Resilience\n& Connection",  img: "/images/gallery/general/044A3E98-A9E2-402F-B307-DA3A30894AEE.jpeg" },
    { title: "A Movement\nBuilt by Youth",       img: "/images/gallery/hugs/2E1028E8-A0A5-4C88-9F19-2B85BFD6DA6A.jpeg" },
  ];

  missionData.forEach((m, i) => {
    const bg = i % 2 === 0 ? "var(--bg)" : "var(--accent2)";
    const s = makeScene(`scene-mission-${i + 1}`, bg, "var(--fg)");
    s.style.cssText += `flex-direction:row;gap:0;padding:0;`;

    /* left: big title */
    const left = document.createElement("div");
    left.style.cssText = `
      flex:1;display:flex;align-items:center;justify-content:center;
      padding:3em;text-align:center;
    `;
    const h = document.createElement("h1");
    h.style.cssText = `font-size:clamp(2rem,6vw,5rem);line-height:1;`;
    h.textContent = m.title.replace("\n", " ");
    left.appendChild(h);

    /* right: image */
    const right = document.createElement("div");
    right.style.cssText = `
      flex:1;height:100%;overflow:hidden;
    `;
    const img = document.createElement("img");
    img.src = m.img;
    img.alt = m.title;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;transform:scale(1.08);";
    right.appendChild(img);

    s.append(left, right);
    s._h = h;
    s._img = img;
  });

  /* ── SCENE 7: Services header ── */
  (() => {
    const s = makeScene("scene-services-hdr", "var(--bg)", "var(--fg)");
    s.style.cssText += `text-align:center;gap:1.5em;padding:3em;`;

    const logo = document.createElement("img");
    logo.src = "/images/logo.png";
    logo.style.cssText = "width:80px;height:80px;border-radius:50%;object-fit:contain;";

    const p = document.createElement("p");
    p.textContent = "We're Youth for Yoga — a youth-led nonprofit sharing the practice of yoga with students across India and beyond.";
    p.style.cssText = "max-width:500px;opacity:0.8;";

    const title1 = document.createElement("h1");
    title1.textContent = "Our Mission";
    title1.style.fontSize = "clamp(3rem,8vw,7rem)";

    const title2 = document.createElement("h1");
    title2.textContent = "in Action";
    title2.style.fontSize = "clamp(3rem,8vw,7rem)";

    s.append(logo, p, title1, title2);
    s._els = { logo, p, title1, title2 };
  })();

  /* ── SCENES 8-11: Service cards ── */
  const cardData = [
    { title: "Teaching Yoga",       body: "We led daily yoga sessions at schools across Ferozabad — working with students of all ages to build strength, focus, and calm.", tag: "Postures · Breathing · Mindfulness", img: "/images/gallery/teaching-yoga/IMG_4299.jpg", bg: "var(--accent1)", fg: "var(--bg)" },
    { title: "Student Home Visits", body: "We visited students in their homes, meeting families and understanding the communities we serve — making real, lasting connections.", tag: "Community · Connection · Care", img: "/images/gallery/students-home/762F1770-E2C6-45A1-91F4-21D0DF6FB559.jpeg", bg: "var(--bg2)", fg: "var(--fg)" },
    { title: "Hugs & Lots of Love", body: "The goodbyes that made everything worth it — students, families, and our team sharing moments of genuine connection and warmth at journey's end.", tag: "Connection · Joy · Gratitude", img: "/images/gallery/hugs/4A999BD4-71DE-46B6-A893-080C26DB4FA5.jpeg", bg: "var(--accent3)", fg: "var(--fg)" },
    { title: "Taj Mahal & Beyond",  body: "From the Taj Mahal to local markets in Ferozabad — we immersed ourselves in the culture, history, and spirit of India.", tag: "India · Culture · Growth", img: "/images/gallery/taj-mahal/IMG_6354.jpg", bg: "var(--fg)", fg: "var(--bg)" },
  ];

  cardData.forEach((c, i) => {
    const s = makeScene(`scene-card-${i + 1}`, c.bg, c.fg);
    s.style.cssText += `flex-direction:row;gap:0;padding:0;`;

    const left = document.createElement("div");
    left.style.cssText = `
      flex:1.2;display:flex;flex-direction:column;
      justify-content:center;gap:1.5em;padding:4em;
    `;

    const num = document.createElement("p");
    num.className = "mn";
    num.textContent = `0${i + 1} / 04`;
    num.style.opacity = "0.4";

    const h = document.createElement("h1");
    h.textContent = c.title;
    h.style.fontSize = "clamp(2.5rem,5vw,4.5rem)";

    const body = document.createElement("p");
    body.textContent = c.body;
    body.style.cssText = `max-width:380px;opacity:0.85;`;

    const tag = document.createElement("p");
    tag.className = "mn";
    tag.textContent = c.tag;
    tag.style.opacity = "0.55";

    left.append(num, h, body, tag);

    const right = document.createElement("div");
    right.style.cssText = `flex:1;height:100%;overflow:hidden;`;
    const img = document.createElement("img");
    img.src = c.img;
    img.alt = c.title;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;transform:scale(1.05);";
    right.appendChild(img);

    s.append(left, right);
    s._els = { num, h, body, tag, img };
  });

  /* ── SCENE 12: Stats ── */
  (() => {
    const s = makeScene("scene-stats", "var(--bg)", "var(--fg)");
    s.style.cssText += `padding:4em;gap:2em;`;

    const header = document.createElement("h1");
    header.textContent = "Our Journey in Numbers";
    header.style.cssText = `font-size:clamp(2rem,5vw,4rem);text-align:center;margin-bottom:0.5em;`;

    const grid = document.createElement("div");
    grid.style.cssText = `
      display:grid;grid-template-columns:repeat(3,1fr);
      gap:1.5em;width:100%;max-width:1000px;
    `;

    const statsData = [
      { num: "500+", sub: "Students taught yoga across India", bg: "var(--accent1)", fg: "var(--bg)" },
      { num: "5",    sub: "Schools visited in Ferozabad, Uttar Pradesh", bg: "var(--accent3)", fg: "var(--fg)" },
      { num: "India",sub: "Journey 2025 — connecting youth through yoga", bg: "var(--fg)", fg: "var(--bg)" },
    ];

    const statEls = statsData.map(d => {
      const box = document.createElement("div");
      box.style.cssText = `
        background:${d.bg};color:${d.fg};
        border-radius:1em;padding:2em;
        display:flex;flex-direction:column;justify-content:space-between;
        aspect-ratio:1/1;
      `;
      const n = document.createElement("h1");
      n.textContent = d.num;
      n.style.fontSize = "clamp(2.5rem,6vw,5rem)";
      const p = document.createElement("p");
      p.textContent = d.sub;
      p.style.opacity = "0.7";
      box.append(n, p);
      grid.appendChild(box);
      return box;
    });

    s.append(header, grid);
    s._els = { header, statEls };
  })();

  /* ── SCENE 13: Partners ── */
  (() => {
    const s = makeScene("scene-partners", "var(--fg)", "var(--bg)");
    s.style.cssText += `padding:4em;gap:2em;text-align:center;overflow:hidden;`;

    const label = document.createElement("p");
    label.className = "mn";
    label.textContent = "Made possible by our partners";
    label.style.opacity = "0.6";

    const tickerWrap = document.createElement("div");
    tickerWrap.style.cssText = `overflow:hidden;width:100%;`;
    const ticker = document.createElement("div");
    ticker.style.cssText = `
      display:flex;gap:2em;white-space:nowrap;
      animation:tickerScroll 12s linear infinite;
      width:max-content;
    `;
    const names = ["Yoga Without Borders", "EduGirls", "Rainbow Kids Yoga", "Dau Dayal School"];
    const allNames = [...names, ...names]; // duplicate for seamless loop
    allNames.forEach((n, i) => {
      const span = document.createElement("span");
      span.textContent = n;
      span.style.cssText = `font-family:"rader";font-style:italic;font-size:3.5rem;text-transform:uppercase;flex-shrink:0;`;
      ticker.appendChild(span);
      if (i < allNames.length - 1) {
        const dot = document.createElement("span");
        dot.textContent = "✦";
        dot.style.cssText = `font-size:2rem;opacity:0.4;align-self:center;flex-shrink:0;`;
        ticker.appendChild(dot);
      }
    });
    tickerWrap.appendChild(ticker);

    const thanks = document.createElement("p");
    thanks.textContent = "A heartfelt thank you to Yoga Without Borders, EduGirls, Rainbow Kids Yoga, and Dau Dayal School — your trust, guidance, and open doors made this journey possible.";
    thanks.style.cssText = `max-width:560px;opacity:0.75;line-height:1.6;`;

    s.append(label, tickerWrap, thanks);
    s._els = { label, thanks };
  })();

  /* ── SCENE 14: Footer ── */
  (() => {
    const s = makeScene("scene-footer", "var(--fg)", "var(--bg)");
    s.style.cssText += `padding:3em;`;

    const inner = document.createElement("div");
    inner.style.cssText = `
      width:100%;height:100%;
      border-radius:2em;
      display:flex;flex-direction:column;
      justify-content:space-between;
      padding:3em;
    `;

    const title = document.createElement("h1");
    title.textContent = "Youth for Yoga";
    title.style.cssText = `font-size:clamp(3rem,8vw,7rem);text-align:center;`;

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:4em;justify-content:center;`;
    [
      ["Navigate", "Gallery", "About Us", "Get Involved"],
      ["Youth for Yoga", "A youth-led nonprofit bringing\nyoga to students worldwide.", "India Journey 2025"],
    ].forEach(col => {
      const c = document.createElement("div");
      c.style.cssText = `display:flex;flex-direction:column;gap:0.75em;`;
      col.forEach((text, i) => {
        const p = document.createElement("p");
        p.textContent = text;
        if (i > 0) p.style.opacity = "0.35";
        c.appendChild(p);
      });
      row.appendChild(c);
    });

    const social = document.createElement("div");
    social.style.cssText = `display:flex;gap:1.5em;justify-content:center;`;
    ["Instagram", "YouTube", "Website"].forEach(n => {
      const span = document.createElement("span");
      span.textContent = n;
      span.style.cssText = `font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em;opacity:0.4;`;
      social.appendChild(span);
    });

    const copy = document.createElement("div");
    copy.style.cssText = `display:flex;gap:2em;justify-content:center;`;
    ["2025", "//", "Youth for Yoga"].forEach(t => {
      const p = document.createElement("p");
      p.className = "mn";
      p.textContent = t;
      p.style.opacity = "0.5";
      copy.appendChild(p);
    });

    inner.append(title, row, social, copy);
    s.appendChild(inner);
    s._els = { title, row, social, copy };
  })();

  /* ══════════════════════════════════════════
     ELEMENTS
  ══════════════════════════════════════════ */
  const progressFill = document.querySelector(".vp-fill");
  const progressKnob = document.querySelector(".vp-knob");
  const playBtn      = document.querySelector(".vp-playbtn");
  const playIcon     = document.querySelector(".vp-icon-play");
  const pauseIcon    = document.querySelector(".vp-icon-pause");
  const replayBtn    = document.querySelector(".vp-replay");
  const timeEl       = document.querySelector(".vp-time");
  const timeTotalEl  = document.querySelector(".vp-time-total");
  const letterTop    = document.querySelector(".lb-top");
  const letterBottom = document.querySelector(".lb-bottom");
  const sceneLabel   = document.querySelector(".scene-label");
  const audioEl      = document.getElementById("music-audio");
  const hint         = document.getElementById("vp-hint");

  function formatTime(s) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }
  if (timeTotalEl) timeTotalEl.textContent = formatTime(TOTAL);

  /* ══════════════════════════════════════════
     MASTER TIMELINE
  ══════════════════════════════════════════ */
  const tl = gsap.timeline({
    paused: true,
    onUpdate() {
      const p = tl.progress();
      const t = tl.time();
      if (progressFill) progressFill.style.width = `${p * 100}%`;
      if (progressKnob) progressKnob.style.left  = `${p * 100}%`;
      if (timeEl) timeEl.textContent = formatTime(t);

      // update scene label
      let active = SCENES[0].label;
      for (const s of SCENES) { if (t >= s.start) active = s.label; }
      if (sceneLabel && sceneLabel.dataset.current !== active) {
        sceneLabel.dataset.current = active;
        gsap.to(sceneLabel, { opacity: 0, y: -5, duration: 0.15, onComplete() {
          sceneLabel.textContent = active;
          gsap.to(sceneLabel, { opacity: 1, y: 0, duration: 0.25 });
        }});
      }
    },
    onComplete() {
      setPlaying(false);
      if (replayBtn) replayBtn.style.display = "flex";
    },
  });

  /* letterbox open */
  tl.set([letterTop, letterBottom], { scaleY: 1 }, 0)
    .to([letterTop, letterBottom], { scaleY: 0, duration: 1.2, ease: "expo.out" }, 0.3);

  /* ── helper: cross-fade between scenes ── */
  function addScene(sceneIdx, enterDur = 0.8, holdThenExit = true) {
    const sc = SCENES[sceneIdx];
    const el = document.getElementById(sc.id);
    if (!el) return;

    const t = sc.start;
    const exitAt = t + sc.dur - 0.6;

    // fade in
    tl.to(el, { opacity: 1, duration: enterDur, ease: "power2.out" }, t);

    if (holdThenExit && sceneIdx < SCENES.length - 1) {
      tl.to(el, { opacity: 0, duration: 0.6, ease: "power2.in" }, exitAt);
    }
  }

  /* ── SCENE 0: Hero ── */
  {
    const sc = SCENES[0];
    const el = document.getElementById(sc.id);
    const { h1, h2, cap } = el._els;
    gsap.set([h1, h2, cap], { opacity: 0 });

    tl.to(el,  { opacity: 1, duration: 0.8, ease: "power2.out" }, sc.start)
      .to(h1,  { opacity: 1, x: 0, duration: 1.2, ease: "expo.out" }, sc.start + 0.3)
      .fromTo(h1, { x: "-15%" }, { x: "0%", duration: 1.2, ease: "expo.out" }, sc.start + 0.3)
      .fromTo(h2, { x: "15%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1.2, ease: "expo.out" }, sc.start + 0.5)
      .to(cap,   { opacity: 0.6, duration: 0.8 }, sc.start + 1.2)
      .to(el,    { opacity: 0, duration: 0.6, ease: "power2.in" }, sc.start + sc.dur - 0.6);
  }

  /* ── SCENE 1: Hero image ── */
  {
    const sc = SCENES[1];
    const el = document.getElementById(sc.id);
    const frame = el._frame;

    tl.to(el,    { opacity: 1, duration: 0.5 }, sc.start)
      .fromTo(frame, { scale: 0.3, rotation: -15, opacity: 0 },
                     { scale: 1,   rotation: 0,   opacity: 1, duration: 2.2, ease: "expo.out" }, sc.start + 0.1)
      .to(el, { opacity: 0, duration: 0.6 }, sc.start + sc.dur - 0.6);
  }

  /* ── SCENES 2-6: Mission ── */
  missionData.forEach((_, i) => {
    const sc = SCENES[2 + i];
    const el = document.getElementById(sc.id);
    const h  = el._h;
    const img = el._img;

    tl.to(el,  { opacity: 1, duration: 0.7, ease: "power2.out" }, sc.start)
      .fromTo(h,   { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, sc.start + 0.2)
      .fromTo(img, { scale: 1.08 }, { scale: 1, duration: sc.dur, ease: "none" }, sc.start)
      .to(el, { opacity: 0, duration: 0.6, ease: "power2.in" }, sc.start + sc.dur - 0.6);
  });

  /* ── SCENE 7: Services header ── */
  {
    const sc = SCENES[7];
    const el = document.getElementById(sc.id);
    const { logo, p, title1, title2 } = el._els;

    gsap.set([logo, p, title1, title2], { opacity: 0, y: 20 });
    tl.to(el,     { opacity: 1, duration: 0.7 }, sc.start)
      .to(logo,   { opacity: 1, y: 0, duration: 0.7 }, sc.start + 0.2)
      .to(p,      { opacity: 0.8, y: 0, duration: 0.7 }, sc.start + 0.5)
      .to(title1, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, sc.start + 0.9)
      .to(title2, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, sc.start + 1.2)
      .to(el, { opacity: 0, duration: 0.6 }, sc.start + sc.dur - 0.6);
  }

  /* ── SCENES 8-11: Cards ── */
  cardData.forEach((_, i) => {
    const sc = SCENES[8 + i];
    const el = document.getElementById(sc.id);
    const { num, h, body, tag, img } = el._els;

    gsap.set([num, h, body, tag], { opacity: 0, y: 25 });
    tl.to(el,   { opacity: 1, duration: 0.6 }, sc.start)
      .to(num,  { opacity: 0.4, y: 0, duration: 0.5 }, sc.start + 0.15)
      .to(h,    { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, sc.start + 0.3)
      .to(body, { opacity: 0.85, y: 0, duration: 0.7 }, sc.start + 0.6)
      .to(tag,  { opacity: 0.55, y: 0, duration: 0.6 }, sc.start + 0.9)
      .fromTo(img, { scale: 1.05 }, { scale: 1, duration: sc.dur + 0.6, ease: "none" }, sc.start)
      .to(el, { opacity: 0, duration: 0.6 }, sc.start + sc.dur - 0.6);
  });

  /* ── SCENE 12: Stats ── */
  {
    const sc = SCENES[12];
    const el = document.getElementById(sc.id);
    const { header, statEls } = el._els;

    gsap.set([header, ...statEls], { opacity: 0, y: 30 });
    tl.to(el,     { opacity: 1, duration: 0.7 }, sc.start)
      .to(header, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, sc.start + 0.2)
      .to(statEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "expo.out" }, sc.start + 0.6)
      .to(el, { opacity: 0, duration: 0.6 }, sc.start + sc.dur - 0.6);
  }

  /* ── SCENE 13: Partners ── */
  {
    const sc = SCENES[13];
    const el = document.getElementById(sc.id);
    const { label, thanks } = el._els;

    gsap.set([label, thanks], { opacity: 0, y: 20 });
    tl.to(el,     { opacity: 1, duration: 0.7 }, sc.start)
      .to(label,  { opacity: 0.6, y: 0, duration: 0.6 }, sc.start + 0.3)
      .to(thanks, { opacity: 0.75, y: 0, duration: 0.8 }, sc.start + 0.8)
      .to(el, { opacity: 0, duration: 0.6 }, sc.start + sc.dur - 0.6);
  }

  /* ── SCENE 14: Footer (no exit) ── */
  {
    const sc = SCENES[14];
    const el = document.getElementById(sc.id);
    const { title, row, social, copy } = el._els;

    gsap.set([title, row, social, copy], { opacity: 0, y: 20 });
    tl.to(el,     { opacity: 1, duration: 0.8 }, sc.start)
      .to(title,  { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, sc.start + 0.3)
      .to(row,    { opacity: 1, y: 0, duration: 0.9 }, sc.start + 0.8)
      .to(social, { opacity: 1, y: 0, duration: 0.7 }, sc.start + 1.2)
      .to(copy,   { opacity: 1, y: 0, duration: 0.6 }, sc.start + 1.5);
  }

  /* letterbox close at end */
  tl.to([letterTop, letterBottom], { scaleY: 1, duration: 1, ease: "expo.in" }, TOTAL - 1.5);

  /* ══════════════════════════════════════════
     PLAYBACK CONTROLS
  ══════════════════════════════════════════ */
  let playing = false;

  function setPlaying(val) {
    playing = val;
    if (playIcon)  playIcon.style.display  = playing ? "none"  : "block";
    if (pauseIcon) pauseIcon.style.display = playing ? "block" : "none";
    if (playing) {
      tl.play();
      if (audioEl) audioEl.play().catch(() => {});
    } else {
      tl.pause();
      if (audioEl) audioEl.pause();
    }
  }

  function syncAudio() {
    if (!audioEl || !audioEl.duration) return;
    audioEl.currentTime = tl.time() % audioEl.duration;
  }

  function firstPlay() {
    if (hint) hint.classList.add("hidden");
    if (!playing) { syncAudio(); setPlaying(true); }
    document.removeEventListener("click", firstPlay);
    document.removeEventListener("keydown", firstPlay);
  }
  document.addEventListener("click", firstPlay);
  document.addEventListener("keydown", (e) => { if (e.code !== "Space") firstPlay(); });

  if (playBtn) playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (playing) setPlaying(false);
    else { syncAudio(); setPlaying(true); }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (playing) setPlaying(false); else { syncAudio(); setPlaying(true); }
    }
    if (e.code === "ArrowRight") { tl.time(Math.min(tl.time() + 5, TOTAL)); syncAudio(); }
    if (e.code === "ArrowLeft")  { tl.time(Math.max(tl.time() - 5, 0)); syncAudio(); }
  });

  /* progress bar scrubbing */
  const track = document.querySelector(".vp-track");
  let scrubbing = false;

  function scrubTo(clientX) {
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    tl.progress(ratio);
    syncAudio();
  }

  if (track) {
    track.addEventListener("mousedown", (e) => { scrubbing = true; scrubTo(e.clientX); setPlaying(false); });
    document.addEventListener("mousemove", (e) => { if (scrubbing) scrubTo(e.clientX); });
    document.addEventListener("mouseup", () => { if (scrubbing) { scrubbing = false; setPlaying(true); } });
    track.addEventListener("touchstart", (e) => { scrubbing = true; scrubTo(e.touches[0].clientX); }, { passive: true });
    document.addEventListener("touchmove", (e) => { if (scrubbing) scrubTo(e.touches[0].clientX); }, { passive: true });
    document.addEventListener("touchend", () => { if (scrubbing) { scrubbing = false; setPlaying(true); } });
  }

  if (replayBtn) replayBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    replayBtn.style.display = "none";
    tl.seek(0);
    syncAudio();
    setPlaying(true);
  });

  /* start hero image cycling now */
  startHeroCycle();
});
