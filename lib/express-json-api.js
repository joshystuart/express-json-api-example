/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var _ = require('lodash');
var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var getList = require('./controllers/get-list');
var get = require('./controllers/get');

function expressJsonApi(app, config) {
    createRoutes(app, config);
}

function createRoutes(app, config) {
    _.forEach(config.routes, function(route) {
        createRoute(app, route);
    });
}

function createRoute(app, route) {
    app.use(route.endpoint, router);

    _.forEach(route.methods, function(method, key) {
        if (typeof(key) === 'number' && typeof(method) === 'string') {

            // defaults
            switch (method) {
                case 'get':
                    createGetRoute(route, get.default);
                    break;
                case 'getList':
                    createGetListRoute(route, getList.default);
                    break;
                case 'patch':
                    createPatchRoute(route, getList.default);
                    break;
                default:
                    break;
            }
        } else {
            // TODO allow overrides
        }
    });
}

function createGetListRoute(route, middleware) {
    router.get('/', function(req, res, next) {
        // apply target
        applyRouteConfig(route, req, res);

        next();
    }, middleware);
}

function createGetRoute(route, middleware) {
    router.get('/:' + route.id, function(req, res, next) {
        // apply target
        applyRouteConfig(route, req, res);

        next();
    }, middleware);
}

function createPatchRoute(route, middleware) {
    router.patch('/:' + route.id, function(req, res, next) {
        // apply target
        applyRouteConfig(route, req, res);

        next();
    }, middleware);
}

/**
 * Sets the model on the request so that other middleware can use it.
 *
 * @param route
 * @param req
 */
function applyRouteConfig(route, req, res) {
    req.id = route.id;
    req.target = route.model;
    res.limit = route.limit;
}

module.exports = expressJsonApi;
