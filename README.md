# NEXUS Forever

Web estática de la hermandad NEXUS — Veteranos de Azeroth, preparada para publicarse directamente con GitHub Pages.

## Estructura

- HTML, CSS y JavaScript en el repositorio.
- Imágenes y música incluidas localmente.
- `datos/eventos.json` contiene los eventos del calendario.
- `.github/workflows/pages.yml` publica el sitio en GitHub Pages.

## Calendario

El calendario no utiliza servidor ni servicios externos. Para añadir, editar o eliminar eventos, abre `datos/eventos.json` en GitHub, pulsa **Edit**, modifica el contenido y haz **Commit changes**. Los visitantes verán los eventos cuando GitHub Pages publique el cambio.

### Formato de evento

```json
{
  "id": "raid-2027-04-24",
  "date": "2027-04-24",
  "time": "21:30",
  "title": "Raid de hermandad",
  "type": "Raid",
  "description": "Detalles del evento"
}
```

No hay acceso de administrador dentro de la web. La capacidad de editar el calendario queda limitada a quienes tengan permisos de escritura en el repositorio de GitHub.


## Galería

La galería no permite subir imágenes desde la web. Para añadir imágenes: sube el archivo a `img/galeria/` desde GitHub y añade su entrada en `datos/galeria.json`. Después de hacer commit, GitHub Pages publicará el cambio.
