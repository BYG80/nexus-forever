/* =========================================================
   NEXUS — GALERÍA
   Slider + filtros + miniaturas + Lightbox
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


/* =========================================================
   IMÁGENES
========================================================= */

const images = [

{
src:"./img/galeria/nexus-raids.svg",
title:"Noches de Raid",
cat:"Raids",
desc:"Momentos de progresión de NEXUS"
},

{
src:"./img/galeria/Azeroth01.jpg",
title:"Explorando Azeroth",
cat:"Azeroth",
desc:"Aventuras y exploración por Azeroth"
},

{
src:"./img/galeria/Azeroth02.jpg",
title:"Explorando Azeroth",
cat:"Azeroth",
desc:"Aventuras y exploración por Azeroth"
},

{
src:"./img/galeria/nexus-pvp.svg",
title:"Honor y combate",
cat:"PvP",
desc:"Actividades PvP de la hermandad"
},

{
src:"./img/galeria/nexus-community.svg",
title:"Juntos en Forever",
cat:"Comunidad",
desc:"La comunidad por encima de todo"
}

];


/* =========================================================
   ESTADO
========================================================= */

let filter = "Todas";

let index = 0;


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

const prev =
document.getElementById("prevSlide");

const next =
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

const lightboxPrev =
document.getElementById("galleryLightboxPrev");

const lightboxNext =
document.getElementById("galleryLightboxNext");


/* =========================================================
   COMPROBACIÓN
========================================================= */

if(
!slider ||
!dots ||
!thumbs ||
!filters ||
!prev ||
!next
){

console.error(
"NEXUS Galería: faltan elementos HTML."
);

return;

}


/* =========================================================
   IMÁGENES VISIBLES
========================================================= */

function visibleImages(){

return images.filter(function(image){

return (
filter === "Todas" ||
image.cat === filter
);

});

}


/* =========================================================
   FILTROS
========================================================= */

function renderFilters(){

filters.innerHTML = "";

const categories = [
"Todas",
...new Set(
images.map(function(image){
return image.cat;
})
)
];


categories.forEach(function(category){

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
function(){

filter = category;

index = 0;

render();

}
);


filters.appendChild(button);

});

}


/* =========================================================
   ABRIR LIGHTBOX
========================================================= */

function openLightbox(image){

if(
!lightbox ||
!lightboxImage
){

console.error(
"NEXUS Galería: no existe el Lightbox."
);

return;

}


lightboxImage.src =
image.src;

lightboxImage.alt =
image.title;


if(lightboxCaption){

lightboxCaption.innerHTML =
"<strong>" +
image.title +
"</strong>" +
"<span>" +
image.desc +
"</span>";

}


/*
 * Mostrar
 */

lightbox.classList.add(
"is-open"
);


lightbox.setAttribute(
"aria-hidden",
"false"
);


/*
 * Bloquear scroll
 */

document.body.style.overflow =
"hidden";

}


/* =========================================================
   CERRAR LIGHTBOX
========================================================= */

function closeLightbox(){

if(!lightbox){

return;

}


lightbox.classList.remove(
"is-open"
);


lightbox.setAttribute(
"aria-hidden",
"true"
);


lightboxImage.src = "";

lightboxImage.alt = "";


document.body.style.overflow =
"";

}


/* =========================================================
   BOTÓN CERRAR
========================================================= */

if(lightboxClose){

lightboxClose.addEventListener(
"click",
function(event){

event.stopPropagation();

closeLightbox();

}
);

}


/* =========================================================
   FONDO LIGHTBOX
========================================================= */

if(lightbox){

lightbox.addEventListener(
"click",
function(event){

/*
 * Solo cerrar si se pulsa
 * directamente el fondo.
 */

if(
event.target === lightbox
){

closeLightbox();

}

}
);

}


/* =========================================================
   FLECHA ANTERIOR LIGHTBOX
========================================================= */

if(lightboxPrev){

lightboxPrev.addEventListener(
"click",
function(event){

event.stopPropagation();

changeLightbox(-1);

}
);

}


/* =========================================================
   FLECHA SIGUIENTE LIGHTBOX
========================================================= */

if(lightboxNext){

lightboxNext.addEventListener(
"click",
function(event){

event.stopPropagation();

changeLightbox(1);

}
);

}


/* =========================================================
   CAMBIAR LIGHTBOX
========================================================= */

