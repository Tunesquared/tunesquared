'use strict';


// Middleware to make sure session is well populated
require('../framework').session(function(sess){
  sess.votes = [];
});
