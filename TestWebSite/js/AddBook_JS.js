window.onload = function () {
    var authorsSelect = $("#authorsSelect");
    var genresSelect = $("#genresSelect");

    FillSelects(authorsSelect, genresSelect)
        .fail(
            () => { alert("Ошибка загрузки данных об авторах и жанрах.") }
        );

    SetEventOnAddBtn("#addBookBtn");
};

function SetEventOnAddBtn(addBtn) {
    $(addBtn).click(function () {
        var title = $("#titleBookInput").val();
        var author = $("#authorsSelect").find(":selected").text();
        var genre = $("#genresSelect").find(":selected").text();
        var date = $("#dateBookInput").val().toString() + "/01/01";
        if (CheckFields([title, author, genre, date])) {
            var book = new Book(0, bookUrl, title, author, genre, date);
            var prom = book.add();

            prom.done(function () {
                alert("Книга успешно добавлена!");
                window.location.href = "http://localhost:52418/html/IndexBooks.html";
            });

            prom.fail(function () {
                alert("Ошибка! Данные не добавились в БД.");
            });
        }
        else {
            alert("Введены некорректные поля формы.")
        }
    });
}

