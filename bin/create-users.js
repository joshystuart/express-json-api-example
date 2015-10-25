#!/usr/bin/env node
/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var _ = require('lodash');
var DB = require('../lib/utils/db');
var db = new DB();
var User = require('../lib/models/user');
var users = [
    {
        username: 'elonmusk',
        'first-name': 'Elon',
        'last-name': 'Musk'
    },
    {
        username: 'sergeybrin',
        'first-name': 'Sergey',
        'last-name': 'Brin'
    },
    {
        username: 'markzuckerberg',
        'first-name': 'Mark',
        'last-name': 'Zuckerberg'
    }
];

// init mongo connection
db.connect().then(function() {
    _.forEach(users, function(user) {
        var newUser = User(user);
        newUser.save();
    });
});
