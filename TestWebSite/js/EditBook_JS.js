var book;
var id;

window.onload = function () {
    var authorsSelect = $("#authorsSelect");
    var genresSelect = $("#genresSelect");
    var id = getUrlParameter("id");

    FillSelects(authorsSelect, genresSelect)
        .then(
        () => { FillBookFields(id); },
        () => { alert("Ошибка загрузки данных об авторах и жанрах.") }
        );

    SetEventOnClickEditBtn("#editBookBtn");
};

function FillBookFields(idBook) {
    $.ajax({
        url: baseUrl + bookUrl + '/' + idBook,
        type: "GET",
        dataType: "json",
        success: function (data) {
            book = new Book(idBook, bookUrl, data.Book.Title, data.Book.Author, data.Book.Genre, new Date(data.Book.DateRealise).getFullYear());
            book.fillFields("#idBookInput", "#titleBookInput", "#authorsSelect", "#genresSelect", "#dateBookInput");
        },
        error: function () {
            alert("Ошибка загрузки данных из БД.");
        }
    });
}

function SetEventOnClickEditBtn(editBtn) {
    $(editBtn).click(function () {
        var title = $("#titleBookInput").val();
        var author = $("#authorsSelect").find(":selected").text();
        var genre = $("#genresSelect").find(":selected").text();
        var date = $("#dateBookInput").val().toString() + "/01/01";

        if (CheckFields([title, author, genre, date])) {
            var prom = book.edit(title, author, genre, date);

            prom.done(function () {
                alert("Книга успешно изменена!");
                window.location.href = "http://localhost:52418/html/IndexBooks.html";
            });

            prom.fail(function () {
                alert("Ошибка! Данные не изменились в БД.");
            });
        }
        else {
            alert("Введены некорректные поля формы.")
        }
    });
}