window.onload = function () {
    SetEventOnAddBtn("#addGenreBtn");
};

function SetEventOnAddBtn(addBtn) {
    $(addBtn).click(function () {
        var title = $("#titleInput").val();

        if (CheckFields([title])) {
            var genre = new Genre(0, genreUrl, title);
            var prom = genre.add();

            prom.done(function () {
                alert("Жанр успешно добавлен!");
                window.location.href = "http://localhost:52418/html/IndexGenres.html";
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

