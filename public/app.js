'use strict';

var timemgr = {};

timemgr.dates = [
  {
    date: "2016-07-04",
    stime: "2pm PST",
    etime: "4pm PST",
    description: "T1"
  },
  {
    date: "2016-07-05",
    stime: "2pm PST",
    etime: "4pm PST",
    description: "T2"
  }
]

timemgr.showView = function(hash) {
  var routes = {
    '#dates': timemgr.datesList,
    '#start': timemgr.showStart,
    '#date-add': timemgr.dateAdd
  };
  if (routes) {
    $('.container').empty().append(routes[hash]);

    if ($('.datepicker')) {
      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: false // Creates a dropdown of 15 years to control year
      });        
    }

    if ($('.timepicker')) {
      $('.timepicker').pickatime({
        clear: ''
      });
    }
  }
}

timemgr.dateAdd = function(hash) {
  var view = $('.templates .date-add').clone();
  view.find('.title').text('Pick your date and time');
  timemgr.applyObject(timemgr.dates, view);
  return view;
}

timemgr.showStart = function(hash) {
  var view = $('.templates .start').clone();
  view.find('.title').text('Start');
  return view;
}

timemgr.authSelect = function(hash) {
  var authSelect = $('<div class="auth-select">').text('Select auth');
  $('.container').empty().append(authSelect);
}

timemgr.appOnReady = function() {
  window.onhashchange = function() {
    timemgr.showView(window.location.hash);
  }
  timemgr.showView(window.location.hash);
}

timemgr.applyObject = function(obj, elem) {
  for (var key in obj) {
    // elem.find('[data-name=description').text('hello');
  }
};

timemgr.datesList = function() {
  var view = $('.templates .dates-list').clone();
  view.find('.title').text('Dates List');
  timemgr.applyObject(timemgr.dates, view);
  return view;
}