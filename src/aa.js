const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Ensure database directory exists and use consistent path
const dbDir = path.resolve(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'Book.sqlite3');
const db = new sqlite3.Database(dbPath);

// Create table
db.run(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL
    )
`);

// Get all books
app.get("/books", (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// Get book by id
app.get("/books/:id", (req, res) => {
    db.get(
        "SELECT * FROM books WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json(err);
            if (!row) return res.status(404).send("Book not found");
            res.json(row);
        }
    );
});

// Create book
app.post("/books", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).send("Title and author are required");
    }

    db.run(
        "INSERT INTO books (title, author) VALUES (?, ?)",
        [title, author],
        function (err) {
            if (err) return res.status(500).json(err);
            res.status(201).json({
                id: this.lastID,
                title,
                author
            });
        }
    );
});

// Update book
app.put("/books/:id", (req, res) => {
    const { title, author } = req.body;

    db.run(
        "UPDATE books SET title = ?, author = ? WHERE id = ?",
        [title, author, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            if (this.changes === 0) {
                return res.status(404).send("Book not found");
            }
            res.json({
                id: req.params.id,
                title,
                author
            });
        }
    );
});

// Delete book
app.delete("/books/:id", (req, res) => {
    db.run(
        "DELETE FROM books WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            if (this.changes === 0) {
                return res.status(404).send("Book not found");
            }
            res.status(204).send();
        }
    );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
