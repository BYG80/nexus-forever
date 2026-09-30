document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  /* =========================
     MENÚ MÓVIL
     ========================= */

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Cerrar menú" : "Abrir menú"
      );
    });

    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");

        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  /* =========================
     BOTÓN VOLVER ARRIBA
     ========================= */

  const top = document.querySelector(".back-top");

  if (top) {
    window.addEventListener(
      "scroll",
      () => {
        top.classList.toggle("show", window.scrollY > 450);
      },
      { passive: true }
    );

    top.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* =========================
     NEXUS MUSIC
     ========================= */

  const musicSrc = "./audio/nexus-ambient.mp3";

  const POSITION_KEY = "nexusMusicTime";
  const ENABLED_KEY = "nexusMusicEnabled";
  const MUTED_KEY = "nexusMusicMuted";
  const VOLUME_KEY = "nexusMusicVolume";

  /* -------------------------
     AUDIO
     ------------------------- */

  const audio = document.createElement("audio");

  audio.id = "nexus-music";
  audio.loop = true;
  audio.preload = "auto";
  audio.src = musicSrc;

  /* Volumen guardado */
  const savedVolume = Number(
    localStorage.getItem(VOLUME_KEY)
  );

  audio.volume =
    Number.isFinite(savedVolume) && savedVolume >= 0
      ? savedVolume
      : 0.18;

  document.body.appendChild(audio);

  /* -------------------------
     REPRODUCTOR
     ------------------------- */

  const player = document.createElement("div");

  player.className = "music-player";

  player.innerHTML = `
    <button
      class="music-main"
      type="button"
      aria-label="Activar música"
      aria-pressed="false"
    >
      <span class="music-icon">♫</span>

      <span class="music-copy">
        <strong>NEXUS MUSIC</strong>
        <small>Ambiente de Azeroth</small>
      </span>

      <span class="music-state">OFF</span>
    </button>

    <div class="music-controls">
      <button
        class="music-mute"
        type="button"
        aria-label="Silenciar"
      >
        🔊
      </button>

      <input
        class="music-volume"
        type="range"
        min="0"
        max="100"
        value="${Math.round(audio.volume * 100)}"
        aria-label="Volumen"
      />
    </div>
  `;

  document.body.appendChild(player);

  const main = player.querySelector(".music-main");
  const state = player.querySelector(".music-state");
  const mute = player.querySelector(".music-mute");
  const volume = player.querySelector(".music-volume");

  /* -------------------------
     ESTADO
     ------------------------- */

  /*
     IMPORTANTE:

     La música empieza configurada como ON.

     Si el usuario ya había interactuado anteriormente
     y había dejado la música activada, se mantiene.

     Si nunca había utilizado el reproductor,
     también intentaremos reproducir automáticamente.
  */

  let enabled;

  const storedEnabled = localStorage.getItem(ENABLED_KEY);

  if (storedEnabled === null) {
    enabled = true;

    localStorage.setItem(
      ENABLED_KEY,
      "true"
    );
  } else {
    enabled = storedEnabled === "true";
  }

  let muted =
    localStorage.getItem(MUTED_KEY) === "true";

  /*
     Si nunca se había guardado el estado de mute,
     empezamos sin mute.
  */

  if (localStorage.getItem(MUTED_KEY) === null) {
    muted = false;

    localStorage.setItem(
      MUTED_KEY,
      "false"
    );
  }

  audio.muted = muted;

  volume.value = Math.round(audio.volume * 100);

  /* -------------------------
     RECUPERAR POSICIÓN
     ------------------------- */

  audio.addEventListener(
    "loadedmetadata",
    () => {
      const savedTime = Number(
        localStorage.getItem(POSITION_KEY) || 0
      );

      if (
        savedTime > 0 &&
        Number.isFinite(savedTime) &&
        Number.isFinite(audio.duration) &&
        savedTime < audio.duration
      ) {
        try {
          audio.currentTime = savedTime;
        } catch (_) {}
      }

      /*
         Una vez cargada la posición,
         intentamos reproducir.
      */

      if (enabled && !muted) {
        tryStartMusic();
      }
    },
    { once: true }
  );

  /* =========================
     GUARDAR POSICIÓN
     ========================= */

  function savePosition() {
    if (
      Number.isFinite(audio.currentTime) &&
      audio.currentTime > 0
    ) {
      localStorage.setItem(
        POSITION_KEY,
        String(audio.currentTime)
      );
    }
  }

  /* =========================
     ACTUALIZAR INTERFAZ
     ========================= */

  function paint() {
    const playing =
      !audio.paused &&
      !audio.muted;

    player.classList.toggle(
      "is-playing",
      playing
    );

    state.textContent = playing
      ? "ON"
      : "OFF";

    mute.textContent =
      audio.muted ||
      audio.volume === 0
        ? "🔇"
        : "🔊";

    main.setAttribute(
      "aria-label",
      playing
        ? "Pausar música"
        : "Activar música"
    );

    main.setAttribute(
      "aria-pressed",
      String(playing)
    );
  }

  /* =========================
     INTENTAR REPRODUCIR
     ========================= */

  async function tryStartMusic() {
    if (!enabled || muted) {
      paint();
      return false;
    }

    try {
      await audio.play();

      paint();

      return true;
    } catch (_) {
      /*
         El navegador ha bloqueado el autoplay.

         No hacemos nada aquí.
         Esperaremos a la primera interacción
         del usuario.
      */

      paint();

      return false;
    }
  }

  /* =========================
     ACTIVAR MÚSICA
     ========================= */

  async function startMusic() {
    enabled = true;
    muted = false;

    audio.muted = false;

    localStorage.setItem(
      ENABLED_KEY,
      "true"
    );

    localStorage.setItem(
      MUTED_KEY,
      "false"
    );

    try {
      await audio.play();
    } catch (_) {}

    paint();
  }

  /* =========================
     BOTÓN PRINCIPAL
     ========================= */

  main.addEventListener(
    "click",
    async () => {
      if (audio.paused) {
        await startMusic();
      } else {
        audio.pause();

        enabled = false;

        localStorage.setItem(
          ENABLED_KEY,
          "false"
        );

        savePosition();

        paint();
      }
    }
  );

  /* =========================
     MUTE
     ========================= */

  mute.addEventListener(
    "click",
    () => {
      audio.muted = !audio.muted;

      muted = audio.muted;

      localStorage.setItem(
        MUTED_KEY,
        String(muted)
      );

      /*
         Si quitamos el mute y la música estaba parada,
         intentamos arrancarla.
      */

      if (!audio.muted && audio.paused) {
        enabled = true;

        localStorage.setItem(
          ENABLED_KEY,
          "true"
        );

        tryStartMusic();
      }

      paint();
    }
  );

  /* =========================
     VOLUMEN
     ========================= */

  volume.addEventListener(
    "input",
    () => {
      audio.volume =
        Number(volume.value) / 100;

      localStorage.setItem(
        VOLUME_KEY,
        String(audio.volume)
      );

      /*
         Si subimos el volumen estando en mute,
         quitamos el mute automáticamente.
      */

      if (
        audio.volume > 0 &&
        audio.muted
      ) {
        audio.muted = false;
        muted = false;

        localStorage.setItem(
          MUTED_KEY,
          "false"
        );
      }

      paint();
    }
  );

  /* =========================
     EVENTOS DEL AUDIO
     ========================= */

  audio.addEventListener(
    "play",
    () => {
      paint();
    }
  );

  audio.addEventListener(
    "pause",
    () => {
      savePosition();
      paint();
    }
  );

  audio.addEventListener(
    "timeupdate",
    () => {
      /*
         Guardamos aproximadamente cada 5 segundos.
      */

      if (
        !audio.paused &&
        Math.floor(audio.currentTime) % 5 === 0
      ) {
        savePosition();
      }
    }
  );

  /* =========================
     CAMBIO DE PÁGINA
     ========================= */

  window.addEventListener(
    "pagehide",
    savePosition
  );

  window.addEventListener(
    "beforeunload",
    savePosition
  );

  /* =========================
     AUTOPLAY
     ========================= */

  paint();

  /*
     Primer intento de reproducción automática.
  */

  if (enabled && !muted) {
    tryStartMusic();
  }

  /* =========================
     PRIMERA INTERACCIÓN
     =========================

     Si el navegador bloqueó el autoplay,
     cualquier interacción del usuario
     permitirá iniciar la música.

     Solo se utiliza una vez.
  */

  let interactionStarted = false;

  async function firstInteraction() {
    if (interactionStarted) return;

    interactionStarted = true;

    if (
      enabled &&
      !muted &&
      audio.paused
    ) {
      await startMusic();
    }

    removeInteractionListeners();
  }

  function removeInteractionListeners() {
    document.removeEventListener(
      "click",
      firstInteraction
    );

    document.removeEventListener(
      "pointerdown",
      firstInteraction
    );

    document.removeEventListener(
      "keydown",
      firstInteraction
    );

    document.removeEventListener(
      "touchstart",
      firstInteraction
    );

    document.removeEventListener(
      "scroll",
      firstInteraction
    );
  }

  document.addEventListener(
    "click",
    firstInteraction,
    { passive: true }
  );

  document.addEventListener(
    "pointerdown",
    firstInteraction,
    { passive: true }
  );

  document.addEventListener(
    "keydown",
    firstInteraction,
    { passive: true }
  );

  document.addEventListener(
    "touchstart",
    firstInteraction,
    { passive: true }
  );

  document.addEventListener(
    "scroll",
    firstInteraction,
    {
      passive: true,
      once: true
    }
  );
});
