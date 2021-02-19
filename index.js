const log = console.log;
const fs = require('fs');
//const dir = console.dir;
const express = require('express');
const app = express();
const path = require('path');
const date = require('date-and-time');
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override')


//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body:
app.use(express.json());

 // for put, patch and delete requests
app.use(methodOverride('_method'));

let notesData = require('./notes.json')

// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

let saveCounter = 0;

const saveNotes =  function (notes) {
    try {
        saveCounter++;
        log(" SaveNote 1 =====================================================")  
        log("=====================================================")  
        log("=====================================================")  
        log("saveCounter --->", saveCounter)
        log("notes --->", notes)

        log(" saveNote 2 =====================================================")  
        log("=====================================================")  
        log("=====================================================") 
        const dataJSON = JSON.stringify(notes);
        const notesData2=JSON.parse(dataJSON);

        fs.writeFileSync('notes.json', dataJSON)
        log(" saveNote 3 =====================================================")  
        log("=====================================================")  
        log("=====================================================")  
        log("Saved localNotes --->", dataJSON)
        log("Saved localNotes --->", notesData2)

        log(" saveNote 4 =====================================================")  
        log("=====================================================")  
        log("=====================================================") 

    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }
   
}

// app.use('/',(req,res,next) => {
    
// //     notesData = require('./notes.json');
// //     res.render('notes', { notesData });
// log(" app.use =====================================================")  
//         log("=====================================================")  
//         log("=====================================================")  

//         log("notesData --->", notesData)

//         log("=====================================================")  
//         log("=====================================================")  
//         log("=====================================================")  
//      saveNotes(notesData);
    
//  next();
// })

//let localNotes = require('./notes.json')
const NoteObj = require('./public/lib/NotesObj');



const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

notesData22 = [
    {"id":"f9f44f47-0513-4c72-8025-d863516de97c","title":"MDN","text":"Using the card component, you can extend the default collapse behavior to create an accordion. To properly achieve the accordion style, be sure to use ","date":"Sun, Feb 07 2021"},
    {"id":"0237e363-e13f-40b0-9300-3f1e7f020500","title":"EJS Template","text":"Node.js date and time are handled with the Javascript Date object. It is loaded by default and requires no import of modules.","date":"Sun, Feb 07 2021"},
    {"id":"358d7aa6-d272-48fc-ba27-6310a9ec32f3","title":"Developer","text":"Node.js date and time are handled with the Javascript Date object. It is loaded by default and requires no import of modules. ","date":"Sun, Feb 07 2021"},
    {"id":"426b175c-a305-4c7f-8e60-7ff2d47ed0aa","title":"Adam school at 9","text":"First day at school","date":"Sun, Feb 07 2021"},
    {"id":"8cc41f71-04b1-49aa-88bf-2573693f8508","title":"Team Meeting @9:30AM","text":"Meeting with client to review next project requirements.","date":"Sun, Feb 07 2021"}
]


function timeStamp() {
    const now = new Date();
    const pattern = date.compile('ddd, MMM DD YYYY');
    return date.format(now, pattern);                  // => 'Fri, Jan 02 2021
}



const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

// Display all Notes
// app.get('/',(req,res) => {
//     // log("rendring notes")
//     res.render('notes/index', { notesData })
// })

// Display all Notes
app.get('/notes',(req,res) => {
    // log("rendring notes")
    res.render('notes/index', { notesData })
})

//Add a note - rendring a form - 
// first get the form then then post the new note
app.get('/notes/new',(req,res) => {
    res.render('notes/new')
})


//create a new note
app.post('/notes' ,(req, res) => {
    try {       
        const note = new NoteObj(
            uuidv4(),
            req.body.title,
            req.body.text,
            timeStamp()
        )    
        log(" app.post 1 =====================================================")  
        log("=====================================================")  
        log("=====================================================")  

        log("note --->", note)

        log(" app.post 2 ======================================================")  
        log("=====================================================")  
        log("=====================================================")  

        

        notesData.push(note)
        log(" app.post 3  ======================================================")  
        log("=====================================================")  
        log("=====================================================")  

        log("notesData --->", notesData)

        log(" app.post 4 ======================================================")  
        log("=====================================================")  
        log("=====================================================")  
       // addNotes(req.body.title, req.body.text);
       saveNotes(notesData);
        res.redirect('/notes');      
        
    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }   
})

// End of Add notes section


// ---------------------- Edit/Update a note

//Edit form - need method-override 
app.get('/notes/:id/edit',(req,res) => {
    const { id } = req.params;

    log(" app.get Edit 1 ======================================================")  
    log("=====================================================")  
    log("=====================================================")  

    log("req.parm: ===========> ", req.params)
    log("notesData =================> ", notesData)

    log(" app.get Edit 2 =====================================================")  
    log("=====================================================")  
    log("=====================================================")  

     const note = notesData.find(i => i.id === id)

    log("note =================> ", note)

    log("  app.get 3 =====================================================")  
    log("=====================================================")  
    log("=====================================================")  
    res.render('notes/edit', { note })
})

//Edit/Update a note
app.patch('/notes/:id',(req, res)=>{
    const { id } = req.params;
    const foundNote = notesData.find(i => i.id === id)

    const newTtitle = req.body.title;
    const newText = req.body.text;
    
    foundNote.title = newTtitle;
    foundNote.text = newText;
    saveNotes(notesData);
    res.redirect('/notes')
    
    


})



//Get a note
app.get('/notes/:id',(req,res) => {
    const { id } = req.params;
    const note = notesData.find(i => i.id === id)
    res.render('notes/delete', { note })
})


// --------------------------------------Delete a note

app.delete('/notes/:id',(req, res)=>{
    const { id } = req.params;
    notesData = notesData.filter(d => d.id !== id);
    //saveNotes(notesData)
    saveNotes(notesData);
    res.redirect('/notes')
 
})


app.listen(PORT, () => {
    log("Listning on port", PORT)
})





const getNotes = function() {
    return JSON.parse(loadNotes()); 
}

const addNotes = (title, text) => {

    try {
        const notes = loadNotes()
  
        const note = new NoteObj(
            uuidv4(),
            title,
            text,
            timeStamp()
        )      
        notes.push(note);
        saveNotes(notes)       
    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }
   
}
const removeNote = (title) => {
    const notes = loadNotes()
    const notesToKeep = notes.filter((note) => note.title !== title)

    if (notes.length > notesToKeep.length) {
        console.log(chalk.green.inverse('Note removed!'))
        saveNotes(notesToKeep)
    } else {
        console.log(chalk.red.inverse('No note found!'))
    }    
}

const listNotes = () => {
    const notes = loadNotes()

    console.log(chalk.inverse('Your notes'))

    notes.forEach((note) => {
        console.log(note.title)
    })
}

const readNote = (title) => {
    const notes = loadNotes()
    const note = notes.find((note) => note.title === title)

    if (note) {
        console.log(chalk.inverse(note.title))
        console.log(note.body)
    } else {
        console.log(chalk.red.inverse('Note not found!'))
    }
}
