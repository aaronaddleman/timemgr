describe('TimeMgr', function() {
  it('can show start', function() {
    timemgr.showStart('#start');
    expect($('#start').length).toEqual(1);
  });

  it('can authenticate', function() {
    timemgr.authSelect('#auth');
    expect($('.container .auth-select').length).toEqual(1);
  });

  it('invokes the router when loaded', function () {
    spyOn(timemgr, 'showStart');
    timemgr.appOnReady();
    expect(timemgr.showStart).toHaveBeenCalledWith(window.location.hash);
  });

  it('subscribes to the hash change event', function() {
    timemgr.appOnReady();
    spyOn(timemgr, 'showStart');
    $(window).trigger('hashchange');
    expect(timemgr.showStart).toHaveBeenCalledWith(window.location.hash);
  })

  // it('can show a problem view', function() {
  //   learnjs.showView('#problem-1');
  //   expect($('.view-container .problem-view').length).toEqual(1);
  // });

  // it('shows the landing page view when there is no hash', function() {
  //   learnjs.showView('');
  //   expect($('.view-container .landing-view').length).toEqual(1);
  // });

  // it('passes the hash view parameter to the view function', function() {
  //   spyOn(learnjs, 'problemView');
  //   learnjs.showView('#problem-42');
  //   expect(learnjs.problemView).toHaveBeenCalledWith('42');
  // });

  // it('invokes the router when loaded', function() {
  //   spyOn(learnjs, 'showView');
  //   learnjs.appOnReady();
  //   expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
  // });

  // it('subscribes to the hash change event', function() {
  //   learnjs.appOnReady();
  //   spyOn(learnjs, 'showView');
  //   $(window).trigger('hashchange');
  //   expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
  // });

  // describe('problem view', function () {
  //   var view;
  //   beforeEach(function() {
  //     view = learnjs.problemView('1');
  //   });

  //   it('has a title that includes the problem number', function() {
  //     learnjs.showView('#problem-1');
  //     expect($('.title').text()).toEqual('Problem #1');
  //   });

  //   describe('answer section', function() {
  //     it('can check a correct answer by hitting a button', function() {
  //       view.find('.answer').val('true');
  //       view.find('.check-btn').click();
  //       expect(view.find('.result').text()).toContain('Correct! Next Problem');
  //     });

  //     it('rejects an incorrect answer', function() {
  //       view.find('.answer').val('false');
  //       view.find('.check-btn').click();
  //       expect(view.find('.result').text()).toEqual('Incorrect!');
  //     });
  //   });
  // });
});