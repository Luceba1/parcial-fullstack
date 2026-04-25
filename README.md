# Parcial 1 - Desarrollo de Aplicaciones Web y Móviles

## Integrantes
- Lucas Pujada
- Gianfranco Canciani
- Julio Leiva
- Bruno Rivera

## Descripción
Este repositorio contiene el proyecto del **Primer Parcial** de **Desarrollo de Aplicaciones Web y Móviles** de la **UTN**.

Se desarrolló una aplicación **Full Stack** para la gestión de:

- Categorías
- Ingredientes
- Productos

La solución integra:

- **Backend** con FastAPI, SQLModel y PostgreSQL
- **Frontend** con React, TypeScript, Tailwind CSS y TanStack Query
- Persistencia real en base de datos
- Relaciones entre entidades
- Navegación con rutas dinámicas
- CRUD completo de punta a punta

## Tecnologías utilizadas

### Backend
- FastAPI
- SQLModel
- PostgreSQL
- Pydantic
- Uvicorn

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router DOM

## Estructura del proyecto

```text
parcial-fullstack/
├── backend/
├── frontend/
├── README.md
└── CHECKLIST.md
```

## Funcionalidades principales
- CRUD completo de categorías
- CRUD completo de ingredientes
- CRUD completo de productos
- Relación entre productos, categorías e ingredientes
- Búsqueda y paginación en productos
- Ruta dinámica para detalle de producto
- Validaciones en backend y frontend
- Sincronización automática del estado con TanStack Query

## Backend

### Requisitos
- Python 3.10 o superior
- PostgreSQL

### Instalación
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Configuración
Crear un archivo `.env` dentro de `backend/` con una estructura como esta:

```env
APP_NAME=Parcial Integrador Catálogo
DATABASE_URL=postgresql+psycopg://postgres:TU_PASSWORD@localhost:5432/parcial_catalogo
BACKEND_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SQL_ECHO=false
```

### Ejecución
```bash
uvicorn app.main:app --reload
```

Backend disponible en:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs

## Frontend

### Requisitos
- Node.js

### Instalación
```bash
cd frontend
npm install
```

### Ejecución
```bash
npm run dev
```

Frontend disponible en:
- http://localhost:5173

## Video de presentación
Link al video: **PEGAR_AQUI_LINK_DEL_VIDEO**

## Repositorio
Link del repositorio: **PEGAR_AQUI_LINK_DEL_REPOSITORIO**

## Autoría
Trabajo realizado por:
- Lucas Pujada
- Gianfranco Canciani
- Julio Leiva
- Bruno Rivera
