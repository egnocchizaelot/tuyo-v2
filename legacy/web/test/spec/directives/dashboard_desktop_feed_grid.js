'use strict';

// Unit tests for the dashboardDesktop directive's infinite-scroll behaviour
// under the 3-column CSS Grid feed layout.
//
// The 3-column grid compresses the same number of cards into ~one-third the
// vertical space.  If not handled, scroll-threshold pagination can break:
//  • The page may be shorter than the viewport after the first load, so the
//    bottom-of-page threshold is already met before the user scrolls.
//  • "Previous donations" (scroll-to-top) must still fire on a shorter page.
//
// Dependencies:
//  app/app/pages/dashboard/desktop/dashboard.directive.js
//  app/app/pages/dashboard/desktop/dashboard.controller.js
//  angular-mocks ($compile, $httpBackend, $q, spies on API service)

describe('Directive: dashboardDesktop - feed grid scroll behaviour', function () {

  var element, scope;
  var $rootScope, $compile, $q, $timeout, $templateCache;
  var API;

  // ─── module setup ────────────────────────────────────────────────────────

  beforeEach(module('feApp'));

  // Override $stateParams so the controller initialises cleanly:
  //   focusDonation = -1  → loadDonations() is called (not loadOnContext())
  //   filters = {}        → Object.keys(filters) works without errors
  beforeEach(module(function ($provide) {
    $provide.value('$stateParams', { donationId: -1, filters: {} });
  }));

  beforeEach(inject(function (
    _$rootScope_, _$compile_, _$q_, _$timeout_, _$templateCache_, _API_
  ) {
    $rootScope    = _$rootScope_;
    $compile      = _$compile_;
    $q            = _$q_;
    $timeout      = _$timeout_;
    $templateCache = _$templateCache_;
    API           = _API_;

    // Provide a minimal template so the directive compiles without HTTP
    $templateCache.put(
      'app/pages/dashboard/desktop/dashboard.template.html',
      '<div></div>'
    );

    // Default stubs — individual tests override as needed
    spyOn(API, 'getNextDonations').and.returnValue($q.resolve({ elements: [] }));
    spyOn(API, 'getPrevDonations').and.returnValue($q.resolve({ elements: [] }));
    spyOn(API, 'getDonationContext').and.returnValue($q.resolve({ elements: [] }));
    spyOn(API, 'notices').and.returnValue($q.resolve({ results: [] }));
  }));

  // ─── helpers ─────────────────────────────────────────────────────────────

  function makeDonations(count, cursor) {
    var elements = [];
    for (var i = 0; i < count; i++) {
      elements.push({
        donation: {
          id: i + 1,
          date_updated: cursor || '2024-01-01T00:00:00Z',
          count_likes: 0
        }
      });
    }
    return { elements: elements };
  }

  function buildDirective() {
    var parentScope = $rootScope.$new();
    element = $compile('<dashboard-desktop></dashboard-desktop>')(parentScope);
    $rootScope.$digest();
    scope = element.isolateScope() || element.scope();
    return scope;
  }

  // Put the directive into a scroll-ready state:
  //   loading = false, donationsDone = true
  function markLoadComplete(cursor) {
    scope.$broadcast('lastDonation', cursor || '2024-01-01T00:00:00Z', 0);
    $rootScope.$digest();
  }

  afterEach(function () {
    if (element) {
      element.remove();
    }
  });

  // ─── tests ───────────────────────────────────────────────────────────────

  it('automatically loads additional pages when initial content does not fill the viewport',
    function () {
      // 6 cards in a 3-column grid occupy only 2 rows, making the page
      // shorter than the viewport.  The directive must keep requesting pages
      // until the document height exceeds the viewport height.

      API.getNextDonations.and.returnValue($q.resolve(makeDonations(6)));
      buildDirective();
      markLoadComplete();

      var callsBefore = API.getNextDonations.calls.count();

      API.getNextDonations.and.returnValue($q.resolve(makeDonations(6)));

      scope.loading = false;
      scope.donationsDone = true;

      // Simulate: 6 cards in 3-column grid → document height (400px) < viewport (900px)
      spyOn(scope.window, 'scrollTop').and.returnValue(1);
      spyOn(scope.window, 'height').and.returnValue(900);

      var origHeight = $.fn.height;
      $.fn.height = function () { return 400; };

      scope.loadOnScroll();
      $rootScope.$digest();

      $.fn.height = origHeight;

      expect(API.getNextDonations.calls.count()).toBeGreaterThan(callsBefore);
    }
  );

  it('calls getNextDonations with the correct lastDate cursor when scrolled within 400px of the bottom',
    function () {
      // On a shorter page the threshold (scrollTop + viewportH >= docH - 400)
      // fires sooner.  The cursor passed must be scope.lastDate, not a stale value.

      API.getNextDonations.and.returnValue($q.resolve(makeDonations(20)));
      buildDirective();

      var expectedCursor = '2024-03-10T08:00:00Z';
      markLoadComplete(expectedCursor);

      API.getNextDonations.calls.reset();
      API.getNextDonations.and.returnValue($q.resolve({ elements: [] }));

      scope.loading = false;
      scope.donationsDone = true;

      // scrollTop(500) + height(800) = 1300 >= doc(1700) - 400 = 1300 → threshold met
      spyOn(scope.window, 'scrollTop').and.returnValue(500);
      spyOn(scope.window, 'height').and.returnValue(800);

      var origHeight = $.fn.height;
      $.fn.height = function () { return 1700; };

      scope.loadOnScroll();
      $rootScope.$digest();

      $.fn.height = origHeight;

      expect(API.getNextDonations).toHaveBeenCalledWith(expectedCursor, jasmine.any(Object));
    }
  );

  it('does not make further getNextDonations calls after the API returns an empty elements array',
    function () {
      API.getNextDonations.and.returnValue($q.resolve(makeDonations(10)));
      buildDirective();
      markLoadComplete();

      // First scroll load: API returns an empty page
      var emptyDeferred = $q.defer();
      API.getNextDonations.and.returnValue(emptyDeferred.promise);

      scope.loading = false;
      scope.donationsDone = true;

      spyOn(scope.window, 'scrollTop').and.returnValue(500);
      spyOn(scope.window, 'height').and.returnValue(800);

      var origHeight = $.fn.height;
      $.fn.height = function () { return 1700; };

      scope.loadOnScroll();
      $rootScope.$digest();

      $.fn.height = origHeight;

      emptyDeferred.resolve({ elements: [] });
      $rootScope.$digest();

      // After empty result scope.loading stays true → subsequent scroll events
      // are blocked immediately by the early-return guard
      var callsAfterEmpty = API.getNextDonations.calls.count();

      var origHeight2 = $.fn.height;
      $.fn.height = function () { return 1700; };

      scope.loadOnScroll();
      $rootScope.$digest();

      $.fn.height = origHeight2;

      expect(API.getNextDonations.calls.count()).toBe(callsAfterEmpty);
      expect(scope.loading).toBe(true);
    }
  );

  it('calls getPrevDonations when the user scrolls to the very top of the feed',
    function () {
      API.getNextDonations.and.returnValue($q.resolve(makeDonations(10)));
      buildDirective();
      markLoadComplete();

      scope.loading = false;
      scope.donationsDone = true;

      // scrollTop <= 0 → the directive should call loadTopDonations → getPrevDonations
      spyOn(scope.window, 'scrollTop').and.returnValue(0);
      spyOn(scope.window, 'height').and.returnValue(800);

      scope.loadOnScroll();
      $rootScope.$digest();

      expect(API.getPrevDonations).toHaveBeenCalled();
    }
  );

  it('removes the window scroll handler and cancels polling intervals when the directive scope is destroyed',
    function () {
      buildDirective();
      $rootScope.$digest();

      var offSpy = spyOn(scope.window, 'off').and.callThrough();
      spyOn(window, 'clearInterval').and.callThrough();

      scope.$destroy();

      expect(offSpy).toHaveBeenCalledWith('scroll', scope.OnScroll);
      expect(window.clearInterval).toHaveBeenCalled();
    }
  );

});
