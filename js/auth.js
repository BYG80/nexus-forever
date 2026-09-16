(() => {
  const KEY='nexusAdminSession';
  // Cambia estas credenciales antes de publicar la web. Esto protege la interfaz,
  // pero para seguridad real en Internet hace falta un servidor/backend.
  const USER='byg80s';
  const PASS='NexusForever2026!';
  const isAdmin=()=>sessionStorage.getItem(KEY)==='1';
  const setAdmin=v=>{if(v) sessionStorage.setItem(KEY,'1'); else sessionStorage.removeItem(KEY);};
  window.NexusAuth={isAdmin,setAdmin,USER,PASS};
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-admin-only]').forEach(el=>{el.hidden=!isAdmin();});
    document.querySelectorAll('[data-admin-nav]').forEach(el=>{el.hidden=!isAdmin();});
    document.querySelectorAll('[data-admin-nav]').forEach(el=>{el.hidden=!isAdmin(); el.href='calendario.html'; el.textContent='Administrador';});
    document.querySelectorAll('[data-login-link]').forEach(el=>{el.hidden=isAdmin(); el.href='login.html'; el.textContent='Acceso administrador';});
    document.querySelectorAll('[data-logout]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();setAdmin(false);location.reload();}));
  });
})();
