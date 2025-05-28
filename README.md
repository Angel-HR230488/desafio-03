# API de Gestión de Libros

API REST para gestionar una biblioteca personal de libros, desarrollada con Express.js y MySQL.

## Requisitos

- Node.js
- MySQL

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd desafio.03
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear archivo `.env` con las siguientes variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=library_db
   JWT_SECRET=tu_secreto
   JWT_EXPIRES_IN=24h
   ```

4. Crear la base de datos:
   - Ejecutar el script SQL en `src/config/database.sql`

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Libros (requieren autenticación)
- `GET /api/books` - Obtener todos los libros del usuario
- `POST /api/books` - Crear un nuevo libro
- `GET /api/books/:id` - Obtener un libro específico
- `PUT /api/books/:id` - Actualizar un libro
- `DELETE /api/books/:id` - Eliminar un libro

## Formato de las Peticiones

### Registro de Usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Crear/Actualizar Libro
```json
{
  "title": "El nombre del libro",
  "author": "Autor del libro",
  "status": "por_leer",
  "start_date": "2024-02-20",
  "end_date": "2024-02-25",
  "comments": "Comentarios sobre el libro"
}
```

## Autenticación

Para las rutas protegidas, incluir el token JWT en el header:
```
Authorization: Bearer <token>
``` 