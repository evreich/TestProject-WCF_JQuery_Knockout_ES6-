const bookUrl = "/books";
const authorUrl = "/authors";
const genreUrl = "/genres";
const baseUrl = "http://localhost:51808";

function CheckFields(fields) {
    fields.forEach(function (elem) {
        if (!(elem))
            return false;
    });
    return true;
};

function FillSelects(authorsSelect, genresSelect) {
    FillAuthorsSelect(authorsSelect);
    FillGenresSelect(genresSelect);
}

function FillAuthorsSelect(authorsSelect) {
    authorsSelect.empty();
    $.ajax({
        timeout: 6000,
        url: "http://localhost:51808/authors",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var authors = data.Authors;
            if (Array.isArray(authors)) {
                for (var i = 0; i < authors.length; i++) {
                    authorsSelect.append("<option value=\"" + authors[i].Id + "\">" + authors[i].FirstName + " " + authors[i].LastName + "</option>");
                };
            } else {
                alert("Некорректный ответ от веб-сервиса.");
            }
        },
        error: function () { alert("Ошибка соединения с веб-сервисом."); }
    });
}

function FillGenresSelect(genresSelect) {
    genresSelect.empty();
    $.ajax({
        timeout: 6000,
        url: "http://localhost:51808/genres",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var genres = data.Genres;
            if (Array.isArray(genres)) {
                for (var i = 0; i < genres.length; i++) {
                    genresSelect.append('<option value="' + genres[i].Id + '">' + genres[i].Title + '</option>');
                };
            } else {
                alert("Некорректный ответ от веб-сервиса.");
            }
        },
        error: function () { alert("Ошибка соединения с веб-сервисом."); }
    });
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};