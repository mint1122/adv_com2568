const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const sequelize = new Sequelize( 'database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './database/Book.sqlite3'
});

const Book = sequelize.define('Book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false   
    },
});
sequelize.sync();

app.get('/', (req, res) => {
    res.send('Welcome to the Book');
});

app.get('/books',(req, res) => {
    Book.findAll().then(books => {
        res.json(books);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/book/:id', (req, res) => {
    Book.findByPk(req.params.id).then(book => {
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post('/books', (req, res) => {
    Book.create(req.body).then(book => {
        res.json(book);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.put('/books/:id', (req, res) => {
    Book.findByPk(req.params.id).then(book => {
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        } else {
            book.update(req.body).then(Book => {
                res.json(Book);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/books/:id', (req, res) => {
    Book.findByPk(req.params.id).then(book => {
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        } else {
            book.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
                });
        }
}).catch(err => {
    res.status(500).send(err);
});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));