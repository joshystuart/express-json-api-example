var user = require('../lib/models/user');

module.exports = {
    routes: [
        {
            endpoint: '/user',
            model: user,
            limit: 20,
            id: '_id',
            methods: ['get', 'getList', 'patch']
        }
    ]
};