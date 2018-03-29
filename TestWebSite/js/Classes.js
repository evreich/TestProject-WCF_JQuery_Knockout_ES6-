class DBObject {
    constructor(idObject, partUrl) {
        this.id = idObject;
        this.url = baseUrl + partUrl;
    }

    delete() {
        var obj = this;
        var prom = $.ajax({
            url: obj.url + "/delete/" + obj.id,
            type: "DELETE"
        });
        return prom;
    }
}

class Book extends DBObject {
    constructor(idObject, title, authorId, genreId, date, genre = "", author = "") {
        super(idObject, bookUrl);
        this.title = ko.observable(title);
        this.author = ko.observable(author);
        this.authorId = authorId;
        this.genre = ko.observable(genre);
        this.genreId = genreId;
        this.date = ko.observable(date);
    }

    add() {
        var book = this;
        var prom = $.ajax({
            url: book.url + "/add",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                book: { "Id": book.id, "Title": book.title(), "AuthorId": book.authorId, "GenreId": book.genreId, "DateRealise": book.date().toString() + "/01/01" }
            }),
            contentType: "application/json; charset=utf-8"
        });
        return prom;
    }

    edit(titleValue, authorValue, genreValue, dateValue) {
        this.title(titleValue);
        this.authorId = authorValue;
        this.genreId = genreValue;
        this.date(dateValue);

        var book = this;
        var prom = $.ajax({
            url: book.url + "/edit",
            type: "PUT",
            dataType: "json",
            data: JSON.stringify({
                book: { "Id": book.id, "Title": book.title(), "AuthorId": book.authorId, "GenreId": book.genreId, "DateRealise": book.date().toString() + "/01/01" }
            }),
            contentType: "application/json; charset=utf-8"
        });
        return prom;
    }
}

class Author extends DBObject {
    constructor(idObject, firstName, lastName) {
        super(idObject, authorUrl);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    fillFields(idField, firstNameField, lastNameField) {
        $(idField).val(this.id);
        $(firstNameField).val(this.firstName);
        $(lastNameField).val(this.lastName);
    }

    add() {
        var author = this;
        var prom = $.ajax({
            url: author.url + "/add",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                author: { "Id": author.id, "FirstName": author.firstName, "LastName": author.lastName }
            }),
            contentType: "application/json; charset=utf-8"
        });
        return prom;
    }

    edit(firstNameValue, lastNameValue) {
        this.firstName = firstNameValue;
        this.lastName = lastNameValue;

        var author = this;
        var prom = $.ajax({
            url: author.url + "/edit",
            type: "PUT",
            dataType: "json",
            data: JSON.stringify({
                author: { "Id": author.id, "FirstName": author.firstName, "LastName": author.lastName }
            }),
            contentType: "application/json; charset=utf-8"
        });
        return prom;
    }
}

class Genre extends DBObject{
    constructor(idObject, title) {
        super(idObject, genreUrl);
        this.title = title;
    }

    fillFields (idField, titleField) {
        $(idField).val(this.id);
        $(titleField).val(this.title);
    }

    add() {
        var genre = this;
        var prom = $.ajax({
            url: genre.url + "/add",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                genre: { "Id": genre.id, "Title": genre.title }
            }),
            contentType: "application/json; charset=utf-8"
        });
        return prom;
    }

    edit(titleValue) {
        this.title = titleValue;

        var genre = this;
        var prom = $.ajax({
            url: genre.url + "/edit",
            type: "PUT",
            dataType: "json",
            data: JSON.stringify({
                genre: { "Id": genre.id, "Title": genre.title }
            }),
            contentType: "application/json; charset=utf-8"
        });
        return prom;
    }
}