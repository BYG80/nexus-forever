(() => {
  const KEY='nexusAdminSession';
  // Cambia estas credenciales antes de publicar la web. Esto protege la interfaz,
  // pero para seguridad real en Internet hace falta un servidor/backend.
  const USER='admin';
  const PASS='NexusForever2026!';
  const isAdmin=()=>sessionStorage.getItem(KEY)==='1';
  const setAdmin=v=>v?sessionStorage.setItem(KEY,'1'):sessionStorage.removeItem(KEY);
  window.NexusAuth={isAdmin,setAdmin,USER,PASS};
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-admin-only]').forEach(el=>{el.hidden=!isAdmin();});
    document.querySelectorAll('[data-login-link]').forEach(el=>{el.href=isAdmin()?'#':'login.html';el.textContent=isAdmin()?'Panel administrador':'Acceso administrador';});
    document.querySelectorAll('[data-logout]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();setAdmin(false);location.reload();}));
  });
})();
