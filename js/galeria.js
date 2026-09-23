document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     NEXUS — GALERÍA
     ========================================================= */


  /* =========================================================
     IMÁGENES
     ========================================================= */

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


  /* =========================================================
     ESTADO
     ========================================================= */

  let filter = "Todas";

  let index = 0;


  /* =========================================================
     ELEMENTOS HTML
     ========================================================= */

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


  /* =========================================================
     LIGHTBOX
     ========================================================= */

  const lightbox =
    document.getElementById("galleryLightbox");

  const lightboxImage =
    document.getElementById("galleryLightboxImage");

  const lightboxCaption =
    document.getElementById("galleryLightboxCaption");

  const lightboxClose =
    document.getElementById("galleryLightboxClose");


  /* =========================================================
     COMPROBAR HTML
     ========================================================= */

  if (
    !slider ||
    !dots ||
    !thumbs ||
    !filters ||
    !prevButton ||
    !nextButton
  ) {

    console.error(
      "NEXUS Gallery: faltan elementos HTML de la galería."
    );

    return;

  }


  /* =========================================================
     IMÁGENES VISIBLES SEGÚN FILTRO
     ========================================================= */

  function visibleImages() {

    return images.filter(
      image =>
        filter === "Todas" ||
        image.cat === filter
    );

  }


  /* =========================================================
     ABRIR LIGHTBOX
     ========================================================= */

  function openLightbox(image) {

    if (
      !lightbox ||
      !lightboxImage ||
      !image
    ) {

      return;

    }


    /*
     * Ponemos la imagen seleccionada
     * en el visor.
     */

    lightboxImage.src =
      image.src;


    lightboxImage.alt =
      image.title ||
      "Imagen de NEXUS";


    /*
     * Título.
     */

    if (lightboxCaption) {

      lightboxCaption.textContent =
        image.title ||
        "";

    }


    /*
     * Abrimos el diálogo como modal.
     */

    if (
      typeof lightbox.showModal === "function"
    ) {

      if (!lightbox.open) {

        lightbox.showModal();

      }

    } else {

      /*
       * Fallback para navegadores
       * antiguos que no soporten dialog.
       */

      lightbox.setAttribute(
        "open",
        ""
      );

    }

  }


  /* =========================================================
     CERRAR LIGHTBOX
     ========================================================= */

  function closeLightbox() {

    if (!lightbox) {
      return;
    }


    if (
      typeof lightbox.close === "function"
    ) {

      if (lightbox.open) {

        lightbox.close();

      }

    } else {

      lightbox.removeAttribute(
        "open"
      );

    }

  }


  /* =========================================================
     BOTÓN CERRAR
     ========================================================= */

  if (lightboxClose) {

    lightboxClose.addEventListener(
      "click",
      () => {

        closeLightbox();

      }
    );

  }


  /* =========================================================
     CERRAR HACIENDO CLICK EN EL FONDO
     ========================================================= */

  if (lightbox) {

    lightbox.addEventListener(
      "click",
      event => {

        /*
         * Si el usuario pulsa exactamente
         * sobre el fondo del dialog,
         * cerramos.
         */

        if (
          event.target === lightbox
        ) {

          closeLightbox();

        }

      }
    );

  }


  /* =========================================================
     ESC
     ========================================================= */

  if (lightbox) {

    lightbox.addEventListener(
      "cancel",
      () => {

        /*
         * El navegador ya cierra el dialog
         * al pulsar ESC.
         *
         * No hacemos preventDefault().
         */

      }
    );

  }


  /* =========================================================
     ACTUALIZAR LIGHTBOX
     ========================================================= */

  function updateLightbox() {

    if (
      !lightbox ||
      !lightbox.open ||
      !lightboxImage
    ) {

      return;

    }


    const currentImages =
      visibleImages();


    if (!currentImages.length) {

      closeLightbox();

      return;

    }


    const image =
      currentImages[index];


    if (!image) {
      return;
    }


    lightboxImage.src =
      image.src;


    lightboxImage.alt =
      image.title ||
      "Imagen de NEXUS";


    if (lightboxCaption) {

      lightboxCaption.textContent =
        image.title ||
        "";

    }

  }


  /* =========================================================
     FILTROS
     ========================================================= */

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


    categories.forEach(
      category => {

        const button =
          document.createElement("button");


        button.type =
          "button";


        button.className =
          "filter-btn" +
          (
            category === filter
              ? " active"
              : ""
          );


        button.textContent =
          category;


        button.setAttribute(
          "aria-pressed",
          category === filter
            ? "true"
            : "false"
        );


        button.addEventListener(
          "click",
          () => {

            filter =
              category;

            index =
              0;

            render();

          }
        );


        filters.appendChild(
          button
        );

      }
    );

  }


  /* =========================================================
     RENDER GALERÍA
     ========================================================= */

  function render() {

    const currentImages =
      visibleImages();


    renderFilters();


    /*
     * Eliminamos los slides
     * anteriores.
     */

    slider
      .querySelectorAll(
        ".gallery-slide"
      )
      .forEach(
        slide =>
          slide.remove()
      );


    dots.innerHTML =
      "";

    thumbs.innerHTML =
      "";


    /*
     * No hay imágenes.
     */

    if (
      !currentImages.length
    ) {

      const message =
        document.createElement("p");


      message.className =
        "muted";


      message.textContent =
        "No hay imágenes disponibles.";


      slider.insertBefore(
        message,
        prevButton
      );


      return;

    }


    /*
     * Seguridad para el índice.
     */

    if (
      index < 0 ||
      index >= currentImages.length
    ) {

      index =
        0;

    }


    /* =======================================================
       CREAR CADA IMAGEN
       ======================================================= */

    currentImages.forEach(
      (image, i) => {


        /* ---------------------------------------------------
           SLIDE
           --------------------------------------------------- */

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


        /* ---------------------------------------------------
           IMAGEN PRINCIPAL
           --------------------------------------------------- */

        const img =
          document.createElement(
            "img"
          );


        img.src =
          image.src;


        img.alt =
          image.title ||
          "Imagen de NEXUS";


        img.loading =
          i === index
            ? "eager"
            : "lazy";


        img.decoding =
          "async";


        img.style.cursor =
          "zoom-in";


        /*
         * Si la imagen falla,
         * lo mostramos en consola.
         */

        img.onerror =
          () => {

            console.error(
              "NEXUS Gallery: no se pudo cargar:",
              image.src
            );

          };


        /*
         * CLICK EN LA IMAGEN
         *
         * Abre el visor ampliado.
         */

        img.addEventListener(
          "click",
          () => {

            /*
             * Nos aseguramos de que
             * el índice corresponde
             * a esta imagen.
             */

            index =
              i;


            openLightbox(
              image
            );

          }
        );


        /* ---------------------------------------------------
           CAPTION
           --------------------------------------------------- */

        const caption =
          document.createElement(
            "div"
          );


        caption.className =
          "gallery-caption";


        const title =
          document.createElement(
            "strong"
          );


        title.textContent =
          image.title;


        const description =
          document.createElement(
            "span"
          );


        description.textContent =
          image.desc ||
          image.cat ||
          "";


        caption.appendChild(
          title
        );


        caption.appendChild(
          description
        );


        /* ---------------------------------------------------
           MONTAR SLIDE
           --------------------------------------------------- */

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


        /* ===================================================
           DOT
           =================================================== */

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
          `Mostrar ${image.title}`
        );


        dot.setAttribute(
          "aria-current",
          i === index
            ? "true"
            : "false"
        );


        dot.addEventListener(
          "click",
          () => {

            index =
              i;

            render();

          }
        );


        dots.appendChild(
          dot
        );


        /* ===================================================
           MINIATURA
           =================================================== */

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
          `Ver ${image.title}`
        );


        thumb.setAttribute(
          "aria-current",
          i === index
            ? "true"
            : "false"
        );


        const thumbImg =
          document.createElement(
            "img"
          );


        thumbImg.src =
          image.src;


        thumbImg.alt =
          "";


        thumbImg.loading =
          "lazy";


        thumbImg.decoding =
          "async";


        thumb.appendChild(
          thumbImg
        );


        /*
         * CLICK EN MINIATURA
         *
         * Cambia la imagen principal.
         */

        thumb.addEventListener(
          "click",
          () => {

            index =
              i;

            render();

          }
        );


        thumbs.appendChild(
          thumb
        );

      }
    );


    /*
     * Volvemos a colocar
     * las flechas.
     */

    slider.appendChild(
      prevButton
    );

    slider.appendChild(
      nextButton
    );


    /*
     * Si el lightbox estaba abierto,
     * actualizamos la imagen.
     */

    updateLightbox();

  }


  /* =========================================================
     CAMBIAR IMAGEN
     ========================================================= */

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


    /*
     * Si el visor está abierto,
     * actualizamos directamente
     * el lightbox.

     * Si no está abierto,
     * simplemente renderizamos.
     */

    if (
      lightbox &&
      lightbox.open
    ) {

      render();

    } else {

      render();

    }

  }


  /* =========================================================
     FLECHA ANTERIOR
     ========================================================= */

  prevButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      move(-1);

    }
  );


  /* =========================================================
     FLECHA SIGUIENTE
     ========================================================= */

  nextButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      move(1);

    }
  );


  /* =========================================================
     TECLADO
     ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      /*
       * Si estamos escribiendo en algún
       * input, no usamos las flechas.
       */

      const activeElement =
        document.activeElement;


      if (
        activeElement &&
        (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT"
        )
      ) {

        return;

      }


      /* --------------------------------
         IMAGEN ANTERIOR
         -------------------------------- */

      if (
        event.key === "ArrowLeft"
      ) {

        event.preventDefault();

        move(-1);

      }


      /* --------------------------------
         IMAGEN SIGUIENTE
         -------------------------------- */

      if (
        event.key === "ArrowRight"
      ) {

        event.preventDefault();

        move(1);

      }

    }
  );


  /* =========================================================
     INICIAR
     ========================================================= */

  render();


});
