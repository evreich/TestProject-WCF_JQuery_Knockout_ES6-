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

function GetDataForBookSelects() {
    return $.when(GetAuthors(), GetGenres());
}

function GetAuthors() {

    var prom = $.ajax({
        url: baseUrl + authorUrl,
        type: "GET",
        dataType: "json"
    });

    return prom;
}

function GetGenres() {
    var prom = $.ajax({
        url: baseUrl + genreUrl,
        type: "GET",
        dataType: "json"
    });

    return prom;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};