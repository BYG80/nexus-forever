document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle) toggle.addEventListener("click", () => links.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));

  const top = document.querySelector(".back-top");
  if (top) {
    window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 450));
    top.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
  }

  // NEXUS ambient music player
  const musicSrc = "./audio/nexus-ambient.mp3";
  const audio = document.createElement("audio");
  audio.id = "nexus-music";
  audio.loop = true;
  audio.preload = "metadata";
  audio.volume = Number(localStorage.getItem("nexusMusicVolume") || 0.18);
  audio.src = musicSrc;
  document.body.appendChild(audio);

  const player = document.createElement("div");
  player.className = "music-player";
  player.innerHTML = `
    <button class="music-main" type="button" aria-label="Activar música">
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
  let enabled = localStorage.getItem("nexusMusicEnabled") === "true";
  let muted = localStorage.getItem("nexusMusicMuted") === "true";

  volume.value = Math.round(audio.volume * 100);
  audio.muted = muted;

  function paint() {
    const playing = !audio.paused && !audio.muted;
    player.classList.toggle("is-playing", playing);
    state.textContent = playing ? "ON" : "OFF";
    mute.textContent = audio.muted || audio.volume === 0 ? "🔇" : "🔊";
    main.setAttribute("aria-label", playing ? "Pausar música" : "Activar música");
  }

  async function startMusic() {
    enabled = true;
    muted = false;
    audio.muted = false;
    localStorage.setItem("nexusMusicEnabled", "true");
    localStorage.setItem("nexusMusicMuted", "false");
    try { await audio.play(); } catch (_) {}
    paint();
  }

  main.addEventListener("click", async () => {
    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();
      enabled = false;
      localStorage.setItem("nexusMusicEnabled", "false");
      paint();
    }
  });

  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muted = audio.muted;
    localStorage.setItem("nexusMusicMuted", String(muted));
    if (!audio.muted && audio.paused) startMusic();
    paint();
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value) / 100;
    localStorage.setItem("nexusMusicVolume", String(audio.volume));
    if (audio.volume > 0 && audio.muted) {
      audio.muted = false;
      localStorage.setItem("nexusMusicMuted", "false");
    }
    paint();
  });

  audio.addEventListener("play", paint);
  audio.addEventListener("pause", paint);
  paint();

  // Browsers normally block unrequested audio autoplay. If the visitor
  // previously enabled NEXUS MUSIC, try to resume it on the next page.
  if (enabled && !muted) {
    audio.play().catch(() => {
      // A user gesture may still be required on this page.
    });
  }
});
