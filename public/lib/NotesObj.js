class Notes {
    constructor(id, title, text, date){
        this.id = id;
        this.title = title;
        this.text = text;
        this.date = date;
    }
    getId() {
        return this.id;
    }

    getTitle() {
            return this.title;
        }

    gettext() {
            return this.text;
        }
    getDate() {
        return this.date;
    }
}

module.exports = Notes;