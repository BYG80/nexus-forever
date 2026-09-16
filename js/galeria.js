document.addEventListener("DOMContentLoaded", async () => {
  const DEFAULT_IMAGES = [
    {src:"./img/galeria/nexus-raids.svg",title:"Noches de Raid",cat:"Raids",desc:"Momentos de progresión de NEXUS"},
    {src:"./img/galeria/nexus-azeroth.svg",title:"Explorando Azeroth",cat:"Azeroth",desc:"Aventuras y exploración"},
    {src:"./img/galeria/nexus-pvp.svg",title:"Honor y combate",cat:"PvP",desc:"Actividades PvP de la hermandad"},
    {src:"./img/galeria/nexus-community.svg",title:"Juntos en Forever",cat:"Comunidad",desc:"La comunidad por encima de todo"}
  ];
  let images = [];
  let filter = "Todas", index = 0;
  const slider = document.getElementById("gallerySlider");
  const dots = document.getElementById("galleryDots");
  const thumbs = document.getElementById("galleryThumbs");
  const filters = document.getElementById("galleryFilters");

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function visible(){
    return images.filter(x => filter === "Todas" || x.cat === filter);
  }

  function renderFilters(){
    const cats = ["Todas", ...new Set(images.map(x => x.cat).filter(Boolean))];
    filters.innerHTML = "";
    cats.forEach(c => {
      const b = document.createElement("button");
      b.className = "filter-btn" + (c === filter ? " active" : "");
      b.textContent = c;
      b.type = "button";
      b.onclick = () => { filter = c; index = 0; render(); };
      filters.appendChild(b);
    });
  }

  function render(){
    renderFilters();
    const arr = visible();
    if(index >= arr.length) index = 0;
    slider.querySelectorAll(".gallery-slide").forEach(x => x.remove());
    dots.innerHTML = "";
    thumbs.innerHTML = "";

    if(!arr.length){
      slider.insertAdjacentHTML("beforeend", '<p class="muted">No hay imágenes.</p>');
      slider.append(document.getElementById("prevSlide"), document.getElementById("nextSlide"));
      return;
    }

    arr.forEach((x,i)=>{
      const slide = document.createElement("div");
      slide.className = "gallery-slide" + (i === index ? " active" : "");
      slide.innerHTML = `<img src="${esc(x.src)}" alt="${esc(x.title)}"><div class="gallery-caption"><strong>${esc(x.title)}</strong><span>${esc(x.desc || x.cat)}</span></div>`;
      slider.appendChild(slide);

      const d = document.createElement("button");
      d.type = "button";
      d.className = "gallery-dot" + (i === index ? " active" : "");
      d.setAttribute("aria-label", `Imagen ${i+1}`);
      d.onclick = () => { index = i; render(); };
      dots.appendChild(d);

      const t = document.createElement("div");
      t.className = "gallery-thumb";
      t.title = x.title || "Imagen";
      t.innerHTML = `<img src="${esc(x.src)}" alt="">`;
      t.onclick = () => { index = i; render(); };
      thumbs.appendChild(t);
    });

    slider.append(document.getElementById("prevSlide"), document.getElementById("nextSlide"));
  }

  function move(n){
    const a = visible();
    if(!a.length) return;
    index = (index + n + a.length) % a.length;
    render();
  }

  document.getElementById("prevSlide").onclick = () => move(-1);
  document.getElementById("nextSlide").onclick = () => move(1);

  try {
    const response = await fetch("./datos/galeria.json?v=3", { cache: "no-store" });
    if(!response.ok) throw new Error("No se pudo cargar la galería");
    images = await response.json();
    if(!Array.isArray(images)) throw new Error("Formato de galería no válido");
    render();
  } catch (error) {
    console.warn("No se pudo cargar datos/galeria.json; se usarán las imágenes incluidas en la web.", error);
    images = DEFAULT_IMAGES;
    render();
  }
});
