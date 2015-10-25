/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
var _ = require('lodash');

function query(req, res, next) {
    var criteria = {};
    var err;

    if (!!req.target) {
        if (!!req.id && !!req.params[req.id]) {
            criteria[req.id] = req.params[req.id];
            res.query = req.target.findOne(criteria);
            next();
        } else {
            err = new Error('Incorrect Parameter');
            err.status = 400;
            next(err);
        }
    } else {
        targetModelNotFoundException(next);
    }
}

function execute(req, res, next) {
    var query = res.query;

    if (!!query) {
        query.lean();
        query.exec('findOne', function(err, results) {
            if (err) {
                next(err);
            } else if (!results) {
                var err = new Error('Resource not found');
                err.status = 404;
                next(err);
            } else {
                res.results = results;
                next();
            }
        });
    } else {
        targetModelNotFoundException(next);
    }
}

function serialize(req, res, next) {
    // run the data through any serializers or data mappers
    var results = res.results;

    if (!!results) {
        //serialize
    }
    res.results = results;

    next();
}

function render(req, res, next) {
    // send the data back to the client
    res.json({
        meta: {
            page: {
                total: 1,
                offset: 1,
                limit: 1
            }
        },
        data: res.results
    });
}

function targetModelNotFoundException(next) {
    var err = new Error('Target Model Not Found');
    err.status = 500;
    next(err);
}

module.exports.query = query;
module.exports.execute = execute;
module.exports.serialize = serialize;
module.exports.prepareViewModel = render;

module.exports.default = [
    query,
    execute,
    serialize,
    render
];