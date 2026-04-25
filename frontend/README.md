# Parcial Integrador - Frontend

Frontend del parcial integrador desarrollado con React, TypeScript, Vite, Tailwind CSS y TanStack Query.

## Requisitos

- Node.js 18 o superior
- Backend FastAPI corriendo en `http://127.0.0.1:8000`

## Configuración

1. Copiar el archivo `.env.example` como `.env`
2. Verificar la URL del backend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Generar build

```bash
npm run build
```

## Funcionalidades

- CRUD de categorías
- CRUD de ingredientes
- CRUD de productos
- Búsqueda y paginación simple de productos
- Vista de detalle de producto con ruta dinámica
- Integración con FastAPI usando TanStack Query
