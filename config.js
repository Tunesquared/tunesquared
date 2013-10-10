

var env = process.env.NODE_ENV || 'development';

var url = require('url');
var redisUrl;
var redisAuth;

if (process.env.REDISTOGO_URL !== undefined) {
  redisUrl = url.parse(process.env.REDISTOGO_URL);
  redisAuth = redisUrl && redisUrl.auth.split(':');
}

module.exports = {
    static: {
        '/': (env === 'development') ? 'static/www' : 'dist/www',
        '/m': (env === 'development') ? 'static/www-mobile' : 'dist/www-mobile'
    },

    redis_host: redisUrl && redisUrl.hostname,
    redis_port: redisUrl && redisUrl.port,
    redis_db: redisAuth && redisAuth[0],
    redis_pass: redisAuth && redisAuth[1],

    mongo_uri: process.env.MONGOLAB_URI || 'mongodb://localhost/tunesquared'
    // , web_port: '500'+Math.floor(Math.random()*10)
};
