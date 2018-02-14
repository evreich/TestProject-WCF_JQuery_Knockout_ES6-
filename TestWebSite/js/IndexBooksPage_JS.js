var addModalWindow, editModalWindow;
var booksVM;

function BooksViewModel() {
    var self = this;
    self.books = ko.observableArray();
    self.downloadMessage = ko.observable('Ожидание ответа от сервера...');

    InitBooksTable(self);

    self.deleteBook = function () {
        var bookId = $(event.target).prev("input").val();
        var currBook = self.books().filter(function (book) {
            return book.id == bookId;
        })[0];
            
        var prom = currBook.delete();        
        prom.done(function () {
            self.books.remove(currBook);
            alert("Книга успешно удалена!");
        });

        prom.fail(function () {
            alert("Ошибка! Удаление не удалось.");
        });
    };

    self.bookVM = new ActionBookViewModel(self);

    self.editBook = function () {
        var bookId = $(event.target).prev("input").val();
        var editableBook = self.books().filter(function (book) {
            return book.id == bookId;
        })[0];

        self.bookVM.id(editableBook.id);
        self.bookVM.title(editableBook.title());
        self.bookVM.authorId(editableBook.authorId); 
        self.bookVM.genreId(editableBook.genreId);
        self.bookVM.date(editableBook.date());

        editModalWindow.show();
    }
}

function InitBooksTable(booksVM) {
    $.ajax({
        url: baseUrl + bookUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data.Books)) {
                loadedBooks = $.map(data.Books, function (book) {
                    return new Book(book.Id, book.Title, book.AuthorId,
                        book.GenreId, new Date(book.DateRealise).getFullYear(), book.Genre, book.Author);
                });
                booksVM.books(loadedBooks);
                booksVM.downloadMessage('');
            } else {
                booksVM.downloadMessage("Некорректный ответ от веб-сервиса при получении данных о доступных книгах.");
            }
        },
        error: function () { booksVM.downloadMessage("Ошибка при получении данных о книгах. Нет соединения с веб-сервисом."); }
    });
}

function ActionBookViewModel(booksVM) {
    var self = this;
    self.id = ko.observable();
    self.title = ko.observable();
    self.authorId = ko.observable();
    self.genreId = ko.observable();
    self.date = ko.observable(1800);

    self.allAuthors = ko.observableArray([]);
    self.allGenres = ko.observableArray([]);

    InitSelects(self);
    
    self.addBook = function () {
        if (CheckFields([self.title(), self.authorId(), self.genreId(), self.date()])) {
            var newBook = new Book(0, self.title(), self.authorId(), self.genreId(), self.date());
            var prom = newBook.add();

            prom.done(function () {
                var currAuthor = self.allAuthors().filter(function (author) {
                    return author.id == newBook.authorId;
                })[0];
                newBook.author(currAuthor.firstName + ' ' + currAuthor.lastName);

                var currGenre = self.allGenres().filter(function (genre) {
                    return genre.id == newBook.genreId;
                })[0];
                newBook.genre(currGenre.title);

                booksVM.books.push(newBook);
                alert("Книга успешно добавлена!");
                $("#addBookModal .close").click();
                self.clear();
            });

            prom.fail(function () {
                alert("Ошибка! Данные не добавились в БД.");
            });
        }
        else {
            alert("Введены некорректные поля формы.")
        }
    }

    self.editBook = function (editableBook) {
        if (CheckFields([self.title(), self.authorId(), self.genreId(), self.date()])) {
            var editableBook = booksVM.books().filter(function (book) {
                return book.id == self.id();
            })[0];
            var prom = editableBook.edit(self.title(), self.authorId(), self.genreId(), self.date());

            prom.done(function () {

                var currAuthor = self.allAuthors().filter(function (author) {
                    return author.id == self.authorId();
                })[0];
                editableBook.author(currAuthor.firstName + ' ' + currAuthor.lastName);

                var currGenre = self.allGenres().filter(function (genre) {
                    return genre.id == self.genreId();
                })[0];
                editableBook.genre(currGenre.title);
                booksVM.books.valueHasMutated();
 
                alert("Книга успешно изменена!");
                $("#editBookModal .close").click();
                self.clear();
            });

            prom.fail(function () {
                alert("Ошибка! Данные не добавились в БД.");
            });
        }
        else {
            alert("Введены некорректные поля формы.")
        }
    }

    self.clear = function () {
        self.title("");
        self.date(2010);
        self.authorId(0);
        self.genreId(0);
    }
}

function InitSelects(bookVM) {
    GetDataForBookSelects().done(function (authors, genres) {
        if (Array.isArray(authors[0].Authors) && Array.isArray(genres[0].Genres)) {
            var loadedAuthors = $.map(authors[0].Authors, function (author) {
                return new Author(author.Id, author.FirstName, author.LastName);
            });
            loadedAuthors.unshift(new Author(0, "Выберите автора", ""));
            bookVM.allAuthors(loadedAuthors);

            var loadedGenres = $.map(genres[0].Genres, function (genre) {
                return new Genre(genre.Id, genre.Title);
            });
            loadedGenres.unshift(new Genre(0, "Выберите жанр"));
            bookVM.allGenres(loadedGenres);         
        }
        else {
            alert("Некорректный ответ от веб-сервиса при получении данных о доступных авторах и жанрах.");
        }
    }).fail(function () {
        alert("Ошибка при заполнении доступных авторов и жанров. Нет соединения с веб-сервисом.");
    });
}

window.onload = function () {
    booksVM = new BooksViewModel();
    ko.applyBindings(booksVM);

    SetEventOnBtnClick();
    SetEventOnCloseBtnClick();

    addModalWindow = $("#addBookModal");
    editModalWindow = $("#editBookModal");
}

function SetEventOnBtnClick() {
    $("#showModalAddBook").click(function () {
        addModalWindow.show();
    });
}

function SetEventOnCloseBtnClick() {
    $("#addBookModal span.close").click(function () {
        addModalWindow.hide();
        booksVM.bookVM.clear();
    });
    $("#editBookModal span.close").click(function () {
        editModalWindow.hide();
        booksVM.bookVM.clear();
    });
}

window.onclick = function (event) {
    if (event.target == addModalWindow[0]) {
        $("#addBookModal span.close").click();
    }
    if (event.target == editModalWindow[0]) {
        $("#editBookModal span.close").click();
    }
}

