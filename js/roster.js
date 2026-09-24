const roster = [
  // EJEMPLOS: sustituye estas entradas por los personajes reales de NEXUS.
  {name:"Thrall", race:"Orco", className:"Chamán"},
  {name:"Vol'jin", race:"Trol", className:"Cazador"},
  {name:"Cairne", race:"Tauren", className:"Guerrero"},
  {name:"Sylvanas", race:"No-muerto", className:"Cazadora"},
  {name:"Rokhan", race:"Trol", className:"Pícaro"},
  {name:"Nazgrel", race:"Orco", className:"Guerrero"},
  {name:"Thrall", race:"Orco", className:"Chamán"},
  {name:"Vol'jin", race:"Trol", className:"Cazador"},
  {name:"Cairne", race:"Tauren", className:"Guerrero"},
  {name:"Sylvanas", race:"No-muerto", className:"Cazadora"},
  {name:"Rokhan", race:"Trol", className:"Pícaro"},
  {name:"Nazgrel", race:"Orco", className:"Guerrero"}
];

const raceColors={"Orco":"#3f9b5b","Trol":"#4fa3b8","Tauren":"#b48a62","No-muerto":"#9a8fb5","Elfo de sangre":"#d9577a","Goblin":"#72b84a","Vulpera":"#d98a52","Mag'har":"#8a765f","Zandalari":"#d5a84c","Elfo de la noche":"#6678b8"};
const classColors={"Guerrero":"#c79c6e","Paladín":"#f58cba","Cazador":"#abd473","Pícaro":"#fff569","Sacerdote":"#ffffff","Chamán":"#0070de","Mago":"#69ccf0","Brujo":"#9482c9","Druida":"#ff7d0a","Caballero de la Muerte":"#c41f3b","Cazadora":"#abd473","Pícaro":"#fff569"};
const portraitFiles={"Orco":"orco.svg","Trol":"trol.svg","Tauren":"tauren.svg","No-muerto":"no-muerto.svg","Elfo de sangre":"elfo-de-sangre.svg","Goblin":"goblin.svg","Vulpera":"vulpera.svg","Mag'har":"maghar.svg","Zandalari":"zandalari.svg","Elfo de la noche":"elfo-de-sangre.svg"};

const grid=document.getElementById('roster-grid');
const search=document.getElementById('roster-search');
const race=document.getElementById('roster-race');
const cls=document.getElementById('roster-class');
const count=document.getElementById('roster-count');

function render(){
 const q=search.value.trim().toLowerCase();
 const filtered=roster.filter(p=>(!q||p.name.toLowerCase().includes(q))&&(!race.value||p.race===race.value)&&(!cls.value||p.className===cls.value));
 count.textContent=`${filtered.length} personaje${filtered.length===1?'':'s'} en el roster`;
 grid.innerHTML=filtered.length?filtered.map(p=>{
   const rc=raceColors[p.race]||'#d7ad58'; const cc=classColors[p.className]||'#d7ad58';
   const portrait=portraitFiles[p.race]||'orco.svg';
   return `<article class="roster-card" style="--race-color:${rc}">
      <div class="race-portrait"><img src="./img/races/${portrait}" alt="Retrato estilizado de ${p.race}" loading="lazy"></div>
      <div><h3 class="roster-name">${escapeHtml(p.name)}</h3><div class="roster-meta"><span class="roster-race">${escapeHtml(p.race)}</span><span class="roster-sep">·</span><span class="roster-class" style="color:${cc}">${escapeHtml(p.className)}</span></div></div>
    </article>`;
 }).join(''):`<div class="roster-empty">No hay personajes que coincidan con los filtros.</div>`;
}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
[search,race,cls].forEach(el=>el.addEventListener('input',render));
render();
