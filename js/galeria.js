
/* =========================================================
   NEXUS — GALERÍA
   Slider + filtros + miniaturas + Lightbox
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


  /* =======================================================
     IMÁGENES
  ======================================================= */

  const images = [

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
      desc: "Aventuras y exploración por Azeroth"
    },

    {
      src: "./img/galeria/Azeroth02.jpg",
      title: "Explorando Azeroth",
      cat: "Azeroth",
      desc: "Aventuras y exploración por Azeroth"
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
     ESTADO
  ======================================================= */

  let filter = "Todas";

  let index = 0;


  /* =======================================================
     ELEMENTOS HTML
  ======================================================= */

  const slider =
    document.getElementById("gallerySlider");

  const dots =
    document.getElementById("galleryDots");

  const thumbs =
    document.getElementById("galleryThumbs");

  const filters =
    document.getElementById("galleryFilters");

  const prevButton =
    document.getElementById("prevSlide");

  const nextButton =
    document.getElementById("nextSlide");


  /* LIGHTBOX */

  const lightbox =
    document.getElementById("galleryLightbox");

  const lightboxImage =
    document.getElementById("galleryLightboxImage");

  const lightboxCaption =
    document.getElementById("galleryLightboxCaption");

  const lightboxClose =
    document.getElementById("galleryLightboxClose");


  /* =======================================================
     COMPROBAR ELEMENTOS
  ======================================================= */

  if (
    !slider ||
    !dots ||
    !thumbs ||
    !filters ||
    !prevButton ||
    !nextButton
  ) {

    console.error(
      "NEXUS Galería: faltan elementos HTML."
    );

    return;

  }


  /* =======================================================
     IMÁGENES VISIBLES
  ======================================================= */

  function visibleImages() {

    return images.filter(

      image =>
        filter === "Todas" ||
        image.cat === filter

    );

  }


  /* =======================================================
     FILTROS
  ======================================================= */

  function renderFilters() {

    filters.innerHTML = "";


    const categories = [

      "Todas",

      ...new Set(

        images
          .map(image => image.cat)
          .filter(Boolean)

      )

    ];


    categories.forEach(category => {

      const button =
        document.createElement("button");


      button.type = "button";

      button.className =
        "filter-btn" +
        (
          category === filter
            ? " active"
            : ""
        );


      button.textContent = category;


      button.setAttribute(

        "aria-pressed",

        category === filter
          ? "true"
          : "false"

      );


      button.addEventListener(
        "click",
        () => {

          filter = category;

          index = 0;

          render();

        }
      );


      filters.appendChild(button);

    });

  }


  /* =======================================================
     ABRIR LIGHTBOX
  ======================================================= */

  function openLightbox(image) {

    if (
      !lightbox ||
      !lightboxImage
    ) {

      console.error(
        "NEXUS Galería: Lightbox no encontrado."
      );

      return;

    }


    lightboxImage.src =
      image.src;


    lightboxImage.alt =
      image.title;


    if (lightboxCaption) {

      lightboxCaption.innerHTML = `

        <strong>
          ${image.title}
        </strong>

        <span>
          ${image.desc}
        </span>

      `;

    }


    lightbox.classList.add(
      "is-open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";

  }


  /* =======================================================
     CERRAR LIGHTBOX
  ======================================================= */

  function closeLightbox() {

    if (!lightbox) {
      return;
    }


    lightbox.classList.remove(
      "is-open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";

  }


  /* =======================================================
     BOTÓN CERRAR
  ======================================================= */

  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );

  }


  /* =======================================================
     CLIC EN FONDO
  ======================================================= */

  if (lightbox) {

    lightbox.addEventListener(
      "click",
      event => {

        /*
         * Solo cerramos si se pulsa
         * directamente el fondo.
         */

        if (
          event.target === lightbox
        ) {

          closeLightbox();

        }

      }
    );

  }


  /* =======================================================
     ESC
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeLightbox();

      }

    }
  );


  /* =======================================================
     TECLADO LIGHTBOX
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox ||
        !lightbox.classList.contains(
          "is-open"
        )
      ) {

        return;

      }


      const currentImages =
        visibleImages();


      if (!currentImages.length) {
        return;
      }


      if (
        event.key === "ArrowLeft"
      ) {

        index =
          (
            index -
            1 +
            currentImages.length
          ) %
          currentImages.length;


        render();


        openLightbox(
          currentImages[index]
        );


        return;

      }


      if (
        event.key === "ArrowRight"
      ) {

        index =
          (
            index +
            1
          ) %
          currentImages.length;


        render();


        openLightbox(
          currentImages[index]
        );


        return;

      }

    }
  );


  /* =======================================================
     RENDER GALERÍA
  ======================================================= */

  function render() {

    const currentImages =
      visibleImages();


    renderFilters();


    /*
     * Eliminar slides anteriores
     */

    slider
      .querySelectorAll(
        ".gallery-slide"
      )
      .forEach(
        slide => slide.remove()
      );


    /*
     * Limpiar dots y miniaturas
     */

    dots.innerHTML = "";

    thumbs.innerHTML = "";


    /*
     * No hay imágenes
     */

    if (
      !currentImages.length
    ) {

      return;

    }


    /*
     * Corregir índice
     */

    if (
      index >=
      currentImages.length
    ) {

      index = 0;

    }


    /* ===================================================
       CREAR CADA IMAGEN
    =================================================== */

    currentImages.forEach(
      (image, i) => {


        /* -----------------------------------------------
           SLIDE
        ------------------------------------------------ */

        const slide =
          document.createElement(
            "div"
          );


        slide.className =
          "gallery-slide" +
          (
            i === index
              ? " active"
              : ""
          );


        /* -----------------------------------------------
           IMAGEN
        ------------------------------------------------ */

        const img =
          document.createElement(
            "img"
          );


        img.src =
          image.src;


        img.alt =
          image.title;


        img.draggable =
          false;


        img.loading =
          i === index
            ? "eager"
            : "lazy";


        /*
         * CLICK PARA AMPLIAR
         */

        img.addEventListener(
          "click",
          () => {

            index = i;

            openLightbox(
              image
            );

          }
        );


        img.onerror = () => {

          console.error(
            "No se pudo cargar:",
            image.src
          );

        };


        /* -----------------------------------------------
           CAPTION
        ------------------------------------------------ */

        const caption =
          document.createElement(
            "div"
          );


        caption.className =
          "gallery-caption";


        caption.innerHTML = `

          <strong>
            ${image.title}
          </strong>

          <span>
            ${image.desc}
          </span>

        `;


        /* -----------------------------------------------
           AÑADIR AL SLIDE
        ------------------------------------------------ */

        slide.appendChild(
          img
        );

        slide.appendChild(
          caption
        );


        slider.insertBefore(
          slide,
          prevButton
        );


        /* =================================================
           DOT
        ================================================= */

        const dot =
          document.createElement(
            "button"
          );


        dot.type =
          "button";


        dot.className =
          "gallery-dot" +
          (
            i === index
              ? " active"
              : ""
          );


        dot.setAttribute(
          "aria-label",
          `Ver imagen ${i + 1}`
        );


        dot.addEventListener(
          "click",
          () => {

            index = i;

            render();

          }
        );


        dots.appendChild(
          dot
        );


        /* =================================================
           MINIATURA
        ================================================= */

        const thumb =
          document.createElement(
            "button"
          );


        thumb.type =
          "button";


        thumb.className =
          "gallery-thumb";


        thumb.setAttribute(
          "aria-label",
          `Ampliar ${image.title}`
        );


        const thumbImg =
          document.createElement(
            "img"
          );


        thumbImg.src =
          image.src;


        thumbImg.alt =
          image.title;


        thumbImg.loading =
          "lazy";


        thumbImg.draggable =
          false;


        thumb.appendChild(
          thumbImg
        );


        /*
         * MINIATURA:
         * cambia la imagen y abre lightbox
         */

        thumb.addEventListener(
          "click",
          () => {

            index = i;

            render();

            openLightbox(
              image
            );

          }
        );


        thumbs.appendChild(
          thumb
        );

      }
    );


    /* ===================================================
       RECOLOCAR FLECHAS
    =================================================== */

    slider.appendChild(
      prevButton
    );

    slider.appendChild(
      nextButton
    );

  }


  /* =======================================================
     CAMBIAR IMAGEN
  ======================================================= */

  function move(amount) {

    const currentImages =
      visibleImages();


    if (
      !currentImages.length
    ) {

      return;

    }


    index =
      (
        index +
        amount +
        currentImages.length
      ) %
      currentImages.length;


    render();

  }


  /* =======================================================
     FLECHA ANTERIOR
  ======================================================= */

  prevButton.addEventListener(
    "click",
    () => {

      move(-1);

    }
  );


  /* =======================================================
     FLECHA SIGUIENTE
  ======================================================= */

  nextButton.addEventListener(
    "click",
    () => {

      move(1);

    }
  );


  /* =======================================================
     TECLADO DEL SLIDER
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      /*
       * Si el lightbox está abierto,
       * el otro controlador se encarga.
       */

      if (
        lightbox &&
        lightbox.classList.contains(
          "is-open"
        )
      ) {

        return;

      }


      if (
        event.key === "ArrowLeft"
      ) {

        move(-1);

      }


      if (
        event.key === "ArrowRight"
      ) {

        move(1);

      }

    }
  );


  /* =======================================================
     INICIAR
  ======================================================= */

  render();

});
