# Migration Form Oracle

Sistema de migración de formularios Oracle con backend en NestJS y frontend en Angular.

## 🚀 Instalación y Configuración

### Backend

Para levantar el backend es necesario contar con Docker:

1. Navega hacia el directorio `backend-api`:
   ```bash
   cd server/backend-api
   ```

2. Crea el archivo `.env` en la raíz del directorio `backend-api` y copia el contenido de .env.example (deje hacord el valor de todas las variables)

3. Ejecuta el comando para levantar los servicios:
   ```bash
   docker-compose up
   ```

   Esto va a correr y levantar:
   - Imagen de Node.js
   - PostgreSQL
   - Creación del schema con seeders mínimos de prueba

### Frontend

El frontend no está dockerizado y requiere instalación manual:

1. Navega hacia el directorio del frontend:
   ```bash
   cd client/frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Levanta el servidor de desarrollo:
   ```bash
   ng serve
   ```

## 🧪 Testing

Para ejecutar los tests unitarios del backend:

```bash
cd server/backend-api
npm run test
```

## 📁 Estructura del Proyecto

```
migration-form-oracle/
├── client/
│   └── frontend/          # Aplicación Angular
├── server/
│   └── backend-api/       # API NestJS
└── docs/                  # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: Angular, PrimeNG
- **Base de datos**: PostgreSQL con Docker
- **Herramientas**: Docker, Docker Compose

## 📋 Módulos

- **Módulo Automotor**: Gestión de vehículos
- **Módulo Sujeto**: Gestión de personas/propietarios

## 🔗 Endpoints de la API

### Automotores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `api/automotores` | Crear un nuevo automotor |
| `GET` | `api/automotores` | Obtener lista de automotores (con paginación) |
| `GET` | `api/automotores/:dominio` | Obtener automotor por dominio |
| `PUT` | `api/automotores/:dominio` | Actualizar automotor por dominio |
| `DELETE` | `api/automotores/:dominio` | Eliminar automotor por dominio elimina en cascada|

### Sujetos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `api/sujetos` | Crear un nuevo sujeto |
| `GET` | `api/sujetos/by-cuit?cuit=12345678901` | Obtener sujeto por CUIT |

### Parámetros de consulta

- **Paginación**: Los endpoints de listado soportan parámetros de paginación (`page`, `limit`)
- **Dominio**: Identificador único del automotor
- **CUIT**: Código Único de Identificación Tributaria del sujeto
