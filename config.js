

var env = process.env.NODE_ENV || 'development';

var config = module.exports = {
    static: {
        '/': (env === 'development') ? 'static/www' : 'static/www-build',
        '/m': (env === 'development') ? 'static/www-mobile' : 'static/www-mobile-build'
    }
    
    // , web_port: '500'+Math.floor(Math.random()*10)
}