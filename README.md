# NEXUS — Veteranos de Azeroth

Web estática preparada para GitHub Pages.

## Estructura
- HTML en la raíz.
- `css/` con los estilos globales y de cada página.
- `js/script.js` con navegación, botón volver arriba y reproductor musical.
- `img/` con el fondo de NEXUS.
- `audio/nexus-ambient.mp3` con una pista ambiental original generada para la web.

## GitHub Pages
1. Sube el contenido de esta carpeta al repositorio `nexus-forever`.
2. En GitHub: **Settings → Pages**.
3. Selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda y espera a que GitHub Pages publique la web.

## Música
La música no se fuerza con sonido al cargar porque los navegadores pueden bloquear el autoplay. El visitante puede pulsar **NEXUS MUSIC** para activarla. La web guarda volumen, silencio y preferencia de reproducción en el navegador.
