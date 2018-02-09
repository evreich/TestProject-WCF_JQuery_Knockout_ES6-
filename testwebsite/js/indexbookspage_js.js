var books = [];

window.onload = function ShowBooks() {
    $("#lbMessage").html("Ожидание ответа от сервера...");
    $("#lbMessage").css("display", "inline");
    $.ajax({
        url: baseUrl + bookUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            var loadedBooks = data.Books;
            if (Array.isArray(loadedBooks)) {
                $("#tableBooks tbody").empty();
                FillTableBooks(loadedBooks);
                $("#lbMessage").css("display", "none");
                SetEventOnClickDelLink("a.deleteLnk");
            } else {
                $("#lbMessage").html("Некорректный ответ от веб-сервиса.");
            }
        },
        error: function () { $("#lbMessage").html("Ошибка соединения с веб-сервисом."); }
    });
};

function SetEventOnClickDelLink(delLnk) {
    $(delLnk).click(function () {
        var bookId = $(event.target).prev("input").val();
        var currBook = $.grep(books, function (book) {
            return book.id == bookId;
        })[0].book;
        var prom = currBook.delete();

        var delRowElem = $(event.target);

        prom.done(function () {
            delRowElem.closest("tr").remove();
            alert("Книга успешно удалена!");
        });

        prom.fail(function () {
            alert("Ошибка! Удаление не удалось.");
        });
    });
}

function FillTableBooks(loadedBooks) {
    for (var i = 0; i < loadedBooks.length; i++) {
        var book = new Book(loadedBooks[i].Id, bookUrl, loadedBooks[i].Title, loadedBooks[i].Author,
            loadedBooks[i].Genre, new Date(loadedBooks[i].DateRealise).getFullYear());
        books.push({
            id: book.id,
            book: book
        });
        $('#tableBooks').children("tbody").append(
            "<tr>" +
            "<td>" + book.title + "</td>" +
            "<td>" + book.author + "</td>" +
            "<td>" + book.genre + "</td>" +
            "<td>" + book.date + "</td>" +
            "<td><a href=\"../html/EditBook.html?id=" + book.id + "\" class=\"editLnk\">" + "Изменить" + "</a>" + "</td>" +
            "<td><input value=\"" + book.id + "\" type=\"hidden\"><a href=\"#\" onclick=\"return false;\" class=\"deleteLnk\">" + "Удалить" + "</a>" + "</td>" +
            "</tr>");
    }
}