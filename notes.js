const log = console.log;
const fs = require('fs');
const path = require('path');
const date = require('date-and-time');
const express = require('express');
const app = express();

const dbpath = (path.join(__dirname, './public/db' ))
const notes = require('./public/db/notes.json')

const IdGen = require('./public/lib/IdGen');
const NoteObj = require('./public/lib/NotesObj');


app.use(express.static(path.join(__dirname, 'public')));

var start = 1;
var end = 25;
var noteId = new IdGen(start, end)
var idList = noteId.getNewId();

var idCounter = 0;
var idSequence = 0;

function timeStamp() {
    const now = new Date();
    const pattern = date.compile('ddd, MMM DD YYYY');
    return date.format(now, pattern);                  // => 'Fri, Jan 02 2021
}



const getNotes = function() {
    return JSON.parse(loadNotes()); 
}

const addNotes = function(title, text){
    idCounter = idList[idSequence];
    idSequence++
    try {
        const notes = loadNotes()
        const note = new NoteObj(
            idCounter,
            title,
            text,
            timeStamp()
        )
        notes.push(note);
        saveNotes(notes)
        log("Note added")
        
    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }
   
}

const saveNotes = function (notes) {
    try {
        const dataJSON = JSON.stringify(notes);
        fs.writeFileSync('notes.json', dataJSON)
    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }
   
}

const loadNotes = function() {
    try {
        const dataBuffer = fs.readFileSync(notes)
        const dataJSON = dataBuffer.toString()
        log(dataJSON)
        log("00000000000000000000000000000000000")
        log(" =====================================");
        log("                           ");
        log("                           ");
        log("                           ");
        log(" =====================================");
        log(JSON.parse(dataJSON))
       // return JSON.parse(dataJSON)
        return 
    } catch (e) {
        return []
    }
}



module.exports = {
    addNotes: addNotes,
    // removeNote: removeNote,
  //  listNotes: listNotes,
   // readNote: readNote,
    getNotes: getNotes
}