'use strict';

var timemgr = {};


timemgr.showStart = function(hash) {
  var timeStart = $('<a class="waves-effect waves-light btn" id="start">').text('Start');
  $('.container').empty().append(timeStart);
}

timemgr.authSelect = function(hash) {
  var authSelect = $('<div class="auth-select">').text('Select auth');
  $('.container').empty().append(authSelect);
}

timemgr.appOnReady = function() {
  window.onhashchange = function() {
    timemgr.showStart(window.location.hash);
  }
  timemgr.showStart(window.location.hash);
}
