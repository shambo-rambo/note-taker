const expres = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.get('api/notes', (req, res) => {
    res.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        res.json(JSON.parse(data));
    });
});

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

app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).end();
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id != noteId);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).end();
            }
            res.json(notes);
        });
    });
});