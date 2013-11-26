'use strict';

var framework = require('../framework');
var Recaptcha = require('recaptcha').Recaptcha;
var config = require('../config');

var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport('Direct', {debug: false});


var PUBLIC_KEY = config.recaptcha_public,
    PRIVATE_KEY = config.recaptcha_private;

module.exports = new framework.Router({
  '/contact': function (req, res) {

    var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);

    res.render('contact', {
      captcha: recaptcha.toHTML(),
      email: '',
      message: '',
      captcha_error: false,
      other_error: false
    });
  },

  'post:/contact': function(req, res) {
    var data = {
        remoteip:  req.connection.remoteAddress,
        challenge: req.body.recaptcha_challenge_field,
        response:  req.body.recaptcha_response_field
    };
    var recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY, data);

    recaptcha.verify(function(success, error_code) {

        if (success) {
          transport.sendMail({
            from: req.body.email, // sender address
            to: 'contact@tunesquared.com', // list of receivers
            subject: 'Contact form feedback', // Subject line
            text: req.body.message // plaintext body
          }, function(error, response){
            if(error){
                console.log('Error occured');
                console.log(error.message);
                // Redisplay the form.
                res.render('contact', {
                  captcha: recaptcha.toHTML(),
                  email: req.body.email,
                  message: req.body.message,
                  captcha_error: false,
                  other_error: true
                });
            } else {
                console.log(response);
                console.log('Message sent successfully!');
                res.render('contact_done');
            }
          });
        }
        else {
          // Redisplay the form.
          res.render('contact', {
            captcha: recaptcha.toHTML(),
            email: req.body.email,
            message: req.body.message,
            captcha_error: true,
            other_error: false
          });
        }
    });

  }
});
