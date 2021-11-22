function getNormalTime() {
    var d = new Date();
    var utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
    var nd = new Date(utc + 3600000 * 8);
    return nd.toLocaleString('en-NZ');
}

module.exports = getNormalTime;
