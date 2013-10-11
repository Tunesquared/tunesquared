define(['$', 'bs/collapse'], function($) {
  'use strict';

  // side menu logic
  var menu = $('.side-menu');
  $('.menu-close').click(function(){
    menu.removeClass('active');
  });

  $('#open-menu').click(function(){
    menu.addClass('active');
  });

  $('.side-menu').click(function(){
    menu.removeClass('active');
  });
});
