
document.addEventListener("DOMContentLoaded", () => {
  const grid=document.getElementById("calendarGrid"), title=document.getElementById("monthTitle");
  const form=document.getElementById("eventForm"), list=document.getElementById("eventList");
  const dateInput=document.getElementById("eventDate");
  let view=new Date(); view.setDate(1);
  let events=JSON.parse(localStorage.getItem("nexusCalendarEvents")||"[]");

  const pad=n=>String(n).padStart(2,"0");
  const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  function save(){localStorage.setItem("nexusCalendarEvents",JSON.stringify(events));}
  function render(){
    const y=view.getFullYear(), m=view.getMonth();
    title.textContent=new Intl.DateTimeFormat("es-ES",{month:"long",year:"numeric"}).format(view);
    title.textContent=title.textContent.charAt(0).toUpperCase()+title.textContent.slice(1);
    grid.innerHTML="";
    const first=new Date(y,m,1), start=(first.getDay()+6)%7;
    const days=new Date(y,m+1,0).getDate(), prev=new Date(y,m,0).getDate();
    const cells=Math.ceil((start+days)/7)*7;
    const today=iso(new Date());
    for(let i=0;i<cells;i++){
      const n=i-start+1, d=new Date(y,m,n), current=n>=1&&n<=days;
      const cell=document.createElement("div"); cell.className="day"+(current?"":" other")+(iso(d)===today?" today":"");
      const dn=document.createElement("div"); dn.className="day-number"; dn.textContent=current?n:(n<1?prev+n: n-days);
      cell.appendChild(dn);
      if(current){
        events.filter(e=>e.date===iso(d)).sort((a,b)=>(a.time||"").localeCompare(b.time||"")).slice(0,4).forEach(e=>{
          const ev=document.createElement("span"); ev.className="event-dot"; ev.title=e.description||e.title;
          ev.textContent=(e.time?e.time+" · ":"")+e.title; cell.appendChild(ev);
        });
        cell.addEventListener("click",()=>dateInput.value=iso(d));
      }
      grid.appendChild(cell);
    }
    renderList(y,m);
  }
  function renderList(y,m){
    list.innerHTML="";
    const monthEvents=events.filter(e=>{const d=new Date(e.date+"T00:00:00");return d.getFullYear()===y&&d.getMonth()===m})
      .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    if(!monthEvents.length){list.innerHTML='<p class="event-empty">No hay eventos este mes.</p>';return;}
    monthEvents.forEach(e=>{
      const item=document.createElement("div"); item.className="event-item";
      item.innerHTML=`<button type="button" data-id="${e.id}" aria-label="Eliminar evento">✕</button><strong>${esc(e.title)}</strong><small>${new Date(e.date+"T00:00:00").toLocaleDateString("es-ES",{weekday:"short",day:"numeric",month:"short"})}${e.time?" · "+e.time:""} · ${esc(e.type)}</small>${e.description?`<div class="muted" style="font-size:.8rem;margin-top:4px">${esc(e.description)}</div>`:""}`;
      item.querySelector("button").addEventListener("click",()=>{events=events.filter(x=>x.id!==e.id);save();render();});
      list.appendChild(item);
    });
  }
  function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const ev={id:Date.now().toString(36),title:document.getElementById("eventTitle").value.trim(),date:dateInput.value,time:document.getElementById("eventTime").value,type:document.getElementById("eventType").value,description:document.getElementById("eventDesc").value.trim()};
    if(!ev.title||!ev.date)return;
    events.push(ev);save();view=new Date(ev.date+"T00:00:00");view.setDate(1);render();
    form.reset();dateInput.value=ev.date;
  });
  document.getElementById("prevMonth").onclick=()=>{view.setMonth(view.getMonth()-1);render()};
  document.getElementById("nextMonth").onclick=()=>{view.setMonth(view.getMonth()+1);render()};
  dateInput.value=iso(new Date());
  render();
});
