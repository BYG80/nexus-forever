# NEXUS Forever

Frontend de NEXUS Forever preparado para GitHub Pages y backend Node.js.

## Raíz del repositorio
La web está directamente en la raíz: `index.html`, `css/`, `js/`, `img/`, `audio/`, etc.

## Backend
`backend/` contiene la API Node.js, autenticación, SQLite y permisos de administrador.

GitHub Pages NO ejecuta Node.js. El backend debe desplegarse en un servicio/servidor Node.js y después hay que poner su URL HTTPS en `js/backend-config.js`.

No subas nunca `backend/.env` ni contraseñas reales a GitHub.
