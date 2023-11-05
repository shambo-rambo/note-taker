const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve static files

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        res.json(JSON.parse(data));
    });
});

// API route to save a note
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    newNote.id = uuidv4();

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        let notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).end();
            }
            res.json(newNote);
        });
    });
});

// API route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).end();
            }
            res.json(notes);
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});