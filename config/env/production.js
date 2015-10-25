/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */
module.exports = {
    app: {
        name: 'best-practise'
    },
    port: 80,
    db: 'mongodb://localhost/express-json-api-example',
    logger: {
        prefix: 'dev -',
        transports: [
            'MongoDb'
        ],
        MongoDb: {}
    }
};
