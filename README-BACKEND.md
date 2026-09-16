# NEXUS Forever — Full Stack

## Qué incluye
- Web pública NEXUS Forever.
- Calendario de hermandad conectado a base de datos SQLite.
- Login real en backend.
- Contraseñas almacenadas mediante bcrypt.
- JWT con caducidad de 8 horas.
- Solo usuarios con `role=admin` pueden crear, editar o eliminar eventos.
- El navegador nunca decide quién es administrador.
- Favicon, galería y música de la versión anterior.

## Puesta en marcha local

Requisitos: Node.js 20+.

1. Entra en `backend/`.
2. Copia `.env.example` como `.env`.
3. Cambia `JWT_SECRET` por una clave aleatoria de 32+ caracteres.
4. Cambia `ADMIN_PASSWORD` por una contraseña fuerte.
5. Ejecuta:
   `npm install`
6. Ejecuta:
   `npm start`

La base de datos se crea automáticamente en `backend/data/nexus.db`.

## Importante para producción
- Usa HTTPS.
- No publiques `.env`.
- Cambia las credenciales iniciales.
- Configura `CORS_ORIGIN` con el dominio real de la web.
- Haz copias de seguridad de `backend/data/nexus.db`.

## API
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/events`
- `POST /api/events` (admin)
- `PUT /api/events/:id` (admin)
- `DELETE /api/events/:id` (admin)
