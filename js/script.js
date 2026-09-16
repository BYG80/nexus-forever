const header=document.querySelector('.header');
const nav=document.getElementById('nav');
const hamb=document.getElementById('hamb');
const topBtn=document.getElementById('topBtn');

document.getElementById('year').textContent=new Date().getFullYear();

window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>30);
  topBtn.classList.toggle('show',window.scrollY>500);
},{passive:true});

hamb.addEventListener('click',()=>{
  nav.classList.toggle('open');
  hamb.textContent=nav.classList.contains('open')?'✕':'☰';
});

document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open'); hamb.textContent='☰';
}));

topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* Pequeño efecto de partículas decorativas */
const particleBox=document.getElementById('particles');
for(let i=0;i<22;i++){
  const p=document.createElement('i');
  p.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;border-radius:50%;background:rgba(239,208,120,${.15+Math.random()*.35});box-shadow:0 0 8px rgba(239,208,120,.25);animation:drift ${8+Math.random()*14}s linear infinite`;
  particleBox.appendChild(p);
}
const style=document.createElement('style');
style.textContent='@keyframes drift{0%{transform:translateY(20px);opacity:.15}50%{opacity:.6}100%{transform:translateY(-50px);opacity:.05}}';
document.head.appendChild(style);
