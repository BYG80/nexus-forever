document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       NEXUS — GALERÍA
       ========================================================= */


    const images = [
        // Para añadir un vídeo de YouTube:
        {
           type: "video",
           youtube: "https://www.youtube.com/watch?v=4iWG5Qbwj30",
           title: "Trailer",
           cat: "Vídeos",
           desc: "Trailer Forever"
        },

        {
            src: "./img/galeria/Deadtmines.jpg",
            title: "Noche de Mazmorra",
            cat: "Raids",
            desc: "Momentos de progresión de NEXUS en la Beta"
        },
           {
            src: "./img/galeria/instance01.jpg",
            title: "Noche de Mazmorra",
            cat: "Raids",
            desc: "Momentos de progresión de NEXUS"
        },
   {
            src: "./img/galeria/Colmillo01.jpg",
            title: "Noche de Mazmorra",
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
            src: "./img/galeria/Azeroth03.jpg",
            title: "Explorando Azeroth",
            cat: "Azeroth",
            desc: "Aventuras y exploración por Azeroth"
        },
               {
            src: "./img/galeria/Azeroth04.jpg",
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
       ELEMENTOS
       ========================================================= */

    const slider =
        document.getElementById("gallerySlider");

    const dots =
        document.getElementById("galleryDots");

    const thumbs =
        document.getElementById("galleryThumbs");

    const filters =
        document.getElementById("galleryFilters");


    const prevSlide =
        document.getElementById("prevSlide");

    const nextSlide =
        document.getElementById("nextSlide");


    /* LIGHTBOX */

    const lightbox =
        document.getElementById("galleryLightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxCaption =
        document.getElementById("lightboxCaption");

    const lightboxClose =
        document.getElementById("lightboxClose");

    const lightboxPrev =
        document.getElementById("lightboxPrev");

    const lightboxNext =
        document.getElementById("lightboxNext");


    /* =========================================================
       VARIABLES
       ========================================================= */

    let filter = "Todas";

    let currentIndex = 0;

    let lightboxIndex = 0;



    /* =========================================================
       IMÁGENES VISIBLES
       ========================================================= */

    function getVisibleImages() {

        if (filter === "Todas") {

            return images;

        }

        return images.filter(
            image => image.cat === filter
        );

    }



    /* =========================================================
       YOUTUBE
       ========================================================= */

    function getYouTubeId(url) {
        if (!url) return "";

        const value = String(url).trim();

        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
            /^([A-Za-z0-9_-]{11})$/
        ];

        for (const pattern of patterns) {
            const match = value.match(pattern);
            if (match) return match[1];
        }

        return "";
    }

    function isVideo(item) {
        return item && item.type === "video";
    }

    function getMediaThumbnail(item) {
        if (isVideo(item)) {
            // Permite usar una miniatura propia y, si no existe, usa
            // la miniatura HD 16:9 de YouTube.
            if (item.thumbnail) return item.thumbnail;

            const id = getYouTubeId(item.youtube);
            return id
                ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
                : "./img/galeria/nexus-community.svg";
        }

        return item.src;
    }

    /* =========================================================
       FILTROS
       ========================================================= */

    function renderFilters() {

        filters.innerHTML = "";

        const categories = [
            "Todas",
            ...new Set(
                images.map(
                    image => image.cat
                )
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

                    filter = category;

                    currentIndex = 0;

                    render();

                }
            );


            filters.appendChild(button);

        });

    }



    /* =========================================================
       RENDER GALERÍA
       ========================================================= */

    function render() {

        const visible =
            getVisibleImages();


        renderFilters();


        slider
            .querySelectorAll(
                ".gallery-slide"
            )
            .forEach(
                element => element.remove()
            );


        dots.innerHTML = "";

        thumbs.innerHTML = "";


        if (!visible.length) {

            return;

        }


        if (
            currentIndex >=
            visible.length
        ) {

            currentIndex = 0;

        }


        /* =====================================================
           SLIDES
           ===================================================== */

        visible.forEach(
            (image, index) => {

                const slide =
                    document.createElement(
                        "div"
                    );


                slide.className =
                    "gallery-slide" +
                    (isVideo(image) ? " gallery-slide-video" : "") +
                    (
                        index === currentIndex
                            ? " active"
                            : ""
                    );


                const media =
                    document.createElement(
                        "div"
                    );

                media.className =
                    "gallery-media" +
                    (isVideo(image) ? " is-video" : "");

                if (isVideo(image)) {
                    const img =
                        document.createElement("img");

                    img.src = getMediaThumbnail(image);
                    img.alt = image.title;
                    img.loading = "lazy";

                    // Algunas publicaciones de YouTube no disponen de
                    // maxresdefault. En ese caso bajamos automáticamente
                    // a una miniatura compatible.
                    img.addEventListener("error", () => {
                        const id = getYouTubeId(image.youtube);
                        const fallback = id
                            ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                            : "./img/galeria/nexus-community.svg";

                        if (img.src !== fallback) img.src = fallback;
                    }, { once: true });

                    media.appendChild(img);

                    const play =
                        document.createElement("span");

                    play.className = "gallery-play";
                    play.setAttribute("aria-hidden", "true");
                    play.textContent = "▶";
                    media.appendChild(play);
                } else {
                    const img =
                        document.createElement("img");

                    img.src = image.src;
                    img.alt = image.title;
                    media.appendChild(img);
                }

                media.addEventListener(
                    "click",
                    event => {
                        event.stopPropagation();
                        openLightbox(index);
                    }
                );


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


                const desc =
                    document.createElement(
                        "span"
                    );


                desc.textContent =
                    image.desc;


                caption.appendChild(title);

                caption.appendChild(desc);


                slide.appendChild(media);

                slide.appendChild(caption);


                slider.insertBefore(
                    slide,
                    nextSlide
                );

            }
        );



        /* =====================================================
           DOTS
           ===================================================== */

        visible.forEach(
            (image, index) => {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type = "button";

                dot.className =
                    "gallery-dot" +
                    (
                        index === currentIndex
                            ? " active"
                            : ""
                    );


                dot.setAttribute(
                    "aria-label",
                    "Mostrar " + (isVideo(image) ? "vídeo " : "imagen ") +
                    (index + 1)
                );


                dot.addEventListener(
                    "click",
                    () => {

                        currentIndex =
                            index;

                        render();

                    }
                );


                dots.appendChild(dot);

            }
        );



        /* =====================================================
           MINIATURAS
           ===================================================== */

        visible.forEach(
            (image, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type = "button";

                button.className =
                    "gallery-thumb";


                button.setAttribute(
                    "aria-label",
                    "Ampliar " +
                    image.title
                );


                const img =
                    document.createElement(
                        "img"
                    );


                img.src =
                    getMediaThumbnail(image);

                img.alt =
                    image.title;

                img.loading =
                    "lazy";


                button.appendChild(img);


                button.addEventListener(
                    "click",
                    () => {

                        openLightbox(index);

                    }
                );


                thumbs.appendChild(button);

            }
        );


        /* =====================================================
           FLECHAS PRINCIPALES AL FINAL
           ===================================================== */

        slider.appendChild(prevSlide);

        slider.appendChild(nextSlide);

    }



    /* =========================================================
       SLIDER
       ========================================================= */

    function moveSlide(amount) {

        const visible =
            getVisibleImages();


        if (!visible.length) {

            return;

        }


        currentIndex =
            (
                currentIndex +
                amount +
                visible.length
            ) %
            visible.length;


        render();

    }


    prevSlide.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            moveSlide(-1);

        }
    );


    nextSlide.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            moveSlide(1);

        }
    );



    /* =========================================================
       ABRIR LIGHTBOX
       ========================================================= */

    function openLightbox(index) {

        const visible =
            getVisibleImages();


        if (
            !visible.length ||
            !lightbox
        ) {

            return;

        }


        lightboxIndex = index;


        updateLightbox();


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



    /* =========================================================
       ACTUALIZAR LIGHTBOX
       ========================================================= */

    function updateLightbox() {

        const visible =
            getVisibleImages();


        if (
            !visible.length
        ) {

            return;

        }


        if (
            lightboxIndex >=
            visible.length
        ) {

            lightboxIndex = 0;

        }


        if (
            lightboxIndex < 0
        ) {

            lightboxIndex =
                visible.length - 1;

        }


        const image =
            visible[lightboxIndex];


        lightboxImage.src = "";
        lightboxImage.alt = "";

        const existingVideo =
            lightbox.querySelector(".lightbox-youtube");

        if (existingVideo) {
            existingVideo.remove();
        }

        if (isVideo(image)) {
            lightboxImage.style.display = "none";

            const videoId = getYouTubeId(image.youtube);
            if (videoId) {
                const iframe =
                    document.createElement("iframe");

                iframe.className = "lightbox-youtube";
                iframe.src =
                    `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.title = image.title;
                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.allowFullscreen = true;
                lightbox.querySelector(".gallery-lightbox-inner").insertBefore(
                    iframe,
                    lightboxCaption
                );
            }
        } else {
            lightboxImage.style.display = "block";
            lightboxImage.src = image.src;
            lightboxImage.alt = image.title;
        }

        lightboxCaption.innerHTML = "";


        const title =
            document.createElement(
                "strong"
            );


        title.textContent =
            image.title;


        const desc =
            document.createElement(
                "span"
            );


        desc.textContent =
            image.desc;


        lightboxCaption.appendChild(
            title
        );


        lightboxCaption.appendChild(
            desc
        );

    }



    /* =========================================================
       CERRAR
       ========================================================= */

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

        const video = lightbox.querySelector(".lightbox-youtube");
        if (video) video.remove();

        lightboxImage.style.display = "block";

    }



    /* =========================================================
       LIGHTBOX ANTERIOR
       ========================================================= */

    function previousLightbox() {

        const visible =
            getVisibleImages();


        if (!visible.length) {

            return;

        }


        lightboxIndex =
            (
                lightboxIndex -
                1 +
                visible.length
            ) %
            visible.length;


        updateLightbox();

    }



    /* =========================================================
       LIGHTBOX SIGUIENTE
       ========================================================= */

    function nextLightbox() {

        const visible =
            getVisibleImages();


        if (!visible.length) {

            return;

        }


        lightboxIndex =
            (
                lightboxIndex +
                1
            ) %
            visible.length;


        updateLightbox();

    }



    /* =========================================================
       BOTONES LIGHTBOX
       ========================================================= */

    lightboxClose.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            closeLightbox();

        }
    );


    lightboxPrev.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            previousLightbox();

        }
    );


    lightboxNext.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            nextLightbox();

        }
    );



    /* =========================================================
       CLICK EN EL FONDO
       ========================================================= */

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );



    /* =========================================================
       TECLADO
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                lightbox.classList.contains(
                    "is-open"
                )
            ) {

                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    event.preventDefault();

                    previousLightbox();

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    event.preventDefault();

                    nextLightbox();

                }


                if (
                    event.key ===
                    "Escape"
                ) {

                    event.preventDefault();

                    closeLightbox();

                }

                return;

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                moveSlide(-1);

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                moveSlide(1);

            }

        }
    );



    /* =========================================================
       INICIAR
       ========================================================= */

    render();

});
