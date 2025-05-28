const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res) => {
    try {
        console.log('Iniciando registro de usuario:', req.body);
        const { email, password } = req.body;

        // Verificar si el usuario ya existe
        console.log('Buscando usuario existente...');
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        console.log('Creando nuevo usuario...');
        const userId = await User.create(email, password);
        console.log('Usuario creado con ID:', userId);

        // Verificar variables para JWT
        console.log('Variables JWT:', {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Generar token
        console.log('Generando token...');
        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET || 'mi_clave_secreta_super_segura',
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            }
        );
        console.log('Token generado exitosamente');

        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    id: userId,
                    email
                }
            }
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar usuario: ' + error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'mi_clave_secreta_super_segura',
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            }
        );

        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión'
        });
    }
};

module.exports = {
    register,
    login
}; 