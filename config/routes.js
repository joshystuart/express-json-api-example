var user = require('../lib/models/user');

module.exports = {
    routes: [
        {
            endpoint: '/users',
            model: user,
            limit: 20,
            id: '_id',
            methods: ['get', 'getList', 'patch']
        }
    ]
};