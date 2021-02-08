const log = console.log;
const fs = require('fs');
//const dir = console.dir;
const express = require('express');
const app = express();
const path = require('path');
const date = require('date-and-time');
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override')



let notesData = require('./notes.json')
const NoteObj = require('./public/lib/NotesObj');


app.use(methodOverride('_method'));

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body:
app.use(express.json());
// To 'fake' put/patch/delete requests:
// app.use(methodOverride('_method'))
// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

//  const dataJSON = notes.getNotes;
//  log(dataJSON)
 //let notesData = notes.getNotes()


// log(" =====================================");
// log("                           ");
// log("                           ");
// log("                           ");
// log(" =====================================");
// log(JSON.parse(dataJSON))
// const notesData = JSON.parse(dataJSON);



function timeStamp() {
    const now = new Date();
    const pattern = date.compile('ddd, MMM DD YYYY');
    return date.format(now, pattern);                  // => 'Fri, Jan 02 2021
}



const getNotes = function() {
    return JSON.parse(loadNotes()); 
}

const addNotes = (title, text) => {

    try {
        const notes = loadNotes()
      
        log(" =====================================");
        log("                           ");
        log("      NOTES FROM LOADNOTES()                     ");
        log(notes)
        log("                           ");
        log(" =====================================");
        const note = new NoteObj(
            uuidv4(),
            title,
            text,
            timeStamp()
        )
        
        log(" =====================================");
        log("                           ");
        log("    NOTES BOFORE PUSH                       ");
        log(notes)
        log("                           ");
        log(" =====================================");

        notes.push(note);

        
        log(" =====================================");
        log("                           ");
        log("         NOTES  AFTER PUSH                ");
        log(notes)
        log("                           ");
        log(" =====================================");
        saveNotes(notes)
        log("*************************** Note added")
        
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

const saveNotes =  async (notes) => {
    try {
        const dataJSON = JSON.stringify(notes);
        await fs.writeFileSync('notes.json', dataJSON)
    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }
   
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        log(dataJSON)
        log("00000000000000000000000000000000000")
        log(" =====================================");
        log("                           ");
        log("                           ");
        log("                           ");
        log(" =====================================");
        log(JSON.parse(dataJSON))
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}


// log(" =====================================");
// log("                           ");
// log("                           ");
// log("                           ");
// log(" =====================================");




// Display all Notes
app.get('/notes',(req,res) => {
    // log("rendring notes")
    res.render('notes/index', { notesData })
})
// Display all Notes
app.get('/notes/index',(req,res) => {
    // log("rendring notes")
    res.render('notes/index', { notesData })
})


//Add a note - rendring a form - first get the form then then post the new note
app.get('/notes/new',(req,res) => {
    res.render('notes/new')
})
//create a new note
app.post('/notes' ,(req, res) => {
    try {       
        addNotes(req.body.title, req.body.text);
        res.redirect('/notes');      
    } catch (err) {
        log(`Error on  function: ${console.error(err)}`);
        log(`Error name: ${err.name}`)
        log(`Error message: ${err.message}`)
    }   
})

// End of Add notes section



//Edit form - need method-override 
app.get('/notes/:id/edit',(req,res) => {
    const { id } = req.params;
    log("req.parm: ===========> ", req.params)
    const note = notesData.find(i => i.id === id)
    log("note =================> ", note)
    res.render('notes/edit', { notesData, note })
})

//Edit a note
app.patch('/notes/:id',(req, res)=>{
    const { id } = req.params;
    const newTtitle = req.body.title;
    const newText = req.body.text;
    const foundNote = notesData.find(i => i.id === id)
    foundNote.title = newTtitle;
    foundNote.text = newText;
    saveNotes(notesData);
    res.redirect('/notes')
})


//Get a note
// reapp.get('notes/:id',(req,res) => {
//     const { id } = req.params;
//     const note = notesData.find(i => i.id === id)
//     s.render('notes/show', { notesData, note })
// })

//Get a note
app.get('/notes/:id',(req,res) => {
    const { id } = req.params;
    const note = notesData.find(i => i.id === id)
    res.render('notes/delete', { notesData, note })
})


//Delete a note
app.delete('/notes/:id',(req, res)=>{
    const { id } = req.params;
    notesData = notesData.filter(n => n.id !== id);
    saveNotes(notesData)
    res.redirect('/notes')
})
app.listen(PORT, () => {
    log("Listning on port", PORT)
})