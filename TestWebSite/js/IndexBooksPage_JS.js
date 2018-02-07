window.onload = function ShowBooks() {
    $("#lbMessage").html("Ожидание ответа от сервера...");
    $("#lbMessage").css("display", "inline");
    $.ajax({
        timeout: 6000,
        url: "http://localhost:51808/books",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var books = data.Books;
            if (Array.isArray(books)) {
                $("#tableBooks tbody").empty();
                for (var i = 0; i < books.length; i++) {
                    var book = new Book(books[i].Id, "/books", books[i].Title, books[i].Author,
                        books[i].Genre, moment(books[i].DateRealise).toDate().getFullYear());
                    sessionStorage.setItem(book.id, JSON.stringify(book));
                    $('#tableBooks').children("tbody").append(
                        "<tr>" +
                        "<td>" + book.title + "</td>" +
                        "<td>" + book.author + "</td>" +
                        "<td>" + book.genre + "</td>" +
                        "<td>" + book.date + "</td>" +
                        "<td><a href=\"/EditBook.html?id=" + book.id + "\" class=\"editLnk\">" + "Изменить" + "</a>" + "</td>" +
                        "<td><input value=\"" + book.id + "\" type=\"hidden\"><a href=\"\" class=\"deleteLnk\">"+"Удалить"+"</a>" + "</td>" +
                        "</tr>");
                };
                $("#lbMessage").css("display", "none");
                $("a.deleteLnk").click(function () {
                    var bookId = $(event.target).prev("input").val();
                    var currBook = JSON.parse(sessionStorage.getItem(bookId));
                    currBook.delete();
                    $(event.target).closest("tr").remove();
                })
            } else {
                $("#lbMessage").html("Некорректный ответ от веб-сервиса.");
            }
        },
        error: function () { $("#lbMessage").html("Ошибка соединения с веб-сервисом."); }
    })
};