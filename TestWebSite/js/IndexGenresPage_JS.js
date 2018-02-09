var genres = [];

window.onload = function ShowAuthors() {
    $("#lbMessage").html("Ожидание ответа от сервера...");
    $("#lbMessage").css("display", "inline");
    $.ajax({
        url: baseUrl + genreUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            var loadedGenres = data.Genres;
            if (Array.isArray(loadedGenres)) {
                $("#tableGenres tbody").empty();
                FillTableGenres(loadedGenres);
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
        var genreId = $(event.target).prev("input").val();
        var currGenre = $.grep(genres, function (genre) {
            return genre.id == genreId;
        })[0].genre;
        var prom = currGenre.delete();

        var delRowElem = $(event.target);

        prom.done(function () {
            delRowElem.closest("tr").remove();
            alert("Жанр и книги успешно удалены!");
        });

        prom.fail(function () {
            alert("Ошибка! Удаление не удалось.");
        });
    });
}

function FillTableGenres(loadedGenres) {
    for (var i = 0; i < loadedGenres.length; i++) {
        var genre = new Genre(loadedGenres[i].Id, genreUrl, loadedGenres[i].Title);
        genres.push({
            id: genre.id,
            genre: genre
        });
        $('#tableGenres').children("tbody").append(
            "<tr>" +
            "<td>" + genre.title + "</td>" +
            "<td><a href=\"../html/EditGenre.html?id=" + genre.id + "\" class=\"editLnk\">" + "Изменить" + "</a>" + "</td>" +
            "<td><input value=\"" + genre.id + "\" type=\"hidden\"><a href=\"#\" onclick=\"return false;\" class=\"deleteLnk\">" + "Удалить" + "</a>" + "</td>" +
            "</tr>");
    }
}