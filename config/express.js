/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var _ = require('lodash');
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var expressJsonApi = require('../lib/express-json-api');
var routes = require('./routes');

module.exports = function(app, config) {
    var env = process.env.NODE_ENV || 'development';

    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env === 'development';

    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(compress());
    app.use(methodOverride());

    expressJsonApi(app, routes);

    /**
     * Catch 404 errors
     */
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /**
     * In development environments display 500 errors.
     */
    if (app.get('env') === 'development') {
        app.use(function(err, req, res) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    /**
     * In production environments do not display the 500 errors.
     */
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {},
            title: 'error'
        });
    });
};
