//import modules
const express = require('express');
const fs = require("fs");

// start the server
const app = express();
app.listen(process.env.PORT || 8080, () => console.log('ALL GOOD HERE'));

// setup express for data handling 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//route for index page
app.get('/', (req, res) => {
    fs.readFile(__dirname + "/public/index.html", function(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

// route for listing notes
app.get('/notes', (req, res) => {
    fs.readFile(__dirname + "/public/notes.html", function(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

// route for the api of notes
app.get('/api/notes', (req, res) => {
    // read the json file 
    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) {
            throw err;
        }
        // send back the response 
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
    });
});

// get form data and add to the database file
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    let allNotes = [];

    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) { throw err; }
        allNotes = JSON.parse(data);
        newNote.id = allNotes.length + 1;
        allNotes.push(newNote);
        console.log(allNotes);
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(allNotes), function(err) {
            if (err) throw err;
            console.log('Saved!');

        });
        res.end();

    });
});
// remove item from the database file
app.delete("/api/notes/:id", function(req, res) {
    const removeNoteId = req.params.id;
    console.log(removeNoteId);

    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) { throw err; }
        const removeNote = JSON.parse(data).filter(function(item) {
            return item.id != removeNoteId;
        });

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(removeNote), function(err) {
            if (err) { throw err; }
            res.send();
        });

    });
});