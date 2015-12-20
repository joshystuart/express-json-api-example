/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var DB = require('./lib/utils/db');
var db = new DB();
var app = require('./lib/app');

// init mongo connection
db.connect().
then(function() {
    // create express app and config
    app.init();
});