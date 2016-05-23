angular.module('starter', ['ionic', 'ui.router'])

.run(function($ionicPlatform, $state, Day, $filter, $rootScope, Tournament, Participant) {
    $ionicPlatform.ready(function() {
        
      
    var _date = $filter('date')(new Date(), 'yyyy');
        //console.log(_date);
//    
//    Day.getCurrentDay('2016-06-11').success(function(result_day){
//        console.log(result_day);
//        $rootScope.dateId = result_day[0].days_DayID;
//    }).then(function(){
//         var storage = window.localStorage;
//
//        var value = storage.getItem("preffered");
//
//        if(value == null){
//            $state.go("app.matches");
//        }else{
//            $state.go("app.favorites");
//        }
//    });
        
  var storage = window.localStorage;
  var value = storage.getItem("preffered");
  
  if(value == null){
      
      var tournamentID;
      console.log(_date);
      Tournament.getCurrentTournament(_date).success(function(result_tournament){
        tournamentID = result_tournament[0].tournaments_TournamentID;
      }).then(function(){
         
          Participant.getParticipantPerTournament(tournamentID).success(function(result_participants){
             $rootScope.participants = result_participants;
             $state.go("app.home"); 
          });
          
      });
      
      
  }else{
      $state.go("app.favorites");
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
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
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
    });
  // if none of the above states are matched, use this as the fallback
 // $urlRouterProvider.otherwise('/app/favorites');
});
              
              
