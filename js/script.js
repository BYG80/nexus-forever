document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    }));
  }

  const top = document.querySelector(".back-top");
  if (top) {
    window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 450), { passive: true });
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* NEXUS MUSIC
     El navegador no permite mantener el mismo elemento <audio> entre páginas.
     Guardamos la posición para que la siguiente página continúe desde el mismo punto.
  */
  const musicSrc = "./audio/nexus-ambient.mp3";
  const POSITION_KEY = "nexusMusicTime";
  const ENABLED_KEY = "nexusMusicEnabled";
  const MUTED_KEY = "nexusMusicMuted";
  const VOLUME_KEY = "nexusMusicVolume";

  const audio = document.createElement("audio");
  audio.id = "nexus-music";
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = Number(localStorage.getItem(VOLUME_KEY) || 0.18);
  audio.src = musicSrc;
  document.body.appendChild(audio);

  const player = document.createElement("div");
  player.className = "music-player";
  player.innerHTML = `
    <button class="music-main" type="button" aria-label="Activar música" aria-pressed="false">
      <span class="music-icon">♫</span>
      <span class="music-copy"><strong>NEXUS MUSIC</strong><small>Ambiente de Azeroth</small></span>
      <span class="music-state">OFF</span>
    </button>
    <div class="music-controls">
      <button class="music-mute" type="button" aria-label="Silenciar">🔊</button>
      <input class="music-volume" type="range" min="0" max="100" value="18" aria-label="Volumen">
    </div>`;
  document.body.appendChild(player);

  const main = player.querySelector(".music-main");
  const state = player.querySelector(".music-state");
  const mute = player.querySelector(".music-mute");
  const volume = player.querySelector(".music-volume");

  let enabled = localStorage.getItem(ENABLED_KEY) === "true";
  let muted = localStorage.getItem(MUTED_KEY) === "true";

  volume.value = Math.round(audio.volume * 100);
  audio.muted = muted;

  audio.addEventListener("loadedmetadata", () => {
    const savedTime = Number(localStorage.getItem(POSITION_KEY) || 0);
    if (savedTime > 0 && Number.isFinite(savedTime) && savedTime < audio.duration) {
      try { audio.currentTime = savedTime; } catch (_) {}
    }
  }, { once: true });

  function savePosition() {
    if (Number.isFinite(audio.currentTime) && audio.currentTime > 0) {
      localStorage.setItem(POSITION_KEY, String(audio.currentTime));
    }
  }

  function paint() {
    const playing = !audio.paused && !audio.muted;
    player.classList.toggle("is-playing", playing);
    state.textContent = playing ? "ON" : "OFF";
    mute.textContent = audio.muted || audio.volume === 0 ? "🔇" : "🔊";
    main.setAttribute("aria-label", playing ? "Pausar música" : "Activar música");
    main.setAttribute("aria-pressed", String(playing));
  }

  async function startMusic() {
    enabled = true;
    muted = false;
    audio.muted = false;
    localStorage.setItem(ENABLED_KEY, "true");
    localStorage.setItem(MUTED_KEY, "false");
    try { await audio.play(); } catch (_) {}
    paint();
  }

  main.addEventListener("click", async () => {
    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();
      enabled = false;
      localStorage.setItem(ENABLED_KEY, "false");
      savePosition();
      paint();
    }
  });

  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muted = audio.muted;
    localStorage.setItem(MUTED_KEY, String(muted));
    if (!audio.muted && audio.paused) startMusic();
    paint();
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value) / 100;
    localStorage.setItem(VOLUME_KEY, String(audio.volume));
    if (audio.volume > 0 && audio.muted) {
      audio.muted = false;
      localStorage.setItem(MUTED_KEY, "false");
    }
    paint();
  });

  audio.addEventListener("play", paint);
  audio.addEventListener("pause", () => { savePosition(); paint(); });
  audio.addEventListener("timeupdate", () => {
    if (!audio.paused && Math.floor(audio.currentTime) % 5 === 0) savePosition();
  });

  window.addEventListener("pagehide", savePosition);
  window.addEventListener("beforeunload", savePosition);

  paint();

  // Reanudar en la siguiente página si el visitante ya había activado la música.
  if (enabled && !muted) {
    audio.play().catch(() => {
      // El navegador puede exigir una interacción del usuario.
    });
  }
});
