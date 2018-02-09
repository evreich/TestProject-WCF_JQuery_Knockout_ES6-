var authors = [];

window.onload = function ShowAuthors() {
    $("#lbMessage").html("Ожидание ответа от сервера...");
    $("#lbMessage").css("display", "inline");
    $.ajax({
        url: baseUrl + authorUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            var loadedAuthors = data.Authors;
            if (Array.isArray(loadedAuthors)) {
                $("#tableAuthors tbody").empty();
                FillTableAuthors(loadedAuthors);
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
        var authorId = $(event.target).prev("input").val();
        var currAuthor = $.grep(authors, function (author) {
            return author.id == authorId;
        })[0].author;
        var prom = currAuthor.delete();

        var delRowElem = $(event.target);

        prom.done(function () {
            delRowElem.closest("tr").remove();
            alert("Автор и книги успешно удалены!");
        });

        prom.fail(function () {
            alert("Ошибка! Удаление не удалось.");
        });
    });
}

function FillTableAuthors(loadedAuthors) {
    for (var i = 0; i < loadedAuthors.length; i++) {
        var author = new Author(loadedAuthors[i].Id, authorUrl, loadedAuthors[i].FirstName, loadedAuthors[i].LastName);
        authors.push({
            id: author.id,
            author: author
        });
        $('#tableAuthors').children("tbody").append(
            "<tr>" +
            "<td>" + author.firstName + "</td>" +
            "<td>" + author.lastName + "</td>" +
            "<td><a href=\"../html/EditAuthor.html?id=" + author.id + "\" class=\"editLnk\">" + "Изменить" + "</a>" + "</td>" +
            "<td><input value=\"" + author.id + "\" type=\"hidden\"><a href=\"#\" onclick=\"return false;\" class=\"deleteLnk\">" + "Удалить" + "</a>" + "</td>" +
            "</tr>");
    }
}