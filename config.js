

var env = process.env.NODE_ENV || 'development';

module.exports = {
    static: {
        '/': (env === 'development') ? 'static/www' : 'dist/www',
        '/m': (env === 'development') ? 'static/www-mobile' : 'dist/www-mobile'
    }
    // , web_port: '500'+Math.floor(Math.random()*10)
};
