var addModalWindow = $("#addBookModal");
var editModalWindow = $("#editBookModal");

function BooksViewModel() {
    let self = this;

    self.countItemsOnPage = ko.observable(10);

    self.allItems = ko.observableArray([]);
    self.items = ko.observableArray([]);

    self.deleteBook = function () {
        let bookId = $(event.target).prev("input").val();
        let currBook = self.items().filter(
            book => book.id == bookId)[0];
            
        let prom = currBook.delete();        
        prom.done(() => {
            self.allItems.remove(currBook);
            alert("Книга успешно удалена!");
        });

        prom.fail(() => alert("Ошибка! Удаление не удалось."));
        };

    self.bookVM = new ActionBookViewModel(self);

    self.editBook = function () {
        let bookId = $(event.target).prev("input").val();
        let editableBook = self.items().filter(
            book => book.id == bookId)[0];

        self.bookVM.id(editableBook.id);
        self.bookVM.title(editableBook.title());
        self.bookVM.authorId(editableBook.authorId); 
        self.bookVM.genreId(editableBook.genreId);
        self.bookVM.date(editableBook.date());

        editModalWindow.show();
    }
}

function ActionBookViewModel(booksVM) {
    let self = this;
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
            let newBook = new Book(0, self.title(), self.authorId(), self.genreId(), self.date());
            let prom = newBook.add();

            prom.done(() => {
                let currAuthor = self.allAuthors().filter(
                    author => author.id == newBook.authorId)[0];
                newBook.author(`${currAuthor.firstName} ${currAuthor.lastName}`);

                let currGenre = self.allGenres().filter(
                    genre => genre.id == newBook.genreId)[0];
                newBook.genre(currGenre.title);
                
                booksVM.allItems.push(newBook);
                alert("Книга успешно добавлена!");
                $("#addBookModal .close").click();
            });

            prom.fail(() => alert("Ошибка! Данные не добавились в БД."));
            
        }
        else {
            alert("Введены некорректные поля формы.")
        }
    }
     
    self.editBook = function (editableBook) {
        if (CheckFields([self.title(), self.authorId(), self.genreId(), self.date()])) {
            let editableBook = booksVM.items().filter(
                book => book.id == self.id())[0];
            let prom = editableBook.edit(self.title(), self.authorId(), self.genreId(), self.date());

            prom.done( ()=> {

                let currAuthor = self.allAuthors().filter(
                    author => author.id == self.authorId())[0];
                editableBook.author(`${currAuthor.firstName} ${currAuthor.lastName}`);

                let currGenre = self.allGenres().filter(
                    genre => genre.id == self.genreId())[0];
                editableBook.genre(currGenre.title);
                booksVM.items.valueHasMutated();
 
                alert("Книга успешно изменена!");
                $("#editBookModal .close").click();
            });

            prom.fail(() => alert("Ошибка! Данные не добавились в БД."));
        }
        else {
            alert("Введены некорректные поля формы.")
        }
    }
}

function InitSelects(bookVM) {
    GetDataForBookSelects().done(function (authors, genres) {
        if (Array.isArray(authors[0].Authors) && Array.isArray(genres[0].Genres)) {
            let loadedAuthors = $.map(authors[0].Authors, author =>
                new Author(author.Id, author.FirstName, author.LastName));
            loadedAuthors.unshift(new Author(0, "Выберите автора", ""));
            bookVM.allAuthors(loadedAuthors);

            let loadedGenres = $.map(genres[0].Genres, genre =>
                new Genre(genre.Id, genre.Title));
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
        let items = valueAccessor().items;
        let allItems = ko.utils.unwrapObservable(valueAccessor().allItems);

        let countItemOnPage = ko.utils.unwrapObservable(valueAccessor().countItemsOnPage);
        let countPages = (allItems.length % countItemOnPage) == 0 ?
                        parseInt(allItems.length / countItemOnPage) :
                        parseInt(allItems.length / countItemOnPage)  + 1;
        let funcOnClickPage = function (event) {
            $("#currPage").val(parseInt(event.currentTarget.text));
            items.removeAll();
        };
        
        ReloadPages(element, countPages, funcOnClickPage, items);
        //send books in foreach template
        items(allItems.slice(0, countItemOnPage));
    },
    update: function (element, valueAccessor, allBindings) {
        let items = valueAccessor().items;
        let allItems = ko.utils.unwrapObservable(valueAccessor().allItems);
        let currPage = parseInt($("#currPage").val());
        let countItemOnPage = parseInt(ko.utils.unwrapObservable(valueAccessor().countItemsOnPage));
        //if change currPage
        if (items().length == 0) {
            let startIndex = (currPage - 1) * countItemOnPage;
            let endIndex = currPage * countItemOnPage
            items(allItems.slice(startIndex, endIndex));
        }
        //if change countItemsOnPage or allBooks
        else {
            let countPages = (allItems.length % countItemOnPage) == 0 ?
                parseInt(allItems.length / countItemOnPage) :
                parseInt(allItems.length / countItemOnPage) + 1;
            let funcOnClickPage = function (event) {
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
    let tbodyRow = document.createElement("tr");
    for (let i = 1; i <= countPages; i++) {
        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerText = i;
        a.onclick = clickFunc;
        let td = document.createElement("td");
        td.appendChild(a);
        tbodyRow.appendChild(td);
    }
    $("tbody", table).append(tbodyRow);   
}

window.onload = function () {
    CreateVM();

    SetEventOnAddBtnClick(addModalWindow);
    SetEventOnCloseBtnClick(addModalWindow, editModalWindow);
}

window.onclick = function (event) {
    if (event.target == addModalWindow[0]) {
        $("span.close", addModalWindow).click();
    }
    if (event.target == editModalWindow[0]) {
        $("span.close", editModalWindow).click();
    }
}  

function CreateVM() {
    let prom = $.ajax({
        url: baseUrl + bookUrl,
        type: "GET",
        dataType: "json"
    });
    prom.done(data => {
        if (Array.isArray(data.Books)) {
            loadedBooks = $.map(data.Books,
                book => new Book(book.Id, book.Title, book.AuthorId,
                    book.GenreId, new Date(book.DateRealise).getFullYear(), book.Genre, book.Author));
            loadedBooks.sort((a, b) => {
                if (a.title() < b.title())
                    return -1;
                if (a.title() > b.title())
                    return 1;
                return 0;
            });
            //create VM
            let booksVM = new BooksViewModel();
            booksVM.allItems(loadedBooks);
            ko.applyBindings(booksVM);
        } else {
            alert("Некорректный ответ от веб-сервиса при получении данных о доступных книгах.");
        }
    });
    prom.fail(() => alert("Ошибка при получении данных о книгах. Нет соединения с веб-сервисом."));
}

function SetEventOnAddBtnClick(addModalWindow) {
    $("#showModalAddBook").click(() => {
        $("#addBookModal #titleBookInput").val("");
        $("#addBookModal #dateBookInput").val(2010);
        $("#addBookModal #genresSelect").val(0);
        $("#addBookModal #authorsSelect").val(0);

        addModalWindow.show();
    });
}

function SetEventOnCloseBtnClick(addModalWindow, editModalWindow) {
    $("span.close", addModalWindow).click (() => {
        addModalWindow.hide();
    });
    $("span.close", editModalWindow).click(() => {
        editModalWindow.hide();
    });
}

