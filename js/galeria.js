
document.addEventListener("DOMContentLoaded",()=>{
  const builtIn=[
    {src:"./img/galeria/nexus-raids.svg",title:"Noches de Raid",cat:"Raids",desc:"Momentos de progresión de NEXUS"},
    {src:"./img/galeria/nexus-azeroth.svg",title:"Explorando Azeroth",cat:"Azeroth",desc:"Aventuras y exploración"},
    {src:"./img/galeria/nexus-pvp.svg",title:"Honor y combate",cat:"PvP",desc:"Actividades PvP de la hermandad"},
    {src:"./img/galeria/nexus-community.svg",title:"Juntos en Forever",cat:"Comunidad",desc:"La comunidad por encima de todo"}
  ];
  let uploads=JSON.parse(localStorage.getItem("nexusGalleryUploads")||"[]");
  let images=[...builtIn,...uploads], filter="Todas", index=0;
  const slider=document.getElementById("gallerySlider"),dots=document.getElementById("galleryDots"),thumbs=document.getElementById("galleryThumbs"),filters=document.getElementById("galleryFilters");
  function visible(){return images.filter(x=>filter==="Todas"||x.cat===filter)}
  function renderFilters(){
    const cats=["Todas",...new Set(images.map(x=>x.cat))]; filters.innerHTML="";
    cats.forEach(c=>{const b=document.createElement("button");b.className="filter-btn"+(c===filter?" active":"");b.textContent=c;b.onclick=()=>{filter=c;index=0;render()};filters.appendChild(b)})
  }
  function render(){
    renderFilters();const arr=visible();if(index>=arr.length)index=0;
    slider.querySelectorAll(".gallery-slide").forEach(x=>x.remove());dots.innerHTML="";thumbs.innerHTML="";
    if(!arr.length){slider.insertAdjacentHTML("beforeend",'<p class="muted">No hay imágenes.</p>');return;}
    arr.forEach((x,i)=>{
      const slide=document.createElement("div");slide.className="gallery-slide"+(i===index?" active":"");
      slide.innerHTML=`<img src="${x.src}" alt="${esc(x.title)}"><div class="gallery-caption"><strong>${esc(x.title)}</strong><span>${esc(x.desc||x.cat)}</span></div>`;
      slider.appendChild(slide);
      const d=document.createElement("button");d.className="gallery-dot"+(i===index?" active":"");d.onclick=()=>{index=i;render()};dots.appendChild(d);
      const t=document.createElement("div");t.className="gallery-thumb";t.title=x.title;t.innerHTML=`<img src="${x.src}" alt="">`;t.onclick=()=>{index=i;render()};thumbs.appendChild(t);
    });
    // keep navigation buttons on top of generated slides
    slider.append(document.getElementById("prevSlide"),document.getElementById("nextSlide"));
  }
  function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
  function move(n){const a=visible();if(!a.length)return;index=(index+n+a.length)%a.length;render();}
  document.getElementById("prevSlide").onclick=()=>move(-1);document.getElementById("nextSlide").onclick=()=>move(1);
  document.getElementById("imageUpload").addEventListener("change",async e=>{
    const files=[...e.target.files];if(!files.length)return;
    const cat=prompt("Categoría para estas imágenes (ej. Raids, PvP, Comunidad):","Mis imágenes")||"Mis imágenes";
    for(const file of files){
      if(!file.type.startsWith("image/"))continue;
      if(file.size>4*1024*1024){alert(file.name+" supera 4 MB y no se ha añadido.");continue;}
      const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
      uploads.push({src,title:file.name.replace(/\.[^.]+$/,""),cat,desc:"Imagen añadida por la hermandad"});
    }
    images=[...builtIn,...uploads];localStorage.setItem("nexusGalleryUploads",JSON.stringify(uploads));render();e.target.value="";
  });
  render();
});
