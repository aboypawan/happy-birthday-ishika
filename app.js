(() => {
  const C = CONFIG;
  const $ = (s) => document.querySelector(s);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const safe = (fn) => { try { return fn(); } catch { return null; } };

  // ---------- Fill text from config ----------
  document.title = `Happy Birthday ${C.name} 🎂`;
  $("#nameBig").textContent = C.name;
  $("#footName").textContent = C.name;
  $("#modalName").textContent = C.name;
  $("#tagline").textContent = C.tagline;
  $("#heroLine").textContent = C.heroLine;
  $("#giftText").textContent = C.giftMessage;
  $("#sig").textContent = C.signature;
  if (C.photo) $("#avatar").innerHTML = `<img src="${C.photo}" alt="${C.name}">`;

  // ---------- Floating emojis ----------
  const fl = $("#floaters");
  const set = ["🎈", "🍰", "🍫", "⭐", "🎉", "🍭", "💖", "🧁"];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("span");
    s.textContent = set[i % set.length];
    s.style.left = rnd(0, 100) + "%";
    s.style.animationDuration = rnd(9, 18) + "s";
    s.style.animationDelay = -rnd(0, 18) + "s";
    s.style.fontSize = rnd(20, 38) + "px";
    fl.appendChild(s);
  }

  // ---------- Confetti ----------
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  let parts = [], raf = null;
  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
  addEventListener("resize", resize); resize();
  const colors = ["#e8262b", "#2b7bff", "#ffd400", "#22c55e", "#ff5a8a", "#fff"];
  function burst(x = innerWidth / 2, y = innerHeight / 3, n = 120) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), v = rnd(4, 15);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, w: rnd(6, 12), h: rnd(4, 8),
        r: rnd(0, 6), vr: rnd(-.3, .3), c: colors[(Math.random() * colors.length) | 0], life: rnd(90, 160) });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.life > 0 && p.y < cv.height + 30);
    for (const p of parts) {
      p.vy += .3; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.min(1, p.life / 30); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : null;
  }
  const party = () => { burst(innerWidth * .2, innerHeight * .5); burst(innerWidth * .8, innerHeight * .5);
    setTimeout(() => burst(innerWidth / 2, innerHeight * .3, 160), 250); };
  $("#partyBtn").onclick = party;

  // ---------- Music (WebAudio Happy Birthday, no mp3 needed) ----------
  const N = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784 };
  const song = [["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],
    ["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
    ["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",1],
    ["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
  let ac = null, playing = false, timer = null;
  function playSong() {
    if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume();
    let t = ac.currentTime + .1; const beat = .42;
    for (const [n, d] of song) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "triangle"; o.frequency.value = N[n];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22, t + .02);
      g.gain.exponentialRampToValueAtTime(.001, t + d * beat);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d * beat + .05);
      t += d * beat;
    }
    timer = setTimeout(() => playing && playSong(), (t - ac.currentTime + 1) * 1000);
  }
  const song_mp3 = new Audio("assets/birthday-song.mp3"); song_mp3.loop = true; song_mp3.preload = "none";
  $("#musicBtn").onclick = () => {
    playing = !playing; clearTimeout(timer);
    $("#musicBtn").textContent = playing ? "🔊 Music" : "🔇 Music";
    if (!playing) return song_mp3.pause();
    song_mp3.play().catch(() => playSong());   // mp3 na chale to chiptune
  };

  // ---------- Birthday wale din auto confetti ----------
  { const n = new Date(); if (n.getDate() === C.day && n.getMonth() === C.month - 1) setTimeout(party, 900); }

  // ---------- Title: letter-by-letter jump ----------
  document.querySelectorAll(".title span").forEach((el, row) => {
    const txt = el.textContent; el.textContent = "";
    [...txt].forEach((ch, i) => {
      const s = document.createElement("i"); s.textContent = ch; s.className = "ltr";
      s.style.animationDelay = (row * 0.5 + i * 0.07) + "s, " + (2 + row * .3 + i * 0.12) + "s";
      el.appendChild(s);
    });
  });

  // ---------- Rising balloons ----------
  const bl = $("#balloons"), bc = ["#e8262b", "#2b7bff", "#22c55e", "#ff5a8a", "#ffd400", "#8b5cf6"];
  for (let i = 0; i < 9; i++) {
    const b = document.createElement("div"); b.className = "balloon";
    b.style.left = rnd(2, 92) + "%"; b.style.background = bc[i % bc.length];
    b.style.animationDuration = rnd(10, 18) + "s, " + rnd(2, 4) + "s";
    b.style.animationDelay = -rnd(0, 14) + "s, 0s";
    bl.appendChild(b);
  }

  // ---------- Star trail on touch / mouse move ----------
  let lastT = 0;
  const trail = (x, y) => {
    const now = performance.now(); if (now - lastT < 70) return; lastT = now;
    const s = document.createElement("span"); s.className = "spark"; s.textContent = ["⭐", "✨", "💖", "🍫"][(Math.random() * 4) | 0];
    s.style.left = x + "px"; s.style.top = y + "px"; document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  };
  addEventListener("pointermove", (e) => trail(e.clientX, e.clientY), { passive: true });
  addEventListener("pointerdown", (e) => { if (!e.target.closest("button,a,input,textarea")) burst(e.clientX, e.clientY, 25); });

  // ---------- Scroll reveal ----------
  const rv = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("show"); rv.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".panel, footer").forEach((el) => { el.classList.add("reveal"); rv.observe(el); });

  // ---------- Runaway gift button ----------
  const btn = $("#runBtn"), arena = $("#arena"), taunt = $("#taunt");
  const taunts = ["Haha, pakad ke dikhao! 😜", "Itni slow? 🐌", "Oho, almost! 😏", "Mujhe toh pakad hi nahi sakti! 🤪",
    "Thodi aur koshish... 🏃", "Chocolate khaogi toh tez bhaagogi 🍫", "Ek aur baar! 😈"];
  let tries = 0, caught = false;
  function dodge(e) {
    if (caught) return;
    e.preventDefault();
    tries++;
    if (tries > 6) {
      caught = true; btn.textContent = "Chalo pakad lo 😇"; taunt.textContent = "Thak gayi main! Ab click karo 👇";
      return;
    }
    const w = arena.clientWidth - btn.offsetWidth, h = arena.clientHeight - btn.offsetHeight;
    btn.style.left = rnd(btn.offsetWidth / 2, w + btn.offsetWidth / 2) + "px";
    btn.style.top = rnd(btn.offsetHeight / 2, h + btn.offsetHeight / 2) + "px";
    taunt.textContent = taunts[(Math.random() * taunts.length) | 0];
  }
  btn.addEventListener("pointerenter", dodge);
  btn.addEventListener("pointerdown", dodge);
  btn.addEventListener("click", () => {
    if (!caught) return;
    $("#modal").hidden = false; party();
  });
  $("#closeModal").onclick = () => ($("#modal").hidden = true);
  $("#modal").onclick = (e) => { if (e.target.id === "modal") $("#modal").hidden = true; };

  // ---------- Cake ----------
  const NC = 5, candles = $("#candles"), svg = $("#cakeSvg"), status = $("#cakeStatus");
  const cols = ["#e8262b", "#2b7bff", "#22c55e", "#ff5a8a", "#8b5cf6"];
  const xs = [95, 128, 160, 192, 225];
  xs.forEach((x, i) => {
    const y = 150, g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "candle"); g.dataset.i = i;
    g.innerHTML = `<rect class="candle-body" x="${x - 6}" y="${y - 44}" width="12" height="44" rx="3" fill="${cols[i]}"/>
      <path class="flame" d="M${x} ${y - 48} q-11 -16 0 -34 q11 18 0 34z" fill="#ffb300" stroke="#111" stroke-width="3"/>
      <path class="flame" d="M${x} ${y - 48} q-5 -8 0 -18 q5 10 0 18z" fill="#fff59d"/>
      <path class="smoke" d="M${x} ${y - 50} q-8 -10 0 -20 q8 -10 0 -20"/>
      <rect x="${x - 18}" y="${y - 90}" width="36" height="100" fill="transparent"/>`;
    candles.appendChild(g);
  });
  const cs = [...candles.children];
  const litCount = () => cs.filter((c) => !c.classList.contains("out")).length;
  function blow(c) {
    if (c.classList.contains("out")) return;
    c.classList.add("out");
    const left = litCount();
    if (left === 0) {
      status.textContent = `Yeeeay! Wish maang li na ${C.name}? 🎉 Ab cake meri taraf bhi bhejo! 🍰`;
      party(); setTimeout(() => ($("#modal").hidden = false), 1200);
    } else status.textContent = `${left} candle${left > 1 ? "s" : ""} baaki... 💨`;
  }
  cs.forEach((c) => c.addEventListener("click", () => blow(c)));
  $("#relightBtn").onclick = () => { cs.forEach((c) => c.classList.remove("out")); status.textContent = "Candles jal rahi hain... 🔥"; };

  // blow by mic, else blow one-by-one
  let micOn = false;
  async function listen() {
    if (micOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const a = new (window.AudioContext || window.webkitAudioContext)();
      const src = a.createMediaStreamSource(stream), an = a.createAnalyser();
      an.fftSize = 512; src.connect(an); micOn = true;
      const buf = new Uint8Array(an.frequencyBinCount);
      status.textContent = "Mic ON! Ab zor se phoonk maaro 💨";
      let hot = 0;
      (function loop() {
        an.getByteTimeDomainData(buf);
        let sum = 0; for (const v of buf) sum += (v - 128) ** 2;
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 22) { hot++; if (hot > 3) { const lit = cs.filter((c) => !c.classList.contains("out")); lit.forEach((c, i) => setTimeout(() => blow(c), i * 160)); hot = 0; } } else hot = 0;
        requestAnimationFrame(loop);
      })();
    } catch { status.textContent = "Mic nahi mila — candles pe tap karo ya button dabao 👆"; blowOne(); }
  }
  function blowOne() { const c = cs.find((c) => !c.classList.contains("out")); if (c) blow(c); }
  $("#blowBtn").onclick = () => { if (!micOn && safe(() => navigator.mediaDevices.getUserMedia)) listen(); else blowOne(); };

  // ---------- Meters ----------
  const mEl = $("#meters");
  C.meters.forEach((m) => {
    const d = document.createElement("div");
    d.className = "meter" + (m.value > 100 ? " over" : "");
    d.innerHTML = `<div class="row"><span>${m.icon} ${m.label}</span><span>${m.value}%</span></div><div class="bar"><i data-v="${Math.min(m.value, 100)}"></i></div>`;
    mEl.appendChild(d);
  });
  new IntersectionObserver((es, o) => es.forEach((e) => {
    if (e.isIntersecting) { mEl.querySelectorAll("i").forEach((i) => (i.style.width = i.dataset.v + "%")); o.disconnect(); }
  }), { threshold: .3 }).observe(mEl);

  // ---------- Wishes (browser mein save hoti hain) ----------
  const KEY = "ishika-wishes-v1", wall = $("#wall");
  const load = () => safe(() => JSON.parse(localStorage.getItem(KEY))) || [];
  const save = (a) => safe(() => localStorage.setItem(KEY, JSON.stringify(a)));
  let icon = "🎈";
  const iconSet = ["🎈", "🍰", "🍫", "💖", "😜", "⭐", "🎉", "🦄"];
  const iw = $("#icons");
  iconSet.forEach((ic) => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = ic;
    if (ic === icon) b.className = "on";
    b.onclick = () => { icon = ic; iw.querySelectorAll("button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); };
    iw.appendChild(b);
  });
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function render() {
    const mine = load();
    wall.innerHTML = "";
    [...mine.map((w, i) => ({ ...w, mine: i })), ...C.wishes].forEach((w) => {
      const n = document.createElement("div"); n.className = "note";
      n.innerHTML = `${w.mine !== undefined ? '<button class="x" title="Delete">✖</button>' : ""}<div class="who"><span>${esc(w.icon)}</span>${esc(w.name)}</div><p>${esc(w.msg)}</p>`;
      if (w.mine !== undefined) n.querySelector(".x").onclick = () => { const a = load(); a.splice(w.mine, 1); save(a); render(); };
      wall.appendChild(n);
    });
  }
  $("#wishForm").onsubmit = (e) => {
    e.preventDefault();
    const a = load(); a.unshift({ name: $("#wName").value.trim(), msg: $("#wMsg").value.trim(), icon });
    save(a); e.target.reset(); render(); burst(innerWidth / 2, innerHeight * .6, 70);
  };
  render();
})();
