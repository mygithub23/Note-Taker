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

notesData = [
    {"id":"f9f44f47-0513-4c72-8025-d863516de97c","title":"MDN ","text":"Using the card component, you can extend the default collapse behavior to create an accordion. To properly achieve the accordion style, be sure to use ","date":"Sun, Feb 07 2021"},
    {"id":"0237e363-e13f-40b0-9300-3f1e7f020500","title":"EJS Template ","text":"Node.js date and time are handled with the Javascript Date object. It is loaded by default and requires no import of modules.","date":"Sun, Feb 07 2021"},
    {"id":"358d7aa6-d272-48fc-ba27-6310a9ec32f3","title":"Developer","text":"Node.js date and time are handled with the Javascript Date object. It is loaded by default and requires no import of modules. ","date":"Sun, Feb 07 2021"},
    {"id":"426b175c-a305-4c7f-8e60-7ff2d47ed0aa","title":"Adam school at 9","text":"First day at school","date":"Sun, Feb 07 2021"},
    {"id":"8cc41f71-04b1-49aa-88bf-2573693f8508","title":"Team Meeting @9:30AM","text":"Meeting with client to review next project requirements.","date":"Sun, Feb 07 2021"}
]

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