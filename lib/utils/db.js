/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var q = require('q');
var mongoose = require('mongoose');
var config = require('../../config/config');
var logger = require('./logger');

/**
 * A DB util class that abstracts mongoose functions.
 *
 * @constructor
 */
function Db(options) {
    options = options || {}; // eslint-disable-line no-param-reassign
    this.autoReconnect = options.autoReconnect || false;
}

/**
 * Instantiate the database connection
 */
Db.prototype.connect = function() {
    var deferred = q.defer();
    var connect;

    if (!this._db || this._db.readyState !== mongoose.Connection.STATES.connected) {
        // Connect to mongodb
        connect = function() {
            var options = {server: {socketOptions: {keepAlive: 1}}};
            mongoose.connect(config.db, options);
        };

        // connect to mongo
        connect();

        this._db = mongoose.connection;
        this._db.on('error', function(err) {
            logger.info('Connection error', err);
            throw new Error('unable to connect to database at ' + config.db);
        });
        this._db.on('close', function() {
            logger.info('Connection closed');
        });
        this._db.on('connected', function() {
            logger.info('Connection opened');
            deferred.resolve();
        });
        this._db.on('disconnected', function() {
            if (this.autoReconnect) {
                connect();
            }
        }.bind(this));
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};

Db.prototype.disconnect = function() {
    if (!!this._db && this._db.readyState === mongoose.Connection.STATES.connected) {
        this.autoReconnect = false;
        this._db.close();
    }
};

/**
 * A wrapper around the mongoose save function and returns a promise.
 * @param object
 * @returns {Promise}
 * @public
 */
Db.prototype.create = function(object) {
    return q.ninvoke(object, 'save').
    then(function() {
        return object;
    });
};

/**
 * A wrapper around the mongoose save function to "update", even though they are the same thing as create,
 * other ODMs may differ so this is a way to hedge for the future.
 *
 * @param object
 */
Db.prototype.update = function(object) {
    return q.ninvoke(object, 'save').
    then(function() {
        return object;
    });
};

/**
 * Imports passed data to schema.
 *
 * @param Schema
 * @param data
 * @returns {Promise}
 * @public
 */
Db.prototype.import = function(Schema, data) {
    var deferred = q.defer();
    Schema.collection.insertMany(data, function(err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
};

/**
 * Removes all data from the passed collection schema.
 *
 * @param Schema
 * @returns {Promise}
 * @public
 */
Db.prototype.removeAll = function(Schema) {
    return q.ninvoke(Schema, 'remove', {});
};

/**
 * A wrapper function for the mongoose "find".
 *
 * @param Schema
 * @param options
 * @returns {Promise}
 * @public
 */
Db.prototype.findAll = function(Schema, options) {
    var query;

    if (!options) {
        options = { // eslint-disable-line no-param-reassign
            criteria: {}
        };
    } else if (!options.criteria) {
        options.criteria = {};
    }

    query = Schema.find(options.criteria);

    if (!!options.lean) {
        query.lean();
    }

    if (!!options.select) {
        query.select(options.select);
    }

    return this.execute(query);
};

/**
 * A wrapper function for the mongoose "findOne".
 *
 * @param Schema
 * @param options
 * @returns {Promise}
 * @public
 */
Db.prototype.find = function(Schema, options) {
    var query;

    if (!options) {
        options = { // eslint-disable-line no-param-reassign
            criteria: {}
        };
    } else if (!options.criteria) {
        options.criteria = {};
    }

    query = Schema.findOne(options.criteria);

    if (!!options.lean) {
        query.lean();
    }

    if (!!options.select) {
        query.select(options.select);
    }

    return this.execute(query);
};

/**
 * Wraps a mongoose query in a "q" promise.
 *
 * @param query
 * @returns {Promise}
 * @public
 */
Db.prototype.execute = function(query) {
    var deferred = q.defer();

    query.exec(function(err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
};

module.exports = Db;
