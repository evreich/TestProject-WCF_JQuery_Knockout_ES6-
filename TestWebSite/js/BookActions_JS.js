window.onload = function FillSelects() {
    var authorsSelect = $("#authorsSelect");
    FillAuthorsSelect(authorsSelect);
    var genresSelect = $("#genresSelect");
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
                for (var i = 0; i < authors.length, i++) {
                    authorsSelect.append('<option value="' + authors[i].Id + '">' + author[i].FirstName + ' ' + authors[i].LastName + '</option>');
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
                for (var i = 0; i < genres.length, i++) {
                    genresSelect.append('<option value="' + genres[i].Id + '">' + genres[i].Title + '</option>');
                };
            } else {
                alert("Некорректный ответ от веб-сервиса.");
            }
        },
        error: function () { alert("Ошибка соединения с веб-сервисом."); }
    });
}