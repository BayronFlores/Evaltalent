# 📊 EvalTalent – Plataforma Integral de Evaluación del Desempeño Laboral

EvalTalent es una aplicación web moderna para la gestión, seguimiento y análisis del desempeño laboral en organizaciones. Permite a administradores, gerentes y empleados participar en procesos de evaluación, asignar tareas, visualizar resultados y generar reportes automáticos y personalizados.

---

## Requisitos previos

Node.js 18+
npm 9+
PostgreSQL (o la base de datos que uses)
Git

## 🚀 Tecnologías Utilizadas

### Frontend

- ✅ [React 18+](https://reactjs.org/)
- 🎨 [TailwindCSS](https://tailwindcss.com/)
- 🔄 [Redux Toolkit](https://redux-toolkit.js.org/)
- 📊 [Chart.js](https://www.chartjs.org/) y [Recharts](https://recharts.org/)
- ✨ TypeScript + React
- 🧩 Material UI (MUI)

### Backend

- 🟢 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- 🗄️ [SQLite](https://www.sqlite.org/) (persistencia ligera)
- 🔐 [JWT](https://jwt.io/) para autenticación
- 🗂️ [PDFKit](https://pdfkit.org/) y [ExcelJS](https://github.com/exceljs/exceljs) para exportación de reportes
- ⏰ [node-cron](https://www.npmjs.com/package/node-cron) para reportes automáticos

---

## 🎯 Objetivos del Proyecto

- Digitalizar y estandarizar la evaluación del talento humano.
- Automatizar procesos de RRHH con formularios dinámicos y reportes exportables (PDF/Excel).
- Proveer dashboards personalizados y métricas en tiempo real para cada tipo de usuario.
- Permitir la gestión avanzada de roles y permisos.
- Facilitar la toma de decisiones basada en datos.

---

## 👤 Usuarios del Sistema

- **Administradores (RRHH):** Gestión de usuarios, roles, ciclos, reportes y permisos.
- **Gerentes/Evaluadores:** Asignación y seguimiento de evaluaciones, feedback y reportes de equipo.
- **Empleados:** Visualización de su progreso, resultados y próximos objetivos.

---

## 📂 Estructura del Proyecto

/evaltalent
├── frontend/ # Aplicación React (interfaz de usuario)
└── backend/ # API RESTful (Node.js + Express)

---

## 🧪 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/evaltalent.git
cd evaltalent
```

### 2. Instalar dependencias

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del backend con el siguiente contenido (ajusta los valores según tu entorno):

PORT: El puerto en el que corre tu servidor backend (por ejemplo, http://localhost:5000).
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD: Datos de conexión a tu base de datos PostgreSQL (o la que uses).
JWT_SECRET, JWT_REFRESH_SECRET: Claves secretas para firmar y verificar los tokens JWT (autenticación y refresh).
NODE_ENV: El entorno de ejecución (development, production, etc.).

### 4. Iniciar servidores de desarrollo

#### Frontend

```bash
cd frontend
npm run dev
```

#### Backend

```bash
cd backend
npm run dev
```

---

## 📖 Documentación

- [Manual de usuario y API en construcción]
- Para detalles técnicos, revisa los README individuales en `/frontend` y `/backend`.

---
