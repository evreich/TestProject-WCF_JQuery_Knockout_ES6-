function DBObject(idObject, partUrl) {
    this.id = idObject;
    this.url = baseUrl + partUrl;
}

DBObject.prototype.fillFields = function (idField) {
    $(idField).val(this.id);
};

DBObject.prototype.delete = function () {
    var obj = this;
    var prom = $.ajax({
        url: obj.url + "/delete/" + obj.id,
        type: "DELETE"
    });
    return prom;
};

function Book(idObject, partUrl, title, author, genre, date) {
    DBObject.apply(this, [idObject, partUrl]);
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.date = date;
}

Book.prototype = Object.create(DBObject.prototype);
Book.prototype.constructor = Book;

Book.prototype.fillFields = function (idField, titleField, authorField, genreField, dateField) {
    DBObject.prototype.fillFields.apply(this, [idField]);
    $(titleField).val(this.title);
    $(authorField).find("option:contains('" + this.author+"')").attr("selected", "selected");
    $(genreField).find("option:contains('" + this.genre + "')").attr("selected", "selected");
    $(dateField).val(this.date);
};

Book.prototype.add = function () {
    var book = this;
    var prom = $.ajax({
        url: book.url + "/add",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            book: { "Id": book.id, "Title": book.title, "Author": book.author, "Genre": book.genre, "DateRealise": book.date  }
        }),
        contentType: "application/json; charset=utf-8"
    });
    return prom;
};

Book.prototype.edit = function (titleValue, authorValue, genreValue, dateValue) {
    this.title = titleValue;
    this.author = authorValue;
    this.genre = genreValue;
    this.date = dateValue;

    var book = this;
    var prom = $.ajax({
        url: book.url + "/edit",
        type: "PUT",
        dataType: "json",
        data: JSON.stringify({
            book: { "Id": book.id, "Title": book.title, "Author": book.author, "Genre": book.genre, "DateRealise": book.date }
        }),
        contentType: "application/json; charset=utf-8"
    });
    return prom;
};

function Author(idObject, partUrl, firstName, lastName) {
    DBObject.apply(this, [idObject, partUrl]);
    this.firstName = firstName;
    this.lastName = lastName;
}

Author.prototype = Object.create(DBObject.prototype);
Author.prototype.constructor = Author;

Author.prototype.fillFields = function (idField, firstNameField, lastNameField) {
    DBObject.prototype.fillFields.apply(this, [idField]);
    $(firstNameField).val(this.firstName);
    $(lastNameField).val(this.lastName);
};

Author.prototype.add = function () {
    var author = this;
    var result = false;
    $.ajax({
        timeout: 6000,
        url: this.url + "/add",
        type: "POST",
        dataType: "json",
        data: { "Id": this.id, "FirstName": this.firstName, "LastName": this.lastName },
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            sessionStorage.setItem(author.id, JSON.stringify(author));
            result = true;
        },
        error: function () {
            alert("Ошибка! Данные не добавились в БД.");
        }
    });
    return result;
};

Author.prototype.edit = function (firstNameValue, lastNameValue) {
    this.firstName = firstNameValue;
    this.lastName = lastNameValue;

    var author = this;
    var result = false;
    $.ajax({
        timeout: 6000,
        url: this.url + "/edit",
        type: "PUT",
        dataType: "json",
        data: { "Id": this.id, "FirstName": this.firstName, "LastName": this.lastName },
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            sessionStorage.removeItem(author.id);
            sessionStorage.setItem(author.id, JSON.stringify(author));
            result = true;
        },
        error: function () {
            alert("Ошибка! Данные не сохранились в БД.");
        }
    });
    return result;
};

function Genre(idObject, partUrl, title) {
    DBObject.apply(this, [idObject, partUrl]);
    this.title = title;
}

Genre.prototype = Object.create(DBObject.prototype);
Genre.prototype.constructor = Genre;

Genre.prototype.fillFields = function (idField, titleField) {
    DBObject.prototype.fillFields.apply(this, [idField]);
    $(titleField).val(this.title);
};

Genre.prototype.add = function () {
    var genre = this;
    var result = false;
    $.ajax({
        timeout: 6000,
        url: this.url + "/add",
        type: "POST",
        dataType: "json",
        data: { "Id": this.id, "FirstName": this.firstName, "LastName": this.lastName },
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            sessionStorage.setItem(genre.id, JSON.stringify(genre));
            result = true;
        },
        error: function () {
            alert("Ошибка! Данные не добавились в БД.");
        }
    });
    return result;
};

Genre.prototype.edit = function (titleValue) {
    this.title = titleValue;

    var genre = this;
    var result = false;
    $.ajax({
        timeout: 6000,
        url: this.url + "/edit",
        type: "PUT",
        dataType: "json",
        data: { "Id": this.id, "Title": this.title },
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            sessionStorage.removeItem(genre.id);
            sessionStorage.setItem(genre.id, JSON.stringify(genre));
            result = true;
        },
        error: function () {
            alert("Ошибка! Данные не сохранились в БД.");
        }
    });
    return result;
};