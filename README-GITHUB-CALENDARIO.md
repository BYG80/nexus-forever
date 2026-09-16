# Calendario de NEXUS Forever — opción A (solo GitHub)

El calendario no utiliza Node.js, Render, Firebase ni ningún servidor externo.

## Dónde se guardan los eventos

Todos los eventos están en:

`datos/eventos.json`

## Cómo añadir un evento

1. Abre `datos/eventos.json` en GitHub.
2. Pulsa el lápiz **Edit this file**.
3. Añade un objeto dentro de `eventos` siguiendo este formato:

```json
{
  "id": "raid-2026-09-25",
  "fecha": "2026-09-25",
  "hora": "21:30",
  "titulo": "Raid de hermandad",
  "tipo": "Raid",
  "descripcion": "Raid semanal de NEXUS Forever."
}
```

4. Guarda con **Commit changes**.
5. GitHub Pages publicará el cambio automáticamente.

## Seguridad

No hay contraseña dentro de la web. La seguridad de edición la proporciona GitHub: únicamente las cuentas con permiso de escritura en el repositorio pueden modificar `datos/eventos.json`.

El calendario es público y cualquier visitante puede verlo.
