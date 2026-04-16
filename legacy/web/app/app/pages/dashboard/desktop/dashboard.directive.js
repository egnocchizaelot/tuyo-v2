'use strict';

angular.module('dashboard')
.directive('dashboardDesktop', ['API', '$window', 'appService', '$state', '$modal', '$interval', 'socketService', 'Auth', '$rootScope', '$timeout', 'postServices',
    function (API, $window, appService, $state, $modal, $interval, socketService, Auth, $rootScope, $timeout, postServices) {

        var scope = {
        };

        var link = function (scope, element) {
            scope.element = element;
            scope.window = angular.element($window);
            scope.$state = $state;

            scope.mobile = appService.isMobile;

            scope.thisURL = $state.current.name;

            scope.publicationsText = '0 Publicaciones';

            scope.lastDate = (new Date()).toJSON();

            scope.countLikes = 0;
            scope.firstLikes = 0;

            scope.loadingStuff = true;

            scope.noDonations = true;
            scope.loadDonations = function () {
                scope.donationsDone = false;

                if (Object.keys(scope.filters).length === 1) {
                    scope.$broadcast('showImportantNotices', true);
                } else {
                    scope.$broadcast('showImportantNotices', false);
                }

                // let date = (new Date()).toJSON();
                var date;
                API.getNextDonations(date, scope.filters).then(function(donations) {

                    if (typeof donations === 'string') {
                        return;
                    }

                    scope.loadingStuff = false;

                    if (donations.elements.length === 0) {
                        scope.noDonations = true;
                        return;
                    }

                    scope.noDonations = false;

                    scope.window.scrollTop(0);

                    var e = donations.elements[0];
                    if (e.donation || e.notice){
                        scope.firstDate = e.donation ? e.donation.date_updated : e.notice.created;
                        scope.firstLikes = e.donation ? e.donation.count_likes : e.notice.count_likes;
                    }
                    else {
                        scope.firstDate = e.date_updated;
                        scope.firstLikes = e.count_likes;
                    }

                    scope.$broadcast('firstDonations', donations.elements);
                });
            };

            // Loads the donations at a donation on the feed. The given one and the 5 on top and 5 on bottom of it
            scope.loadOnContext = function () {
                scope.donationsDone = false;
                scope.noDonations = false;


                var f = $.extend({}, scope.filters);
                if (scope.filters.order_by === 'likes') {
                    f.count_likes = scope.countLikes;
                }

                f.page_size = 3;

                API.getDonationContext(scope.focusDonation, f).then(function(donations) {

                    if (typeof donations === 'string') {
                        return;
                    }

                    if (donations.elements.length === 0) {
                        scope.noDonations = true;
                        return;
                    }

                    var e = donations.elements[0];
                    if (e.donation || e.notice) {
                        scope.firstDate = e.donation ? e.donation.date_updated : e.notice.created;
                    } else {
                        scope.firstDate = e.date_updated;
                    }

                    scope.$broadcast('firstDonations', donations.elements);
                    $timeout(function () {
                        $timeout(function () {
                            var topOnes = [];
                            for (var i = 0; i < donations.elements.length; i++) {

                                var id = -1;
                                if (donations.elements[i].donation) {
                                    id = donations.elements[i].donation.id;
                                } else if (donations.elements[i].notice) {
                                    id = donations.elements[i].notice.id;
                                }


                                if (id === -1) { continue; }


                                if ( id === scope.focusDonation) {
                                    break;
                                }

                                topOnes.push("#donation_" + id);
                            }

                            var h = 0;
                            for (var j = 0; j < topOnes.length; j++) {
                                h += angular.element(topOnes[j]).height();
                            }

                            h += angular.element('#bannerBar').outerHeight();
                            h += angular.element('#filterBar').outerHeight();


                            scope.window.scrollTop(h);

                        });

                    });

                });
            };

            scope.loading = true;

            if (scope.focusDonation === -1) {
                scope.loadDonations();
            } else {
                scope.loadOnContext();
            }


            scope.$on('numberOfPosts', function(smth, number) {
                if (number === 1) {
                    scope.publicationsText = '1 Publicación';
                } else {
                    scope.publicationsText = number + ' Publicaciones';
                }
            });

            scope.showFilterModal = function() {

                var modal = $modal.open({
                    templateUrl: 'app/modals/filter/filter.template.html',
                    controller: 'filterDonationsController',
                    // backdrop: 'static',
                    animation: true,
                    windowClass: 'modal-filtrar'
                });

                modal.result.then(
                    function (result) {

                        if (!result || result === scope.filterSelected) {
                            return;
                        }

                        scope.window.scrollTop(0);
                        delete scope.filters.order_by;
                        delete scope.filters.count_likes;


                        switch (result) {
                            case scope.filterOptions.DONATIONS:
                                scope.filters.filter_by = 'ofrecimientos';
                                scope.filterName = 'Ofrecimientos';
                                break;

                            case scope.filterOptions.AVAILABLE:
                                scope.filters.filter_by = 'disponibles';
                                scope.filterName = 'Disponibles';
                                break;

                            case scope.filterOptions.RECENT:
                                scope.filters.filter_by = 'recientes';
                                scope.filterName = 'Recientes';
                                break;

                            case scope.filterOptions.THANKS:
                                scope.filters.filter_by = 'agradecimientos';
                                scope.filterName = 'Agradecimientos';
                                break;

                            case scope.filterOptions.LIKED:
                                delete scope.filters.filter_by;
                                scope.filters.order_by = 'likes';
                                scope.filterName = 'Destacados';
                                break;

                            case scope.filterOptions.ALL:
                                delete scope.filters.filter_by;
                                scope.filterName = 'Filtrar';
                                break;
                        }

                        delete scope.filters.page;
                        scope.page=1;
                        scope.filterSelected = result;
                        scope.loadDonations();
                    }
                );

            };

            scope.lastPos = 0;


            scope.OnScroll = function () {
                scope.loadOnScroll();

                var h = scope.window.scrollTop();
                var dir = h > scope.lastPos ? -1 : 1;

                scope.lastPos = h;

                scope.filterBarOnScroll(dir, h);
                scope.locationsOnScroll(dir, h);
            };

            scope.window.on('scroll', scope.OnScroll);


            scope.slidingUp = false;
            scope.slidingDown = false;
            scope.filterBarOnScroll = function (dir, h) {
                if (scope.mobile) {
                    return;
                }

                if (dir === -1) {
                    if (!scope.slidingUp && h > appService.titleHeight + appService.navigationHeight){
                        if (scope.slidingDown) {
                            scope.element.find('#scrollFilters').clearQueue();
                        }
                        scope.slidingUp = true;
                        scope.element.find('#scrollFilters').slideUp(400, function () { scope.slidingUp = false; });
                    }

                }
                else {
                    if (!scope.slidingDown && h > appService.titleHeight + appService.navigationHeight + 400) {
                        if (scope.slidingUp) {
                            scope.element.find('#scrollFilters').clearQueue();
                        }
                        scope.slidingDown = true;
                        scope.element.find('#scrollFilters').slideDown(400, function () {scope.slidingDown = false;});
                    }

                    else if (h <= appService.titleHeight) {
                        scope.element.find('#scrollFilters').finish();
                        scope.element.find('#scrollFilters').css('display', 'none');
                    }
                }
            };

            scope.locationsOnScroll = function (dir) {
                if (dir === -1) {
                    if (scope.element.find('#locationFilter').css('display') === 'block') {
                        scope.element.find('#locationFilter').collapse('hide');
                    }
                }
                else {
                    if (scope.element.find('#locationFilter').css('display') === 'block') {
                        scope.element.find('#locationFilter').collapse('hide');
                    }
                }
            };

            // region  --  FILTERS  --
            scope.showingLocF = false;
            scope.showLocationFilter = function(){
                scope.showingLocF = !scope.showingLocF;

                if (scope.showingLocF) {
                    $('#locationFilter').slideDown('100', function() {});
                } else {
                    $('#locationFilter').slideUp('100', function() {});
                }
            };

            scope.goTolocationFilter = function () {

                scope.locationSelected = 'Uruguay';

                delete scope.filters.location;
                delete scope.filters.page;

                scope.page=1;
                scope.showLocationFilter();
                scope.loadDonations();
            };

            scope.cancelAddress = function () {
                scope.$state.go(scope.thisURL, {filters: scope.filters});
            };

            scope.acceptAddress = function (data) {
                var location = {
                    lat: data.lat,
                    lng: data.lng,
                    radius: data.zoom / 2
                };

                scope.filters.location = location;
                delete scope.filters.page;
                scope.page=1;

                var filters = scope.filters;
                filters.mapData = data;

                scope.$state.go(scope.thisURL, {filters: filters});
            };

            scope.mapLocation = function () {
                $state.go('app.map', {
                    cancel: scope.cancelAddress,
                    accept: scope.acceptAddress,
                    filterLocation: true
                });
            };

            scope.search = undefined;
            scope.canSearch = true;
            scope.textSearch = function() {
                if (scope.filters.search === scope.search) {
                    return;
                }

                scope.canSearch = false;

                delete scope.filters.page;
                scope.page=1;

                scope.filters.search = scope.search;

                scope.loadDonations();
            };

            scope.clearTextSearch = function () {
                delete scope.filters.page;
                scope.page=1;

                delete scope.filters.search;
                scope.search = "";

                scope.canSearch = true;

                scope.loadDonations();
            };

            $('#searchText').keyup(function(key){

                scope.canSearch = true;

                if (key.which === 13) {
                    $('#searchText').blur();
                    scope.textSearch();
                }
            });


            // endregion

            /* LOAD ON SCROLL*/
            scope.loadOnScroll = function () {
                if (scope.loading) {
                    return;
                }

                if (scope.window.scrollTop() <= 0) {
                    scope.loadTopDonations();
                    return;
                }

                if (!scope.loadInterval && scope.window.scrollTop() <= 200 && scope.donationsDone) {
                    scope.loadTopDonations();
                    scope.loadInterval = setInterval(scope.loadTopDonations, 20000, this);
                    return;
                }


                if (scope.loadInterval && scope.window.scrollTop() > 200) {
                    clearInterval(scope.loadInterval);
                    delete scope.loadInterval;
                }
                if (scope.window.scrollTop() + scope.window.height() >= $(document).height() - 400 && scope.donationsDone) {

                    scope.loading = true;
                    scope.donationsDone = false;

                    var f = $.extend({}, scope.filters);
                    if (scope.filters.order_by === 'likes') {
                        f.count_likes = scope.countLikes;
                    }

                    API.getNextDonations(scope.lastDate, f).then(function(donations) {

                        if (typeof donations === 'string') {
                            scope.loading = false;
                            scope.donationsDone = true;
                            return;
                        }

                        if (donations.elements.length === 0) {
                            // No more donations — leave scope.loading = true to
                            // prevent the scroll handler from triggering additional requests.
                            return;
                        }

                        scope.$broadcast('nextDonations', donations.elements);
                    });

                }
            };

            scope.loadTopDonations = function() {
                scope.loading = true;
                scope.donationsDone = false;

                var f = $.extend({}, scope.filters);
                if (scope.filters.order_by === 'likes') {
                    f.count_likes = scope.firstLikes;
                }

                API.getPrevDonations(scope.firstDate, f).then(function(donations) {
                    if (typeof donations === 'string') {
                        scope.loading = false;
                        scope.donationsDone = true;
                        return;
                    }

                    scope.$broadcast('prevDonations', donations.elements);
                });
            };

            scope.loadInterval = setInterval(scope.loadTopDonations, 20000, this);

            /*  END - LOAD ON SCROLL  */

            // region  --  NOTICES  --
            scope.noNotices = true;
            API.notices().then(function(notices) {

                scope.loadingStuff = false;

                if (notices.results && notices.results.length === 0) {
                    return;
                }

                scope.noNotices = false;
                scope.$broadcast('setNotices', notices.results);
            });
            // endregion


            scope.$on('lastDonation', function(smth, date, likes) {
                scope.loading = false;
                scope.donationsDone = true;
                if (date === -1 || likes === -1) {
                    return;
                }

                scope.lastDate = date;
                scope.countLikes = likes;

                // AC6: Viewport-fill check for the 3-column grid layout.
                // The grid compresses vertical space so the document height may be
                // less than the viewport height after the initial load, making the
                // scroll threshold unreachable. Automatically load the next page
                // until the document becomes scrollable or the API returns empty.
                $timeout(function () {
                    if (scope.donationsDone && $(document).height() < scope.window.height()) {
                        scope.loading = true;
                        scope.donationsDone = false;

                        var f = $.extend({}, scope.filters);
                        if (scope.filters.order_by === 'likes') {
                            f.count_likes = scope.countLikes;
                        }

                        API.getNextDonations(scope.lastDate, f).then(function(donations) {
                            if (typeof donations === 'string') {
                                scope.loading = false;
                                scope.donationsDone = true;
                                return;
                            }

                            if (donations.elements.length === 0) {
                                return;
                            }

                            scope.$broadcast('nextDonations', donations.elements);
                            // 'lastDonation' will fire again from the post controller,
                            // repeating this check until the page is scrollable or empty.
                        });
                    }
                });
            });

            scope.$on('topDonations', function(smth, date, likes) {
                scope.loading = false;
                scope.donationsDone = true;
                if (date === -1) {
                    return;
                }

                scope.firstDate = date;
                scope.firstLikes = likes;
            });


            // region  --  NEW DONATIONS  --
            scope.newDonations = false;
            socketService.newDonationsCallback = function (data) {
                if (!data) {
                    return;
                }

                scope.cancelPromise();
                $rootScope.$broadcast('thereAreNewDonations', data);
            };

            scope.cancelPromise = function () {
                if (!scope.promise) {
                    return;
                }

                $interval.cancel(scope.promise);
                scope.promise = undefined;
            };
            // endregion

            // region  --  MOBILE BUTTONS  --
            scope.userPath = $state.href('app.user', {id: Auth.userData.id});
            scope.newDonation = function () {

                postServices.NewDonation();

            };

            // endregion

            scope.isMobile = function () {
                return scope.window.width() <= 767;
            };

            scope.showPosts = function () {
                return !scope.noDonations || (!scope.noNotices && Object.keys(scope.filters).length <= 1);
            };

            scope.$on('$destroy', function() {
                clearInterval(scope.loadInterval);
                scope.cancelPromise();
                scope.window.off('scroll', scope.OnScroll);
            });

        };


        return {
            restrict: 'E',
            templateUrl: 'app/pages/dashboard/desktop/dashboard.template.html',
            controller: 'dashboardControllerDesktop',
            link: link,
            scope: scope
        };
    }
]);
