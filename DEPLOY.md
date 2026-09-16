# NEXUS Forever — GitHub Pages

Este proyecto está preparado para funcionar únicamente con GitHub Pages. No necesita Node.js, Render, Railway, Firebase ni otro servidor.

## Calendario

Los eventos están en `datos/eventos.json`. Para añadir, editar o borrar eventos:

1. Abre el repositorio en GitHub.
2. Entra en `datos/eventos.json`.
3. Pulsa **Edit**.
4. Modifica el JSON.
5. Pulsa **Commit changes**.

La página `calendario.html` lee ese archivo directamente y los cambios aparecen para todos los visitantes después de que GitHub Pages publique la actualización.

## Publicar

En GitHub: **Settings → Pages → Deploy from a branch**, selecciona la rama principal y la carpeta `/ (root)`.
