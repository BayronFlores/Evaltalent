# 🖥️ EvalTalent Frontend

Este proyecto contiene la interfaz de usuario de EvalTalent, desarrollada en React + TypeScript.

## Funcionalidades principales

- Login seguro y gestión de sesiones.
- Dashboards personalizados para administradores, gerentes y empleados.
- Gestión visual de usuarios, roles y permisos.
- Módulo de evaluaciones: asignación, seguimiento y visualización de resultados.
- Generación y exportación de reportes (PDF/Excel).
- Visualización de métricas y gráficos interactivos.

## Estructura

```
src/
├── pages/         # Vistas principales (Login, Dashboard, Usuarios, Evaluaciones, Reportes)
├── components/    # Componentes reutilizables (modales, tablas, gráficos, etc.)
├── redux/         # Slices y store de Redux Toolkit
├── services/      # Lógica de consumo de API
├── assets/        # Recursos estáticos
├── App.tsx        # Enrutador principal
├── main.tsx       # Punto de entrada
└── index.css      # Configuración de Tailwind
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Variables de entorno

Crea un archivo `.env` en la raíz con la URL de la API backend:

```
VITE_API_URL=http://localhost:5000/api
```

## Notas

- Requiere que el backend esté corriendo para funcionar correctamente.
- Para desarrollo, puedes usar [Vite](https://vitejs.dev/) o [Create React App].

---
