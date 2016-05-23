/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//var app = {
//    // Application Constructor
//    initialize: function() {
//        this.bindEvents();
//    },
//    // Bind Event Listeners
//    //
//    // Bind any events that are required on startup. Common events are:
//    // 'load', 'deviceready', 'offline', and 'online'.
//    bindEvents: function() {
//        document.addEventListener('deviceready', this.onDeviceReady, false);
//    },
//    // deviceready Event Handler
//    //
//    // The scope of 'this' is the event. In order to call the 'receivedEvent'
//    // function, we must explicitly call 'app.receivedEvent(...);'
//    onDeviceReady: function() {
//     
//        app.receivedEvent('deviceready');
//      
//        
//        //alert(device.platform);
//    },
//    // Update DOM on a Received Event
//    receivedEvent: function(id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');
//
//        console.log('Received Event: ' + id);
//    }
//};

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ui.router'])

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
              
              
