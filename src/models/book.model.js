const pool = require('../config/database');

class Book {
    static async create(bookData) {
        const [result] = await pool.execute(
            'INSERT INTO books (user_id, title, author, status, start_date, end_date, comments) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [bookData.user_id, bookData.title, bookData.author, bookData.status, bookData.start_date, bookData.end_date, bookData.comments]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    static async findById(id, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM books WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    }

    static async update(id, userId, bookData) {
        const [result] = await pool.execute(
            'UPDATE books SET title = ?, author = ?, status = ?, start_date = ?, end_date = ?, comments = ? WHERE id = ? AND user_id = ?',
            [bookData.title, bookData.author, bookData.status, bookData.start_date, bookData.end_date, bookData.comments, id, userId]
        );
        return result.affectedRows > 0;
    }

    static async delete(id, userId) {
        const [result] = await pool.execute(
            'DELETE FROM books WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Book; 