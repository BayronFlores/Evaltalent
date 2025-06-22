# 🛠️ EvalTalent Backend

Este proyecto contiene la API RESTful y lógica de negocio de EvalTalent, desarrollada en Node.js + Express.

## Funcionalidades principales

- Autenticación JWT y gestión de sesiones.
- CRUD de usuarios, roles y permisos.
- Gestión de evaluaciones y ciclos.
- Generación, almacenamiento y exportación de reportes (PDF/Excel).
- Reportes automáticos programados con node-cron.
- Endpoints para dashboards y métricas agregadas.

## Estructura

```
backend/
├── controllers/   # Lógica de endpoints (usuarios, roles, reportes, etc.)
├── routes/        # Definición de rutas Express
├── services/      # Lógica de negocio (reportes, exportación, etc.)
├── config/        # Configuración de base de datos y variables de entorno
├── middleware/    # Middlewares de autenticación y autorización
├── models/        # Modelos de datos (si aplica)
├── schema.sql     # Esquema de la base de datos SQLite
├── server.js      # Punto de entrada principal
└── .env.example   # Variables de entorno de ejemplo
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```
PORT=3000
DB_HOST=localhost
DB_PORT=2000
DB_NAME=example
DB_USER=example
DB_PASSWORD=12345
JWT_SECRET=tu_jwt_secret
JWT_REFRESH_SECRET=tu_refresh_secret
NODE_ENV=development
```

## Notas

- El backend expone endpoints RESTful bajo `/api`.
- Incluye endpoints para exportar reportes a PDF y Excel.
- Los reportes automáticos se generan y almacenan periódicamente.

---
