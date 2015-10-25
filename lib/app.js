/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var express = require('express');
var config = require('../config/config');
var logger = require('./utils/logger');

/**
 * The application.
 *
 * @constructor
 */
function App() {
    this._app = express();
    require('../config/express')(this._app, config);
}

/**
 * Starts the application server listening on the configured port
 * @public
 */
App.prototype.init = function() {
    this._app.listen(config.port, function() {
        logger.info('Express server listening on port ' + config.port);
    });
};

/**
 * Returns the express instantiated application.
 * @returns {Function}
 * @public
 */
App.prototype.getExpressApplication = function() {
    return this._app;
};

module.exports = new App();
