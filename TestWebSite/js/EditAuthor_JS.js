var author;

window.onload = function () {
    var id = getUrlParameter("id");
    FillAuthorFields(id); 
    SetEventOnClickEditBtn("#editAuthorBtn");
};

function FillAuthorFields(idAuthor) {
    $.ajax({
        url: baseUrl + authorUrl + '/' + idAuthor,
        type: "GET",
        dataType: "json",
        success: function (data) {
            author = new Author(idAuthor, authorUrl, data.Author.FirstName, data.Author.LastName);
            author.fillFields("#idAuthorInput", "#firstNameInput", "#lastNameInput");
        },
        error: function () {
            alert("Ошибка загрузки данных из БД.");
        }
    });
}

function SetEventOnClickEditBtn(editBtn) {
    $(editBtn).click(function () {
        var firstName = $("#firstNameInput").val();
        var lastName = $("#lastNameInput").val();

        if (CheckFields([firstName, lastName])) {
            var prom = author.edit(firstName, lastName);

            prom.done(function () {
                alert("Автор успешно изменен!");
                window.location.href = "http://localhost:52418/html/IndexAuthors.html";
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