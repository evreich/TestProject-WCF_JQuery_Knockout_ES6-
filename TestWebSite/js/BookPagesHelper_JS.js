const bookUrl = "/books";
const authorUrl = "/authors";
const genreUrl = "/genres";
const baseUrl = "http://localhost:51808";

function CheckFields(fields) {
    var result = true;
    for (let field of fields) {
        if (!(field)) {
            result = false;
            break;
        }
    }
    return result;
};

function FillSelects(authorsSelect, genresSelect) {
    return $.when(FillAuthorsSelect(authorsSelect), FillGenresSelect(genresSelect));
}

function FillAuthorsSelect(authorsSelect) {
    authorsSelect.empty();

    var prom = $.ajax({
        url: baseUrl + authorUrl,
        type: "GET",
        dataType: "json"
    });
    prom.done(function (data) {
        var authors = data.Authors;
        if (Array.isArray(authors)) {
            for (var i = 0; i < authors.length; i++) {
                authorsSelect.append("<option value=\"" + authors[i].Id + "\">" + authors[i].FirstName + "," + authors[i].LastName + "</option>");
            };
        } else {
            alert("Некорректный ответ от веб-сервиса.");
        }
    });
    prom.fail(function () {
        alert("Ошибка соединения с веб-сервисом.");
    });

    return prom;
}

function FillGenresSelect(genresSelect) {
    genresSelect.empty();

    var prom = $.ajax({
        url: baseUrl + genreUrl,
        type: "GET",
        dataType: "json"
    });
    prom.done(function (data) {
        var genres = data.Genres;
        if (Array.isArray(genres)) {
            for (var i = 0; i < genres.length; i++) {
                genresSelect.append('<option value="' + genres[i].Id + '">' + genres[i].Title + '</option>');
            };
        } else {
            alert("Некорректный ответ от веб-сервиса.");
        }
    });
    prom.fail(function () {
        alert("Ошибка соединения с веб-сервисом.");
    });

    return prom;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};