document.addEventListener("DOMContentLoaded", () => {

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

let filter = "Todas";
let index = 0;

const slider = document.getElementById("gallerySlider");
const dots = document.getElementById("galleryDots");
const thumbs = document.getElementById("galleryThumbs");
const filters = document.getElementById("galleryFilters");

const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");

if (
!slider ||
!dots ||
!thumbs ||
!filters ||
!prevButton ||
!nextButton
) {
console.error("NEXUS Gallery: faltan elementos HTML de la galería.");
return;
}

function visibleImages() {
return images.filter(
image => filter === "Todas" || image.cat === filter
);
}

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

function render() {


const currentImages = visibleImages();

renderFilters();

slider
  .querySelectorAll(".gallery-slide")
  .forEach(slide => slide.remove());

dots.innerHTML = "";
thumbs.innerHTML = "";

if (!currentImages.length) {

  const message = document.createElement("p");

  message.className = "muted";
  message.textContent = "No hay imágenes disponibles.";

  slider.insertBefore(message, prevButton);

  return;
}

if (index >= currentImages.length) {
  index = 0;
}


currentImages.forEach((image, i) => {

  /* ================================
     SLIDE
     ================================= */

  const slide = document.createElement("div");

  slide.className =
    "gallery-slide" +
    (i === index ? " active" : "");

  const img = document.createElement("img");

  img.src = image.src;
  img.alt = image.title;
  img.loading = i === index ? "eager" : "lazy";
  img.decoding = "async";

  img.onerror = () => {
    console.error(
      "NEXUS Gallery: no se pudo cargar:",
      image.src
    );
  };


  const caption = document.createElement("div");

  caption.className = "gallery-caption";

  const title = document.createElement("strong");

  title.textContent = image.title;

  const description = document.createElement("span");

  description.textContent =
    image.desc || image.cat || "";


  caption.appendChild(title);
  caption.appendChild(description);

  slide.appendChild(img);
  slide.appendChild(caption);

  slider.insertBefore(slide, prevButton);


  /* ================================
     DOT
     ================================= */

  const dot = document.createElement("button");

  dot.type = "button";
  dot.className =
    "gallery-dot" +
    (i === index ? " active" : "");

  dot.setAttribute(
    "aria-label",
    `Mostrar ${image.title}`
  );

  dot.addEventListener("click", () => {

    index = i;

    render();

  });

  dots.appendChild(dot);


  /* ================================
     MINIATURA
     ================================= */

  const thumb = document.createElement("button");

  thumb.type = "button";
  thumb.className = "gallery-thumb";

  thumb.setAttribute(
    "aria-label",
    `Ver ${image.title}`
  );


  const thumbImg = document.createElement("img");

  thumbImg.src = image.src;
  thumbImg.alt = "";
  thumbImg.loading = "lazy";
  thumbImg.decoding = "async";


  thumb.appendChild(thumbImg);

  thumb.addEventListener("click", () => {

    index = i;

    render();

  });

  thumbs.appendChild(thumb);

});


slider.appendChild(prevButton);
slider.appendChild(nextButton);


}

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

prevButton.addEventListener("click", () => {
move(-1);
});

nextButton.addEventListener("click", () => {
move(1);
});

/* ================================
TECLADO
================================= */

document.addEventListener("keydown", event => {


if (event.key === "ArrowLeft") {
  move(-1);
}

if (event.key === "ArrowRight") {
  move(1);
}


});

/* ================================
INICIAR
================================= */

render();

});
