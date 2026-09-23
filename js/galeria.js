document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       NEXUS — GALERÍA
       Slider + filtros + miniaturas + visor ampliado
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
       ELEMENTOS DE LA GALERÍA
       ========================================================= */

    const slider = document.getElementById("gallerySlider");
    const dots = document.getElementById("galleryDots");
    const thumbs = document.getElementById("galleryThumbs");
    const filters = document.getElementById("galleryFilters");

    const prevButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");


    /* =========================================================
       ELEMENTOS DEL LIGHTBOX
       ========================================================= */

    const lightbox = document.getElementById("galleryLightbox");

    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");

    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");


    /* =========================================================
       COMPROBACIÓN
       ========================================================= */

    if (
        !slider ||
        !dots ||
        !thumbs ||
        !filters ||
        !prevButton ||
        !nextButton
    ) {
        console.error("NEXUS GALERÍA: faltan elementos HTML necesarios.");
        return;
    }


    /* =========================================================
       VARIABLES
       ========================================================= */

    let filter = "Todas";

    let index = 0;

    /*
     * Índice independiente del visor ampliado.
     * Esto es importante para que las flechas del lightbox
     * funcionen correctamente.
     */
    let lightboxIndex = 0;


    /* =========================================================
       IMÁGENES VISIBLES
       ========================================================= */

    function visibleImages() {

        return images.filter(image => {

            return filter === "Todas" || image.cat === filter;

        });

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


        categories.forEach(category => {

            const button = document.createElement("button");

            button.type = "button";

            button.className =
                "filter-btn" +
                (category === filter ? " active" : "");

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


    /* =========================================================
       RENDER PRINCIPAL
       ========================================================= */

    function render() {

        const currentImages = visibleImages();


        renderFilters();


        /* -----------------------------------------
           LIMPIAR SLIDES
           ----------------------------------------- */

        slider
            .querySelectorAll(".gallery-slide")
            .forEach(slide => slide.remove());


        dots.innerHTML = "";

        thumbs.innerHTML = "";


        /* -----------------------------------------
           SIN IMÁGENES
           ----------------------------------------- */

        if (!currentImages.length) {

            return;

        }


        /* -----------------------------------------
           ASEGURAR ÍNDICE CORRECTO
           ----------------------------------------- */

        if (index >= currentImages.length) {

            index = 0;

        }


        if (index < 0) {

            index = currentImages.length - 1;

        }


        /* =====================================================
           CREAR SLIDES
           ===================================================== */

        currentImages.forEach((image, i) => {

            const slide = document.createElement("div");

            slide.className =
                "gallery-slide" +
                (i === index ? " active" : "");


            const img = document.createElement("img");

            img.src = image.src;

            img.alt = image.title;

            img.loading = i === index ? "eager" : "lazy";


            /* -----------------------------------------
               ERROR DE IMAGEN
               ----------------------------------------- */

            img.addEventListener("error", () => {

                console.error(
                    "NEXUS GALERÍA: no se pudo cargar:",
                    image.src
                );

            });


            /* -----------------------------------------
               CAPTION
               ----------------------------------------- */

            const caption = document.createElement("div");

            caption.className = "gallery-caption";


            const title = document.createElement("strong");

            title.textContent = image.title;


            const description = document.createElement("span");

            description.textContent =
                image.desc || "";


            caption.appendChild(title);

            caption.appendChild(description);


            slide.appendChild(img);

            slide.appendChild(caption);


            /* -----------------------------------------
               CLICK EN LA IMAGEN
               ABRIR LIGHTBOX
               ----------------------------------------- */

            img.addEventListener("click", () => {

                openLightbox(i);

            });


            /*
             * También permitimos hacer clic en todo el slide.
             */
            slide.style.cursor = "zoom-in";


            slide.addEventListener("click", event => {

                /*
                 * Si se ha pulsado una flecha principal,
                 * no abrir el lightbox.
                 */
                if (
                    event.target.closest(".slider-arrow")
                ) {
                    return;
                }


                openLightbox(i);

            });


            /*
             * Insertar antes de las flechas.
             */
            slider.insertBefore(slide, prevButton);

        });


        /* =====================================================
           DOTS
           ===================================================== */

        currentImages.forEach((image, i) => {

            const dot = document.createElement("button");

            dot.type = "button";

            dot.className =
                "gallery-dot" +
                (i === index ? " active" : "");


            dot.setAttribute(
                "aria-label",
                "Mostrar imagen " + (i + 1)
            );


            dot.addEventListener("click", event => {

                event.stopPropagation();

                index = i;

                render();

            });


            dots.appendChild(dot);

        });


        /* =====================================================
           MINIATURAS
           ===================================================== */

        currentImages.forEach((image, i) => {

            const thumb = document.createElement("button");

            thumb.type = "button";

            thumb.className = "gallery-thumb";

            thumb.setAttribute(
                "aria-label",
                "Abrir " + image.title
            );


            const thumbImg = document.createElement("img");

            thumbImg.src = image.src;

            thumbImg.alt = image.title;

            thumbImg.loading = "lazy";


            thumb.appendChild(thumbImg);


            thumb.addEventListener("click", event => {

                event.stopPropagation();

                index = i;

                render();

                /*
                 * Al hacer clic en miniatura,
                 * también abrimos la imagen ampliada.
                 */
                openLightbox(i);

            });


            thumbs.appendChild(thumb);

        });


        /* =====================================================
           VOLVER A PONER LAS FLECHAS DEL SLIDER
           ===================================================== */

        slider.appendChild(prevButton);

        slider.appendChild(nextButton);

    }


    /* =========================================================
       MOVER SLIDER PRINCIPAL
       ========================================================= */

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


    /* =========================================================
       FLECHAS SLIDER PRINCIPAL
       ========================================================= */

    prevButton.addEventListener("click", event => {

        event.stopPropagation();

        move(-1);

    });


    nextButton.addEventListener("click", event => {

        event.stopPropagation();

        move(1);

    });


    /* =========================================================
       LIGHTBOX
       ========================================================= */

    function openLightbox(imageIndex) {

        const currentImages = visibleImages();

        if (
            !lightbox ||
            !lightboxImage ||
            !currentImages.length
        ) {

            return;

        }


        if (
            imageIndex < 0 ||
            imageIndex >= currentImages.length
        ) {

            imageIndex = 0;

        }


        lightboxIndex = imageIndex;


        updateLightbox();


        lightbox.classList.add("is-open");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Evitar scroll de la página mientras
         * el visor está abierto.
         */
        document.body.style.overflow = "hidden";

    }


    /* =========================================================
       ACTUALIZAR LIGHTBOX
       ========================================================= */

    function updateLightbox() {

        const currentImages = visibleImages();

        if (
            !currentImages.length ||
            !lightboxImage
        ) {

            return;

        }


        if (lightboxIndex >= currentImages.length) {

            lightboxIndex = 0;

        }


        if (lightboxIndex < 0) {

            lightboxIndex =
                currentImages.length - 1;

        }


        const image =
            currentImages[lightboxIndex];


        lightboxImage.src = image.src;

        lightboxImage.alt = image.title;


        if (lightboxCaption) {

            lightboxCaption.innerHTML = "";

            const strong =
                document.createElement("strong");

            strong.textContent = image.title;


            const span =
                document.createElement("span");

            span.textContent =
                image.desc || "";


            lightboxCaption.appendChild(strong);

            lightboxCaption.appendChild(span);

        }

    }


    /* =========================================================
       CERRAR LIGHTBOX
       ========================================================= */

    function closeLightbox() {

        if (!lightbox) {

            return;

        }


        lightbox.classList.remove("is-open");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow = "";

    }


    /* =========================================================
       LIGHTBOX — IMAGEN ANTERIOR
       ========================================================= */

    function lightboxPrevious() {

        const currentImages = visibleImages();

        if (!currentImages.length) {

            return;

        }


        lightboxIndex =
            (lightboxIndex - 1 + currentImages.length) %
            currentImages.length;


        updateLightbox();

    }


    /* =========================================================
       LIGHTBOX — IMAGEN SIGUIENTE
       ========================================================= */

    function lightboxNextImage() {

        const currentImages = visibleImages();

        if (!currentImages.length) {

            return;

        }


        lightboxIndex =
            (lightboxIndex + 1) %
            currentImages.length;


        updateLightbox();

    }


    /* =========================================================
       EVENTO FLECHA IZQUIERDA LIGHTBOX
       ========================================================= */

    if (lightboxPrev) {

        lightboxPrev.addEventListener("click", event => {

            event.preventDefault();

            event.stopPropagation();

            lightboxPrevious();

        });

    }


    /* =========================================================
       EVENTO FLECHA DERECHA LIGHTBOX
       ========================================================= */

    if (lightboxNext) {

        lightboxNext.addEventListener("click", event => {

            event.preventDefault();

            event.stopPropagation();

            lightboxNextImage();

        });

    }


    /* =========================================================
       BOTÓN CERRAR
       ========================================================= */

    if (lightboxClose) {

        lightboxClose.addEventListener("click", event => {

            event.preventDefault();

            event.stopPropagation();

            closeLightbox();

        });

    }


    /* =========================================================
       CLICK FUERA DE LA IMAGEN
       ========================================================= */

    if (lightbox) {

        lightbox.addEventListener("click", event => {

            /*
             * Solo cerramos si se ha pulsado
             * directamente sobre el fondo.
             */
            if (event.target === lightbox) {

                closeLightbox();

            }

        });

    }


    /* =========================================================
       EVITAR QUE EL CLICK EN LA IMAGEN CIERRE EL LIGHTBOX
       ========================================================= */

    if (lightboxImage) {

        lightboxImage.addEventListener("click", event => {

            event.stopPropagation();

        });

    }


    if (lightboxCaption) {

        lightboxCaption.addEventListener("click", event => {

            event.stopPropagation();

        });

    }


    /* =========================================================
       TECLADO
       ========================================================= */

    document.addEventListener("keydown", event => {

        /*
         * Si el lightbox está abierto
         */
        if (
            lightbox &&
            lightbox.classList.contains("is-open")
        ) {

            if (event.key === "ArrowLeft") {

                event.preventDefault();

                lightboxPrevious();

                return;

            }


            if (event.key === "ArrowRight") {

                event.preventDefault();

                lightboxNextImage();

                return;

            }


            if (event.key === "Escape") {

                event.preventDefault();

                closeLightbox();

                return;

            }

        }


        /*
         * Si el lightbox está cerrado,
         * las flechas controlan el slider normal.
         */
        if (event.key === "ArrowLeft") {

            move(-1);

        }


        if (event.key === "ArrowRight") {

            move(1);

        }

    });


    /* =========================================================
       SWIPE / TÁCTIL
       ========================================================= */

    let touchStartX = 0;

    let touchEndX = 0;


    if (lightbox) {

        lightbox.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        lightbox.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;


                const difference =
                    touchEndX - touchStartX;


                /*
                 * Deslizamiento hacia la izquierda
                 */
                if (difference < -50) {

                    lightboxNextImage();

                }


                /*
                 * Deslizamiento hacia la derecha
                 */
                if (difference > 50) {

                    lightboxPrevious();

                }

            },
            { passive: true }
        );

    }


    /* =========================================================
       INICIAR GALERÍA
       ========================================================= */

    render();

});
