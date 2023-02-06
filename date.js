module.exports.getDate = function () {
    var options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
    var today = new Date();

    return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function () {
    var options = {
        weekday: "long",
    }
    var today = new Date();

    return today.toLocaleDateString("en-US", options);
}