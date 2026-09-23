/* =========================================================
   NEXUS — GALERÍA
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  const DEFAULT_IMAGES = [
    {
      src: "./img/galeria/nexus-raids.svg",
      title: "Noches de Raid",
      cat: "Raids",
      desc: "Momentos de progresión de NEXUS"
    },
    {
      src: "./img/galeria/Azeroth01.jpg",
      title: "Explorando Azeroth",
      cat: "Azeroth",
      desc: "Aventuras y exploración"
    },
    {
      src: "./img/galeria/Azeroth02.jpg",
      title: "Explorando Azeroth",
      cat: "Azeroth",
      desc: "Aventuras y exploración"
    },
    {
      src: "./img/galeria/nexus-pvp.svg",
      title: "Honor y combate",
      cat: "PvP",
      desc: "Actividades PvP de la hermandad"
    },
    {
      src: "./img/galeria/nexus-community.svg",
      title: "Juntos en Forever",
      cat: "Comunidad",
      desc: "La comunidad por encima de todo"
    }
  ];


  /* =======================================================
     VARIABLES
     ======================================================= */

  let images = [];
  let filter = "Todas";
  let index = 0;

  const slider = document.getElementById("gallerySlider");
  const dots = document.getElementById("galleryDots");
  const thumbs = document.getElementById("galleryThumbs");
  const filters = document.getElementById("galleryFilters");

  const prevButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");


  /* =======================================================
     COMPROBAR ELEMENTOS
     ======================================================= */

  if (!slider || !dots || !thumbs || !filters || !prevButton || !nextButton) {
    console.warn("NEXUS Gallery: faltan elementos necesarios en galeria.html.");
    return;
  }


  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function esc(value) {

    return String(value || "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char])
    );

  }


  /* =======================================================
     IMÁGENES VISIBLES
     ======================================================= */

  function visibleImages() {

    return images.filter(
      image => filter === "Todas" || image.cat === filter
    );

  }


  /* =======================================================
     FILTROS
     ======================================================= */

  function renderFilters() {

    const categories = [
      "Todas",
      ...new Set(
        images
          .map(image => image.cat)
          .filter(Boolean)
      )
    ];

    filters.innerHTML = "";

    categories.forEach(category => {

      const button = document.createElement("button");

      button.className =
        "filter-btn" +
        (category === filter ? " active" : "");

      button.type = "button";
      button.textContent = category;

      button.setAttribute(
        "aria-pressed",
        category === filter ? "true" : "false"
      );

      button.addEventListener("click", () => {

        filter = category;
        index = 0;

        render();

      });

      filters.appendChild(button);

    });

  }


  /* =======================================================
     RENDER PRINCIPAL
     ======================================================= */

  function render() {

    renderFilters();

    const currentImages = visibleImages();

    if (index >= currentImages.length) {
      index = 0;
    }

    /* Eliminar slides anteriores */

    slider
      .querySelectorAll(".gallery-slide")
      .forEach(slide => slide.remove());

    /* Limpiar puntos y miniaturas */

    dots.innerHTML = "";
    thumbs.innerHTML = "";


    /* =====================================================
       SIN IMÁGENES
       ===================================================== */

    if (!currentImages.length) {

      const emptyMessage = document.createElement("p");

      emptyMessage.className = "muted";
      emptyMessage.textContent = "No hay imágenes disponibles.";

      slider.insertBefore(emptyMessage, prevButton);

      slider.append(prevButton, nextButton);

      prevButton.disabled = true;
      nextButton.disabled = true;

      return;
    }


    prevButton.disabled = false;
    nextButton.disabled = false;


    /* =====================================================
       CREAR SLIDES
       ===================================================== */

    currentImages.forEach((image, i) => {

      const slide = document.createElement("div");

      slide.className =
        "gallery-slide" +
        (i === index ? " active" : "");

      slide.setAttribute("aria-hidden", i === index ? "false" : "true");


      const img = document.createElement("img");

      img.src = image.src;
      img.alt = image.title || "Imagen de NEXUS";
      img.loading = i === index ? "eager" : "lazy";
      img.decoding = "async";


      const caption = document.createElement("div");

      caption.className = "gallery-caption";


      const title = document.createElement("strong");

      title.textContent =
        image.title || "Galería NEXUS";


      const description = document.createElement("span");

      description.textContent =
        image.desc || image.cat || "";


      caption.append(title, description);

      slide.append(img, caption);

      slider.insertBefore(slide, prevButton);


      /* ===================================================
         PUNTO
         =================================================== */

      const dot = document.createElement("button");

      dot.type = "button";
      dot.className =
        "gallery-dot" +
        (i === index ? " active" : "");

      dot.setAttribute(
        "aria-label",
        `Mostrar imagen ${i + 1}: ${image.title || ""}`
      );

      dot.setAttribute(
        "aria-current",
        i === index ? "true" : "false"
      );

      dot.addEventListener("click", () => {

        index = i;
        render();

      });

      dots.appendChild(dot);


      /* ===================================================
         MINIATURA
         =================================================== */

      const thumbnail = document.createElement("button");

      thumbnail.type = "button";
      thumbnail.className = "gallery-thumb";

      thumbnail.setAttribute(
        "aria-label",
        `Ver ${image.title || "imagen"}`
      );

      thumbnail.setAttribute(
        "aria-current",
        i === index ? "true" : "false"
      );


      const thumbnailImage = document.createElement("img");

      thumbnailImage.src = image.src;
      thumbnailImage.alt = "";
      thumbnailImage.loading = "lazy";
      thumbnailImage.decoding = "async";


      thumbnail.appendChild(thumbnailImage);

      thumbnail.addEventListener("click", () => {

        index = i;
        render();

      });

      thumbs.appendChild(thumbnail);

    });


    /* Mantener las flechas al final del slider */

    slider.append(prevButton, nextButton);

  }


  /* =======================================================
     CAMBIAR IMAGEN
     ======================================================= */

  function move(amount) {

    const currentImages = visibleImages();

    if (!currentImages.length) {
      return;
    }

    index =
      (index + amount + currentImages.length) %
      currentImages.length;

    render();

  }


  /* =======================================================
     FLECHAS
     ======================================================= */

  prevButton.addEventListener("click", () => {
    move(-1);
  });

  nextButton.addEventListener("click", () => {
    move(1);
  });


  /* =======================================================
     TECLADO
     ======================================================= */

  document.addEventListener("keydown", event => {

    const tag = document.activeElement?.tagName;

    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT"
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      move(-1);
    }

    if (event.key === "ArrowRight") {
      move(1);
    }

  });


  /* =======================================================
     CARGAR GALERÍA JSON
     ======================================================= */

  try {

    const response = await fetch(
      "./datos/galeria.json?v=3",
      {
        cache: "no-store"
      }
    );


    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data = await response.json();


    if (!Array.isArray(data)) {
      throw new Error(
        "El formato de galeria.json no es válido."
      );
    }


    images = data.filter(image =>
      image &&
      typeof image.src === "string" &&
      image.src.trim() !== ""
    );


    if (!images.length) {
      throw new Error(
        "galeria.json no contiene imágenes válidas."
      );
    }


    render();


  } catch (error) {

    console.warn(
      "NEXUS Gallery: no se pudo cargar datos/galeria.json. Se utilizarán las imágenes predeterminadas.",
      error
    );


    images = DEFAULT_IMAGES;

    render();

  }

});
    
