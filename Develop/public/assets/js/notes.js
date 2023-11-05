const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    fs.readFile('./db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server Error');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile('./db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server Error');
        }
    const notes = JSON.parse(data);
    newNoteBtn.id = Date.now();
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
            return res.status(500).end();
        }
        res.json(newNote);
        });
    });
});

app.delete('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('server error');
        }
        const notes = JSON.parse(data);
        const updatedNotes = notes.filter(note => note.id != noteId);
        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
            if (err) {
                return res.status(500).send('server error');
            }
            res.json({ success : true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});

