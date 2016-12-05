module.exports = (function() {
    require('server/globals');

    // Use the environment variable PORT, defaults to 8080 if its not set.
    var port = process.env.PORT || 8080;
    // Use the environment variable NODE_ENV, defaults to development if its not set.
    var env = process.env.NODE_ENV || 'development';

    var server = require('./server/server.js')(inject({
        port,
        env
    }));

    server.startServer(function() {
        console.log('Server listening on port ' + port);
    });

})();
