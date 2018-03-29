var genre;

window.onload = function () {
    var id = getUrlParameter("id");
    FillGenreFields(id);
    SetEventOnClickEditBtn("#editGenreBtn");
};

function FillGenreFields(idGenre) {
    $.ajax({
        url: baseUrl + genreUrl + '/' + idGenre,
        type: "GET",
        dataType: "json",
        success: function (data) {
            genre = new Genre(idGenre, data.Genre.Title);
            genre.fillFields("#idGenreInput", "#titleInput");
        },
        error: function () {
            alert("Ошибка загрузки данных из БД.");
        }
    });
}

function SetEventOnClickEditBtn(editBtn) {
    $(editBtn).click(function () {
        var title = $("#titleInput").val();

        if (CheckFields([title])) {
            var prom = genre.edit(title);

            prom.done(function () {
                alert("Жанр успешно изменен!");
                window.location.href = "http://localhost:52418/html/IndexGenres.html";
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