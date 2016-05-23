'use strict';

var timemgr = {
  poolId: 'us-east-1:eb75b5de-1585-40a7-a741-43ab6b020ad2'
};

timemgr.identity = new $.Deferred();

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
    '#date-add': timemgr.dateAdd,
    '#auth': timemgr.auth,
    '': timemgr.showStart
  };
  if (routes) {
    timemgr.triggerEvent('removingView', []);
    $('.container').empty().append(routes[hash]);

    if ($('.datepicker')) {
      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: false // Creates a dropdown of 15 years to control year
      });
    }

    if ($('.timepicker')) {
      $('.timepicker').pickatime({
        clear: '',
        interval: 60,
        min: ["7","00"],
        max: ["16","0"],
        disable: [
          { from: [12,0], to: [2,0] }
        ]
      });
    }
  }
}

function checkDateEntered() {
  if (checkDate()) {
    var correctFlash = timemgr.temalte('correct-flash');
    correctFlash.find('a').attr('href', '#date-add');
    timemgr.flashElement(resultFlash, correctFlash);
  } else {
    timemgr.flashElement(resultFlash, 'Invalid date!');
  }
  return false;
}

timemgr.awsRefresh = function() {
  var deferred = new $.Deferred();
  AWS.config.credentials.refresh(function(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(AWS.config.credentials.identityId);
    }
  });
  return deferred.promise();
}

function googleSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: timemgr.poolId,
      Logins: {
        'accounts.google.com': id_token
      }
    })
  })
  function refresh() {
    return gapi.auth2.getAuthInstance().signIn({
        prompt: 'login'
      }).then(function(userUpdate) {
      var creds = AWS.config.credentials;
      var newToken = userUpdate.getAuthResponse().id_token;
      creds.params.Logins['accounts.google.com'] = newToken;
      return timemgr.awsRefresh();
    });
  }
  timemgr.awsRefresh().then(function(id) {
    timemgr.identity.resolve({
      id: id,
      email: googleUser.getBasicProfile().getEmail(),
      refresh: refresh
    });
  });
}

function fbCheckLoginState() {
  FB.getLoginStatus(function(response) {
    fbStatusChangeCallback(response);
  });
  console.log("checking fb login")
}

  // function refresh() {
  //   return gapi.auth2.getAuthInstance().signIn({
  //       prompt: 'login'
  //     }).then(function(userUpdate) {
  //     var creds = AWS.config.credentials;
  //     var newToken = userUpdate.getAuthResponse().id_token;
  //     creds.params.Logins['accounts.google.com'] = newToken;
  //     return learnjs.awsRefresh();
  //   });
  // }
  // learnjs.awsRefresh().then(function(id) {
  //   learnjs.identity.resolve({
  //     id: id,
  //     email: googleUser.getBasicProfile().getEmail(),
  //     refresh: refresh
  //   });
  // });


// This is called with the results from from FB.getLoginStatus().
function fbStatusChangeCallback(response) {
  var fb_id_token = FB.getAccessToken();
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    testAPI();

    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: timemgr.poolId,
        Logins: {
          'graph.facebook.com': fb_id_token
        }
      })
    })

    // AWS.config.credentials.get(function() {
    //   console.log("aws creds");
    // })

  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
  function refresh() {
    return gapi.auth2.getAuthInstance().signIn({
        prompt: 'login'
      }).then(function(userUpdate) {
      var creds = AWS.config.credentials;
      var newToken = userUpdate.getAuthResponse().accessToken;
      creds.params.Logins['graph.facebook.com'] = newToken;
      return learnjs.awsRefresh();
      console.log("fb refresh: " + newToken);
    });
  }
  learnjs.awsRefresh().then(function(id) {
    learnjs.identity.resolve({
      id: id,
      email: function() {
        FB.api('/me', { locale: 'en_US', fields: 'name, email' },
          function(response) {
            console.log(response.email);
          }
        );
      },
      refresh: refresh
    });
  });
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
  });
}


timemgr.auth = function () {
  var view = $('.templates .auth').clone();
  view.find('.title').text('Select authentication');


  return view;
}

timemgr.buildCorrectFlash = function () {
  var correctFlash = timemgr.template('correct-flash');
  var link = correctFlash.find('a');

}

timemgr.triggerEvent = function(name, args) {
  $('container').trigger(name, args);
}

timemgr.dateAdd = function(hash) {
  var view = $('.templates .date-add').clone();
  view.find('.title').text('Pick your date and time');


  function sendDateClick() {
    var $toastContent = $('<span>Date sent...</span>');
    Materialize.toast($toastContent, 2100);
  }

  view.find('.btn').click(sendDateClick);
  timemgr.applyObject(timemgr.dates, view);
  return view;
}

timemgr.showStart = function(hash) {
  var view = $('.templates .start').clone();
  var buttonBadgeDates = $('.badge');
  buttonBadgeDates.find('span').text(timemgr.dates.length)
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

timemgr.template = function(name) {
  return $('.templates .' + name).clone();
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
