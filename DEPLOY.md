# Despliegue recomendado

El ZIP contiene frontend y backend separados.

1. Sube el frontend a tu hosting web.
2. Ejecuta el backend en un servidor Node.js/VPS/servicio que soporte Node.
3. Cambia `window.NEXUS_API_URL` en `js/backend-config.js` por la URL HTTPS del backend.
4. En el `.env` del backend establece:
   - `JWT_SECRET` fuerte y aleatorio.
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `CORS_ORIGIN` = dominio exacto del frontend.
5. Ejecuta `npm install` y `npm start`.

La autenticación y autorización se realizan en el backend; no confíes en variables JavaScript del frontend para los permisos.
