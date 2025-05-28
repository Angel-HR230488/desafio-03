const Book = require('../models/book.model');

const createBook = async (req, res) => {
    try {
        const bookData = {
            ...req.body,
            user_id: req.user.id
        };

        const bookId = await Book.create(bookData);
        const book = await Book.findById(bookId, req.user.id);

        res.status(201).json({
            status: 'success',
            data: { book }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el libro'
        });
    }
};

const getUserBooks = async (req, res) => {
    try {
        const books = await Book.findByUserId(req.user.id);
        res.json({
            status: 'success',
            data: { books }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los libros'
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id, req.user.id);
        
        if (!book) {
            return res.status(404).json({
                status: 'error',
                message: 'Libro no encontrado'
            });
        }

        res.json({
            status: 'success',
            data: { book }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el libro'
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const updated = await Book.update(req.params.id, req.user.id, req.body);
        
        if (!updated) {
            return res.status(404).json({
                status: 'error',
                message: 'Libro no encontrado'
            });
        }

        const book = await Book.findById(req.params.id, req.user.id);
        res.json({
            status: 'success',
            data: { book }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el libro'
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const deleted = await Book.delete(req.params.id, req.user.id);
        
        if (!deleted) {
            return res.status(404).json({
                status: 'error',
                message: 'Libro no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Libro eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el libro'
        });
    }
};

module.exports = {
    createBook,
    getUserBooks,
    getBookById,
    updateBook,
    deleteBook
}; 