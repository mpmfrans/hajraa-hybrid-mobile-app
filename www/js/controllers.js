angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, Day, $filter, Tournament, $state) {
    
//    ionic.Platform.ready(function() {
//        //navigator.splashscreen.hide();
//        var storage = window.localStorage;
//        // Pass a key name to get its value.
//        //storage.setItem("home", "test");
//        
////        storage.removeItem("home");
//        var value = storage.getItem("home");
//        //alert(value);
//        if(value == null){
//            $state.go("app.statistics");
//        }else{
//            $state.go("app.favorites");
//        }
//    });
    
//    console.log("Ik wordt nu pas uitgevoerd!Perfect");
//    // date used to get the current dateId
//    var _date = $filter('date')(new Date(), 'yyyy-MM-dd');
//    
//    Day.getCurrentDay('2016-06-11').success(function(result_day){
//        console.log(result_day);
//        $rootScope.dateId = result_day[0].days_DayID;
//    });
//
    
    
    
    // date for the day of the week
    var date = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    $scope._day = weekday[date.getDay()];
})

.controller('MatchesCtrl', function($scope, Match, Level, Group, Participant, $rootScope) {
    $scope.load = function(){
        if($rootScope.dateId != null){
            
            var levels = [];
            
            Level.getAllLevels().success(function(result_level){
                
                angular.forEach(result_level, function(value_level){
                    
                    levels.push(value_level); 
                });
            }).then(function(){
                angular.forEach(levels, function(value_level, key_level){
                   
                    Group.getGroupPerLevelPerDay(value_level.levels_LevelID, $rootScope.dateId).success(function(result_group){
                        
                        levels[key_level].groups = [];
                        
                        angular.forEach(result_group, function(value_group, key_group){
                            
                            Object.assign(levels[key_level].groups, result_group)
                            
                            Match.getMatchesPerGroupPerDay(value_group.groups_GroupID, $rootScope.dateId).success(function(result_match){
                                angular.forEach(result_match, function(value_match){
                                    
                                    levels[key_level].groups[key_group].matches = [];
                                    Object.assign(levels[key_level].groups[key_group].matches, result_match);
                                });
                            });
                        });
                    });
                });   
            }).then(function(){
                
                console.log(levels);
                $scope.levels = levels;
                
            }).finally(function() {
                
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    }
        
    $scope.load();
   
    $scope.toggleLevel = function(level) {
        if ($scope.isLevelShown(level)) {
            //Toggle minus
            $scope.shownGroup = null;
            $scope.shownLevel = null;
        } else {
            //Toggle plus
            $scope.shownGroup = null;
            $scope.shownLevel = level;
        }
    };
    
    $scope.isLevelShown = function(level) {
        return $scope.shownLevel === level;
    };
    
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            //Toggle minus
            $scope.shownGroup = null;
        } else {
            //Toggle plus
            $scope.shownGroup = group;
        }
    };
    
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    }; 
})

.controller('MatchCtrl', function($scope, $stateParams, Match){
    Match.getSpecificMatch($stateParams.id).success(function(result){
       $scope.match = result[0]; 
        console.log($scope.match);
    });
})

.controller('StatisticsCtrl', function(Match, Level, Group, Participant, $scope, $rootScope){
     $scope.load = function(){
        if($rootScope.dateId != null){
            var levels = [];
            Level.getAllLevels().success(function(result_level){

                angular.forEach(result_level, function(value_level){
                   levels.push(value_level); 
                });
            }).then(function(){
                angular.forEach(levels, function(value_level, key_level){

                    Group.getGroupHasParticipantsPerLevel(value_level.levels_LevelID, $rootScope.dateId).success(function(result_group){

                        levels[key_level].statistics = [];
                        angular.forEach(result_group, function(value_group, key_group){
                            Object.assign(levels[key_level].statistics, result_group)
                        });
                    });
                });   
            }).then(function(){
                //console.log(levels);
                $scope.levels = levels;
                console.log(levels);
            }).finally(function() {

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    }
    
    $scope.load();
    
    $scope.toggleLevel = function(level) {
        if ($scope.isLevelShown(level)) {
            //Toggle minus
            $scope.shownGroup = null;
            $scope.shownLevel = null;
        } else {
            //Toggle plus
            $scope.shownGroup = null;
            $scope.shownLevel = level;
        }
    };
    
    $scope.isLevelShown = function(level) {
        return $scope.shownLevel === level;
    };
})

.controller('FavoritesCtrl', function($scope, Participant){
    Participant.getParticipantPerTournament()
})

.controller('HomeCtrl', function($scope, Participant, $state, $ionicHistory, $rootScope){
    
    var storage = window.localStorage;
    
    $scope.participants = $rootScope.participants;
    
    $scope.selected = function(participant){
         $ionicHistory.nextViewOptions({
            disableBack: true
    });
        storage.setItem("preffered", participant);
        $state.go("app.favorites");
    }

        //storage.setItem("home", "test");
        
        //storage.removeItem("home");
  // $ionicSideMenuDelegate.canDragContent(false);
   //alert("test"); 
})

.controller('SettingsCtrl', function($scope, Participant, $ionicPopup, $ionicHistory, $state){
    
      var storage = window.localStorage;
    
    $scope.reset = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Reset',
         template: 'Are you sure you want to reset the application?'
       });
 
       confirmPopup.then(function(res) {
         if(res) {
             storage.removeItem("preffered");
             $ionicHistory.nextViewOptions({ disableBack: true });
             $state.go("app.home");
         } else {
           console.log('Reset canceled !');
         }
   });
 };

        //storage.setItem("home", "test");
        
        //storage.removeItem("home");
  // $ionicSideMenuDelegate.canDragContent(false);
   //alert("test"); 
});