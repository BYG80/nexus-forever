window.NexusPageInit = async function () {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('monthTitle');
  const list = document.getElementById('eventList');

  if (!grid || !title || !list) {
    console.warn('Calendario: elementos no encontrados');
    return;
  }
  let view = new Date();
  view.setDate(1);
  let events = [];
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

  function esc(s){
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  try {
    // Relative path so it works on GitHub Pages project sites and custom domains.
    const response = await fetch('./datos/eventos.json?cb=' + Date.now(), {cache:'no-store'});
    if (!response.ok) throw new Error('No se pudo cargar datos/eventos.json');
    const data = await response.json();
    events = Array.isArray(data) ? data : (Array.isArray(data.events) ? data.events : []);
  } catch (err) {
    console.error(err);
    if (list) list.innerHTML = '<p class="event-empty">No se pudieron cargar los eventos desde GitHub.</p>';
  }

  function render(){
    const y=view.getFullYear(), m=view.getMonth();
    const formatted=new Intl.DateTimeFormat('es-ES',{month:'long',year:'numeric'}).format(view);
    title.textContent=formatted.charAt(0).toUpperCase()+formatted.slice(1);
    grid.innerHTML='';
    const first=new Date(y,m,1), start=(first.getDay()+6)%7, days=new Date(y,m+1,0).getDate();
    const cells=Math.ceil((start+days)/7)*7, today=iso(new Date());
    for(let i=0;i<cells;i++){
      const n=i-start+1, d=new Date(y,m,n), current=n>=1&&n<=days;
      const cell=document.createElement('div');
      cell.className='day'+(current?'':' other')+(iso(d)===today?' today':'');
      const dn=document.createElement('div'); dn.className='day-number';
      dn.textContent=current?n:(n<1?new Date(y,m,0).getDate()+n:n-days);
      cell.appendChild(dn);
      if(current){
        events.filter(e=>e.date===iso(d)).sort((a,b)=>(a.time||'').localeCompare(b.time||'')).slice(0,4).forEach(e=>{
          const ev=document.createElement('span'); ev.className='event-dot';
          ev.title=e.description||e.title||'';
          ev.textContent=(e.time?e.time+' · ':'')+(e.title||'Evento');
          cell.appendChild(ev);
        });
      }
      grid.appendChild(cell);
    }
    renderList(y,m);
  }

  function renderList(y,m){
    list.innerHTML='';
    const arr=events.filter(e=>{
      const d=new Date((e.date||'')+'T00:00:00');
      return !Number.isNaN(d.getTime())&&d.getFullYear()===y&&d.getMonth()===m;
    }).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
    if(!arr.length){list.innerHTML='<p class="event-empty">No hay eventos este mes.</p>';return;}
    arr.forEach(e=>{
      const item=document.createElement('div'); item.className='event-item';
      const d=new Date(e.date+'T00:00:00');
      item.innerHTML=`<strong>${esc(e.title||'Evento')}</strong><small>${d.toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})}${e.time?' · '+esc(e.time):''}${e.type?' · '+esc(e.type):''}</small>${e.description?`<div class="muted" style="font-size:.8rem;margin-top:4px">${esc(e.description)}</div>`:''}`;
      list.appendChild(item);
    });
  }

  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  if (prevBtn) prevBtn.addEventListener('click',()=>{view.setMonth(view.getMonth()-1);render();});
  if (nextBtn) nextBtn.addEventListener('click',()=>{view.setMonth(view.getMonth()+1);render();});
  render();
}

