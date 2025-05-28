// Cargar variables de entorno primero
const path = require('path');
console.log('Directorio actual:', __dirname);
console.log('Buscando .env en:', path.resolve(__dirname, '..', '.env'));

require('dotenv').config();

// Verificar que las variables se cargaron correctamente
console.log('Variables de entorno cargadas:', {
    port: process.env.PORT,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbName: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET ? 'Configurado' : 'No configurado',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
});

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Importar rutas (las crearemos después)
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por ventana
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Algo salió mal!'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 

app.get("/api/test", (req, res) => {
    res.json({ message: "✅ Backend activo en Railway" });
});