function changeLightbox(amount){

const current =
visibleImages();


if(!current.length){

return;

}


index =
(
index +
amount +
current.length
) %
current.length;


render();


openLightbox(
current[index]
);

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
"keydown",
function(event){


/*
 * ESC
 */

if(
event.key === "Escape"
){

if(
lightbox &&
lightbox.classList.contains(
"is-open"
)
){

closeLightbox();

}

return;

}


/*
 * Si el lightbox está abierto
 */

if(
lightbox &&
lightbox.classList.contains(
"is-open"
)
){

if(
event.key === "ArrowLeft"
){

changeLightbox(-1);

return;

}


if(
event.key === "ArrowRight"
){

changeLightbox(1);

return;

}


return;

}


/*
 * Slider normal
 */

if(
event.key === "ArrowLeft"
){

move(-1);

}


if(
event.key === "ArrowRight"
){

move(1);

}

}
);


/* =========================================================
   RENDER
========================================================= */

function render(){

const current =
visibleImages();


/*
 * Filtros
 */

renderFilters();


/*
 * Eliminar slides anteriores
 */

slider
.querySelectorAll(
".gallery-slide"
)
.forEach(function(slide){

slide.remove();

});


/*
 * Limpiar
 */

dots.innerHTML = "";

thumbs.innerHTML = "";


if(!current.length){

return;

}


/*
 * Corregir índice
 */

if(
index >= current.length
){

index = 0;

}


/* =======================================================
   CREAR IMÁGENES
======================================================= */

current.forEach(
function(image,i){


/* -------------------------------------------------------
   SLIDE
------------------------------------------------------- */

const slide =
document.createElement("div");


slide.className =
"gallery-slide" +
(
i === index
? " active"
: ""
);


/* -------------------------------------------------------
   IMAGEN
------------------------------------------------------- */

const img =
document.createElement("img");


img.src =
image.src;

img.alt =
image.title;

img.draggable =
false;


/*
 * Cursor lupa
 */

img.style.cursor =
"zoom-in";


/*
 * CLICK IMAGEN
 */

img.addEventListener(
"click",
function(event){

event.stopPropagation();

index = i;

openLightbox(
image
);

}
);


/*
 * Error de imagen
 */

img.addEventListener(
"error",
function(){

console.error(
"No se pudo cargar la imagen:",
image.src
);

}
);


/* -------------------------------------------------------
   CAPTION
------------------------------------------------------- */

const caption =
document.createElement("div");


caption.className =
"gallery-caption";


caption.innerHTML =
"<strong>" +
image.title +
"</strong>" +
"<span>" +
image.desc +
"</span>";


/* -------------------------------------------------------
   AÑADIR
------------------------------------------------------- */

slide.appendChild(img);

slide.appendChild(caption);


slider.insertBefore(
slide,
prev
);


/* =====================================================
   DOT
===================================================== */

const dot =
document.createElement("button");


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
"Ver imagen " + (i + 1)
);


dot.addEventListener(
"click",
function(){

index = i;

render();

}
);


dots.appendChild(dot);


/* =====================================================
   MINIATURA
===================================================== */

const thumb =
document.createElement("button");


thumb.type =
"button";


thumb.className =
"gallery-thumb";


thumb.setAttribute(
"aria-label",
"Ampliar " +
image.title
);


const thumbImg =
document.createElement("img");


thumbImg.src =
image.src;

thumbImg.alt =
image.title;

thumbImg.draggable =
false;


thumb.appendChild(
thumbImg
);


/*
 * CLICK MINIATURA
 */

thumb.addEventListener(
"click",
function(event){

event.stopPropagation();

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


/*
 * Volver a colocar flechas
 */

slider.appendChild(prev);

slider.appendChild(next);

}


/* =========================================================
   SLIDER NORMAL
========================================================= */

function move(amount){

const current =
visibleImages();


if(!current.length){

return;

}


index =
(
index +
amount +
current.length
) %
current.length;


render();

}


/* =========================================================
   FLECHA ANTERIOR
========================================================= */

prev.addEventListener(
"click",
function(event){

event.stopPropagation();

move(-1);

}
);


/* =========================================================
   FLECHA SIGUIENTE
========================================================= */

next.addEventListener(
"click",
function(event){

event.stopPropagation();

move(1);

}
);


/* =========================================================
   INICIAR
========================================================= */

render();


});
