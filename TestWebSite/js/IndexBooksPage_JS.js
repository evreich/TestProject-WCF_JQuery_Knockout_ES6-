var addModalWindow, editModalWindow;
var booksVM;

function BooksViewModel() {
    var self = this;

    self.countItemsOnPage = ko.observable(10);

    self.allItems = ko.observableArray([]);
    self.items = ko.observableArray([]);

    self.deleteBook = function () {
        var bookId = $(event.target).prev("input").val();
        var currBook = self.items().filter(function (book) {
            return book.id == bookId;
        })[0];
            
        var prom = currBook.delete();        
        prom.done(function () {
            self.allItems.remove(currBook);
            alert("Книга успешно удалена!");
        });

        prom.fail(function () {
            alert("Ошибка! Удаление не удалось.");
        });
    };

    self.bookVM = new ActionBookViewModel(self);

    self.editBook = function () {
        var bookId = $(event.target).prev("input").val();
        var editableBook = self.items().filter(function (book) {
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
                
                booksVM.allItems.push(newBook);
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
            var editableBook = booksVM.items().filter(function (book) {
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
                booksVM.items.valueHasMutated();
 
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

ko.bindingHandlers.pager = {
    init: function (element, valueAccessor, allBindings) {
        //init pager
        var items = valueAccessor().items;
        var allItems = ko.utils.unwrapObservable(valueAccessor().allItems);

        var countItemOnPage = ko.utils.unwrapObservable(valueAccessor().countItemsOnPage);
        var countPages = (allItems.length % countItemOnPage) == 0 ?
                        parseInt(allItems.length / countItemOnPage) :
                        parseInt(allItems.length / countItemOnPage)  + 1;
        var funcOnClickPage = function (event) {
            $("#currPage").val(parseInt(event.currentTarget.text));
            items.removeAll();
        };
        
        ReloadPages(element, countPages, funcOnClickPage, items);
        //send books in foreach template
        items(allItems.slice(0, countItemOnPage));
    },
    update: function (element, valueAccessor, allBindings) {
        var items = valueAccessor().items;
        var allItems = ko.utils.unwrapObservable(valueAccessor().allItems);
        var currPage = parseInt($("#currPage").val());
        var countItemOnPage = parseInt(ko.utils.unwrapObservable(valueAccessor().countItemsOnPage));
        //if change currPage
        if (items().length == 0) {
            var startIndex = (currPage - 1) * countItemOnPage;
            var endIndex = currPage * countItemOnPage
            items(allItems.slice(startIndex, endIndex));
        }
        //if change countItemsOnPage or allBooks
        else {
            var countPages = (allItems.length % countItemOnPage) == 0 ?
                parseInt(allItems.length / countItemOnPage) :
                parseInt(allItems.length / countItemOnPage) + 1;
            var funcOnClickPage = function (event) {
                $("#currPage").val(parseInt(event.currentTarget.text));
                items.removeAll();
            };
            ReloadPages(element, countPages, funcOnClickPage, items);  
            items(allItems.slice(0, countItemOnPage));
        }
    }
};

function ReloadPages(table, countPages, clickFunc, items) {
    $(table).empty();
    $(table).append("<tbody></tbody>");
    var tbodyRow = document.createElement("tr");
    for (var i = 1; i <= countPages; i++) {
        var a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerText = i;
        a.onclick = clickFunc;
        var td = document.createElement("td");
        td.appendChild(a);
        tbodyRow.appendChild(td);
    }
    $("tbody", table).append(tbodyRow);   
}

window.onload = function () {
    CreateVM();

    SetEventOnBtnClick();
    SetEventOnCloseBtnClick();

    addModalWindow = $("#addBookModal");
    editModalWindow = $("#editBookModal");
}

function CreateVM() {
    var prom = $.ajax({
        url: baseUrl + bookUrl,
        type: "GET",
        dataType: "json"
    });
    prom.done(function (data) {
        if (Array.isArray(data.Books)) {
            loadedBooks = $.map(data.Books, function (book) {
                return new Book(book.Id, book.Title, book.AuthorId,
                    book.GenreId, new Date(book.DateRealise).getFullYear(), book.Genre, book.Author);
            });
            loadedBooks.sort(function (a, b) {
                if (a.title() < b.title())
                    return -1;
                if (a.title() > b.title())
                    return 1;
                return 0;
            });
            //create VM
            booksVM = new BooksViewModel();
            booksVM.allItems(loadedBooks);
            ko.applyBindings(booksVM);
        } else {
            alert("Некорректный ответ от веб-сервиса при получении данных о доступных книгах.");
        }
    });
    prom.fail(function () { alert("Ошибка при получении данных о книгах. Нет соединения с веб-сервисом."); });
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

