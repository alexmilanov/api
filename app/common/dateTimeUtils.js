module.exports = {
    getCurrentTimestamp: function() {
        return Math.round((new Date()).getTime() / 1000);
    }
}