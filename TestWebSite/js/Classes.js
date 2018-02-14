function DBObject(idObject, partUrl) {
    this.id = idObject;
    this.url = baseUrl + partUrl;
}

DBObject.prototype.delete = function () {
    var obj = this;
    var prom = $.ajax({
        url: obj.url + "/delete/" + obj.id,
        type: "DELETE"
    });
    return prom;
};

function Book(idObject, title, authorId, genreId, date, genre = "", author = "") {
    DBObject.apply(this, [idObject, bookUrl]);
    this.title = ko.observable(title);
    this.author = ko.observable(author);
    this.authorId = authorId;
    this.genre = ko.observable(genre);
    this.genreId = genreId;
    this.date = ko.observable(date);
}

Book.prototype = Object.create(DBObject.prototype);
Book.prototype.constructor = Book;

Book.prototype.add = function () {
    var book = this;
    var prom = $.ajax({
        url: book.url + "/add",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            book: { "Id": book.id, "Title": book.title(), "AuthorId": book.authorId, "GenreId": book.genreId, "DateRealise": book.date().toString() + "/01/01"  }
        }),
        contentType: "application/json; charset=utf-8"
    });
    return prom;
};

Book.prototype.edit = function (titleValue, authorValue, genreValue, dateValue) {
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
};

function Author(idObject, firstName, lastName) {
    DBObject.apply(this, [idObject, authorUrl]);
    this.firstName = firstName;
    this.lastName = lastName;
}

Author.prototype = Object.create(DBObject.prototype);
Author.prototype.constructor = Author;

Author.prototype.add = function () {
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
};

Author.prototype.edit = function (firstNameValue, lastNameValue) {
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
};

function Genre(idObject, title) {
    DBObject.apply(this, [idObject, genreUrl]);
    this.title = title;
}

Genre.prototype = Object.create(DBObject.prototype);
Genre.prototype.constructor = Genre;

Genre.prototype.add = function () {
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
};

Genre.prototype.edit = function (titleValue) {
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
};