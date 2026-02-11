const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Database/SQBooks.sqlite'
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
    }
}, {
    tableName: 'books',
    freezeTableName: true
});

sequelize.sync();

app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        res.status(500).send(err);
    }
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
