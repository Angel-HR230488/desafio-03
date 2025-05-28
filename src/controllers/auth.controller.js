// auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ajusta el path según tu proyecto

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Busca el usuario en la base de datos
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    // Verifica la contraseña
    const validPassword = await User.verifyPassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    // Genera el token JWT usando las variables de entorno configuradas
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Devuelve la respuesta con el token y datos básicos del usuario
    return res.json({ 
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en login' });
  }
};

module.exports = {
  login,
  // ... otros métodos (por ejemplo, register)
};
