window.onload = function () {
    SetEventOnAddBtn("#addAuthorBtn");
};

function SetEventOnAddBtn(addBtn) {
    $(addBtn).click(function () {
        var firstName = $("#firstNameInput").val();
        var lastName = $("#lastNameInput").val();

        if (CheckFields([firstName, lastName])) {
            var author = new Author(0, authorUrl, firstName, lastName);
            var prom = author.add();

            prom.done(function () {
                alert("Автор успешно добавлен!");
                window.location.href = "http://localhost:52418/html/IndexAuthors.html";
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

