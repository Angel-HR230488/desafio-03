const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
    createBook,
    getUserBooks,
    getBookById,
    updateBook,
    deleteBook
} = require('../controllers/book.controller');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de libros
router.post('/', createBook);
router.get('/', getUserBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router; 