const mysql = require('mysql2/promise');

console.log('Intentando conectar a la base de datos con:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión inmediatamente
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos exitosa');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        console.error('Detalles del error:', error);
    }
};

testConnection();

module.exports = pool; 