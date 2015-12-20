var user = require('../lib/models/user');
var expressJsonApi = require('express-json-api');
var getList = expressJsonApi.controllers.getList;
var get = expressJsonApi.controllers.get;

module.exports = {
    routes: [
        {
            endpoint: '/users',
            model: user,
            limit: 20,
            id: 'username',
            methods: {
                getList: getList.default,
                get: get.default
            }
        },
        {
            endpoint: '/admin',
            model: user,
            limit: 20,
            id: '_id',
            methods: {
                get: get.default
            }
        }
    ]
};
