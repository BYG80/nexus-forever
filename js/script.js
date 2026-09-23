(()=>{
'use strict';
const K={t:'nexusMusicTime',v:'nexusMusicVolume',m:'nexusMusicMuted'};
let audioEl=null;

function getAudio(){
  if(audioEl && document.body.contains(audioEl)) return audioEl;
  audioEl=document.getElementById('nexus-audio');
  if(!audioEl){
    audioEl=document.createElement('audio');
    audioEl.id='nexus-audio';
    audioEl.src='./audio/nexus-ambient.mp3';
    audioEl.loop=true;
    audioEl.preload='auto';
    document.body.appendChild(audioEl);
  }
  const v=parseFloat(localStorage.getItem(K.v));
  if(!Number.isNaN(v)) audioEl.volume=Math.max(0,Math.min(1,v));
  audioEl.muted=localStorage.getItem(K.m)==='true';
  const t=parseFloat(localStorage.getItem(K.t));
  if(!Number.isNaN(t)) audioEl.addEventListener('loadedmetadata',()=>{try{audioEl.currentTime=t}catch(e){}},{once:true});
  return audioEl;
}
function save(){const a=getAudio();if(Number.isFinite(a.currentTime))localStorage.setItem(K.t,String(a.currentTime));localStorage.setItem(K.v,String(a.volume));localStorage.setItem(K.m,String(a.muted));}
async function play(){const a=getAudio();try{await a.play();document.getElementById('music-unlock')?.remove();return true}catch(e){showUnlock();return false}}
function showUnlock(){if(document.getElementById('music-unlock'))return;const b=document.createElement('button');b.id='music-unlock';b.type='button';b.textContent='🎵 Activar música';Object.assign(b.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:99999,padding:'10px 16px',border:0,borderRadius:'20px',cursor:'pointer'});b.onclick=play;document.body.appendChild(b)}
function setActive(){const p=location.pathname.replace(/\/$/,'')||'/';document.querySelectorAll('.nav-links a').forEach(a=>{const q=new URL(a.href,location.href).pathname.replace(/\/$/,'')||'/';const on=q===p;a.classList.toggle('active',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')})}
function menu(){const t=document.querySelector('.menu-toggle'),n=document.querySelector('.nav-links');if(!t||!n||t.dataset.wired)return;t.dataset.wired='1';t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',String(o))});n.addEventListener('click',e=>{if(e.target.closest('a')){n.classList.remove('open');t.setAttribute('aria-expanded','false')}})}
function loadPageAssets(path){
  const file=path.split('/').pop().toLowerCase()||'index.html';
  const map={
    'calendario.html':{css:'./css/calendario.css',js:'./js/calendario.js'},
    'galeria.html':{css:'./css/galeria.css?v=10',js:'./js/galeria.js?v=10'}
  };
  const cfg=map[file];
  if(!cfg){ if(typeof window.NexusPageInit==='function' && window.NexusPageInit.__page!==file){try{window.NexusPageInit()}catch(e){}}; return; }
  const cssKey=cfg.css.split('?')[0];
  if(!document.querySelector(`link[href^="${cssKey}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href=cfg.css;document.head.appendChild(l)}
  const existing=document.querySelector(`script[data-nexus-page="${file}"]`);
  if(existing){try{window.NexusPageInit?.()}catch(e){};return;}
  const s=document.createElement('script');s.src=cfg.js;s.dataset.nexusPage=file;s.onload=()=>{try{window.NexusPageInit?.()}catch(e){console.error(e)}};document.body.appendChild(s);
}
async function navigate(url,push=true){
  const u=new URL(url,location.href);if(u.origin!==location.origin){location.href=u.href;return}
  save();
  try{
    const r=await fetch(u.href,{credentials:'same-origin',cache:'no-cache'});if(!r.ok)throw new Error(r.status);
    const html=await r.text(),d=new DOMParser().parseFromString(html,'text/html'),m=d.querySelector('main'),c=document.querySelector('main');
    if(!m||!c)throw new Error('main missing');
    c.replaceWith(document.importNode(m,true));
    document.title=d.title;
    const desc=d.querySelector('meta[name="description"]'),cur=document.querySelector('meta[name="description"]');if(desc&&cur)cur.setAttribute('content',desc.getAttribute('content'));
    // Update page-specific stylesheet references.
    const wanted=[...d.head.querySelectorAll('link[rel="stylesheet"]')].map(x=>x.getAttribute('href')).filter(Boolean);
    wanted.forEach(h=>{const key=h.split('?')[0];if(!document.querySelector(`link[href^="${key}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href=h;document.head.appendChild(l)}});
    if(push)history.pushState({nexus:true},'',u.pathname+u.search+u.hash);
    setActive();menu();loadPageAssets(u.pathname);window.scrollTo(0,0);
  }catch(e){location.href=u.href}
}
function links(){document.addEventListener('click',e=>{const l=e.target.closest('a[href]');if(!l||l.target==='_blank'||l.hasAttribute('download')||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const u=new URL(l.href,location.href);if(u.origin!==location.origin||!u.pathname.endsWith('.html'))return;e.preventDefault();navigate(u.href)})}
window.addEventListener('popstate',()=>navigate(location.href,false));window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});
document.addEventListener('DOMContentLoaded',async()=>{getAudio();menu();links();setActive();loadPageAssets(location.pathname);await play();document.addEventListener('pointerdown',play,{capture:true});document.addEventListener('keydown',play,{capture:true})});
window.NexusMusic={play,save,getAudio};
})();
