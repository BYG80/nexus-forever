# NEXUS — versión web preparada

## Cambios incluidos

- SEO técnico en todas las páginas: `title`, `description`, `robots`, canonical y Open Graph/Twitter.
- `sitemap.xml` y `robots.txt`.
- Navegación móvil corregida con `aria-expanded` y estado de menú.
- Música global unificada: se elimina el código duplicado y se conserva la posición entre páginas mediante `localStorage`.
- Nueva página PvP con contenido específico de **campos de batalla (BG)** y **arenas**.
- Nueva sección de reclutamiento con formulario completo: personaje, raza, clase, rol, nivel, profesiones, especialización, experiencia, contenido preferido, horarios, Discord y presentación.
- Mejoras de accesibilidad y foco de formularios.
- Enlaces y estructura HTML revisados para mantener una sola etiqueta H1 por página.

## Formulario de reclutamiento

La web es estática. Para recibir las solicitudes sin montar un backend, el formulario usa FormSubmit.

Antes de publicar, abre `reclutamiento.html` y cambia:

`https://formsubmit.co/TU_EMAIL_AQUI`

por el correo donde quieres recibir las solicitudes.

Ejemplo:

`https://formsubmit.co/tu-correo@dominio.com`

La primera vez que FormSubmit reciba una solicitud puede pedir confirmar el correo de destino.

### Importante

No pongas una contraseña, token o webhook privado dentro del HTML/JavaScript. Todo lo que se publica en una web estática es visible para los visitantes.

## Publicación

Sube el contenido de esta carpeta conservando esta estructura:

- `index.html`
- `historia.html`
- `raids.html`
- `mazmorras.html`
- `logros.html`
- `profesiones.html`
- `pvp.html`
- `comunidad.html`
- `calendario.html`
- `galeria.html`
- `reclutamiento.html`
- `normas.html`
- `css/`
- `js/`
- `img/`
- `audio/`
- `datos/`
- `favicon.ico`
- `robots.txt`
- `sitemap.xml`

Si utilizas GitHub Pages, publica exactamente esta carpeta como contenido del repositorio.

## SEO después de publicar

1. Comprueba que la URL canónica coincide con el dominio definitivo.
2. Si cambias de dominio, sustituye `https://byg80.github.io/nexus-forever/` en los HTML, `robots.txt` y `sitemap.xml`.
3. Registra el dominio en Google Search Console y envía `sitemap.xml`.
4. Comprueba que las páginas no estén bloqueadas por `robots.txt`.
5. No necesitas repetir palabras clave de forma artificial: el contenido visible, títulos, enlaces internos y estructura semántica son más importantes.
