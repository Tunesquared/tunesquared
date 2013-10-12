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

  $('.vote-buttons button').click(function(){
    if ($(this).hasClass('btn-success')) {
      $(this).parent().children('.btn-info').removeClass('btn-info').removeAttr('disabled').addClass('btn-danger');
      $(this).removeClass('btn-success').addClass('btn-info').attr('disabled', 'disabled');
    } else if ($(this).hasClass('btn-danger')) {
      $(this).parent().children('.btn-info').removeClass('btn-info').removeAttr('disabled').addClass('btn-success');
      $(this).removeClass('btn-danger').addClass('btn-info').attr('disabled', 'disabled');
    }
  });
});
