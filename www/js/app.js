// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $state, Day, $filter, $rootScope, Tournament, Participant) {
  $ionicPlatform.ready(function() {
      var _date_year = $filter('date')(new Date(), 'yyyy');
      var _date_full = $filter('date')(new Date(), 'yyyy-MM-dd');

      var storage = window.localStorage;
      if(storage.getItem("preffered") != 'undefined'){
        var participant = JSON.parse(storage.getItem("preffered"));
      }
      
      Tournament.getCurrentTournament(_date_year).success(function(result){
          if(result.length != 0){
              
            storage.setItem("tournament", JSON.stringify(result[0]));
            
            if(participant == null){
                $state.go("app.home");
            }
            
            else if(participant != null){
                if(result[0].tournaments_TournamentID == participant.participants_fkTournamentID){
                    $state.go("app.favorites");
                }

                if(result[0].tournaments_TournamentID != participant.participants_fkTournamentID){s
                    storage.removeItem("preffered");
                    $state.go("app.home");
            }
            }
            
              
          }else{
              storage.setItem("tournament", null);
              $state.go("app.home");
          }

      });
      
    var storage = window.localStorage;
    
    var tournament = JSON.parse(storage.getItem("tournament"));
    
    var date = '2016-06-11';
    $rootScope.dateId = null;

    if(tournament != null){
        if($filter('date')(tournament.EndDate_TournamentDate, 'yyyy-MM-dd') < date){
            $rootScope.dateId = storage.getItem("day");

        }else{
             switch (date) {
                case $filter('date')(tournament.StartDate_TournamentDate, 'yyyy-MM-dd'):
                    $rootScope.dateId = tournament.StartDate_DayID
                    break;
                case $filter('date')(tournament.EndDate_TournamentDate, 'yyyy-MM-dd'):
                     $rootScope.dateId = tournament.EndDate_DayID
                    break;
                default:

            }
        }
    }
      
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html'
        }
      }
    })
    .state('app.favorites', {
        url: '/favorites',
        views: {
          'menuContent': {
            templateUrl: 'templates/favorites.html',
            controller: 'FavoritesCtrl'
          }
        }
    })
    .state('app.favorite', {
        url: '/favorites/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/favorite.html',
            controller: 'FavoriteCtrl'
          }
        }
    })
    .state('app.matches', {
        url: '/matches',
        views: {
          'menuContent': {
            templateUrl: 'templates/matches.html',
            controller: 'MatchesCtrl'
          }
        }
    })
    .state('app.match', {
        url: '/matches/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/match.html',
            controller: 'MatchCtrl'
          }
        }
    })
    .state('app.statistics', {
      url: '/statistics',
      views: {
        'menuContent': {
          templateUrl: 'templates/statistics.html',
          controller: 'StatisticsCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('app.news', {
      url: '/news',
      views: {
        'menuContent': {
          templateUrl: 'templates/news.html',
          controller: 'NewsCtrl'
        }
      }
    })
    .state('app.activities', {
      url: '/activities',
      views: {
        'menuContent': {
          templateUrl: 'templates/activities.html',
          controller: 'ActivitiesCtrl'
        }
      }
    })
   .state('app.review', {
      url: '/review',
      views: {
        'menuContent': {
          templateUrl: 'templates/review.html',
          controller: 'ReviewCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
 // $urlRouterProvider.otherwise('/app/favorites');
});
