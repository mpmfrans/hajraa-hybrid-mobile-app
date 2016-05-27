angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, Day, $filter, Tournament, $state) {
    
    $scope._date_year = $filter('date')(new Date(), 'yyyy');
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

.controller('MatchesCtrl', function($scope, Match, Level, Group, Participant, $rootScope, $filter) {
    
    $scope.load = function(){
        if($rootScope.dateId != null){
            
            $scope.show = true;
            
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
        }else{
            $scope.show = false;
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
    $scope.load = function(){
    Match.getSpecificMatch($stateParams.id).success(function(result){
        //console.log(result);
        
       $scope.match = result[0];
       if(result[0].matches_isPlayed == true){
           if(result[0].matches_ParticipantOneScore > result[0].matches_ParticipantTwoScore){
                $scope.winner = result[0].Participantone_TeamName; 
            }
            else if(result[0].matches_ParticipantOneScore < result[0].matches_ParticipantTwoScore){
                $scope.winner = result[0].Participanttwo_TeamName; 
            }
            else{
                $scope.winner = "Draw";
            }
           
       }
    }).finally(function() {
                
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    $scope.load();
})

.controller('StatisticsCtrl', function(Match, Level, Group, Participant, $scope, $rootScope){
     $scope.load = function(){
        if($rootScope.dateId != null){
            
            $scope.show = true;
            
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
        }else{
            $scope.show = false;
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

.controller('FavoritesCtrl', function($state, $scope, Participant, $rootScope, $ionicHistory){
    
    var storage = window.localStorage;
    
    var participant = JSON.parse(storage.getItem("preffered"));
    
    $scope.favorites = JSON.parse(storage.getItem("favorites"));
    
    console.log($scope.favorites);
    
//    Participant.getParticipant(participant.participants_ParticipantID).success(function(participant){
//        $scope.preffered = participant[0];
//    });
    $scope.preffered = participant;
    
    var storage = window.localStorage;
    
    var tournament = JSON.parse(storage.getItem("tournament"));
    
    if(tournament != null){
        Participant.getParticipantPerTournament(tournament.tournaments_TournamentID).success(function(participants){
            $scope.participants = participants;
        });
    }
    else{
        $scope.participants = null;
    }
    
    $scope.selected = function(participant){
        var a = [];
        // Parse the serialized data back into an aray of objects
        if(JSON.parse(storage.getItem('favorites')) != null){
             a = JSON.parse(storage.getItem('favorites'));
             // Push the new data (whether it be an object or anything else) onto the array
             a.push(participant);
            console.log("de tweede");
        }else{
             console.log("de eerste");
             a.push(participant);
        }

        storage.setItem('favorites', JSON.stringify(a));

        $ionicHistory.nextViewOptions({
            disableBack: true,
        });
        
        $state.go($state.current, {}, {reload: true});
        
    }
})

.controller('FavoriteCtrl', function($scope, Activity, $stateParams, $state, Group, $rootScope, Match, $ionicHistory){
    $scope.load = function(){
    var participant = null;    
            var groups = [];
            Group.getGroupHasParticipantPerParticipantPerDay($stateParams.id, $rootScope.dateId).success(function(result_group){
                //$scope.participant = result[0];
                participant = result_group[0];
                $scope.participant = participant;
                if(participant != null ){
                    $scope.message = false;
                }else{
                    $scope.message = true;
                }
                groups = result_group;
            }).then(function(){
                angular.forEach(groups, function(value_group, key_group){

                    Match.getMatchesPerGroupPerDay(value_group.groups_has_participants_fkGroupID, $rootScope.dateId).success(function(result_match){

                        groups[key_group].matches = [];
                        angular.forEach(result_match, function(value_match, key_match){
                            Object.assign(groups[key_group].matches, result_match)
                        });
                    });
                });   
            }).then(function(){
                //console.log(levels);
                $scope.groups = groups;
                console.log(groups);
                
            }).finally(function() {

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    $scope.load();
    
$scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
    
 $scope.viewMatch = function(){
         $ionicHistory.nextViewOptions({
            disableBack: false,
        });
    }
 
 $scope.goFavorite = function(favorite){
     $state.go("app.favorite", {favorite:favorite});
 }
})

.controller('HomeCtrl', function($scope, Participant, $state, $ionicHistory, $rootScope, Participant){
    var storage = window.localStorage;
    
    var tournament = JSON.parse(storage.getItem("tournament"));
    
    $scope.show = true;
    
    if(tournament != null){
        Participant.getParticipantPerTournament(tournament.tournaments_TournamentID).success(function(participants){
            $scope.participants = participants;
        });
    }
    else{
        $scope.show = false;
    }
    
    $scope.selected = function(participant){
        storage.setItem("preffered", JSON.stringify(participant));

        $ionicHistory.nextViewOptions({
            disableBack: true,
        });
        
        $state.go("app.favorites", {participant:participant});
        
    }
})

.controller('SettingsCtrl', function($scope, Participant, $ionicPopup, $ionicHistory, $state, $rootScope, $filter){
    
    var storage = window.localStorage;
    
    $scope.tournament = JSON.parse(storage.getItem("tournament"));
    
    var _date_full = $filter('date')(new Date(), 'yyyy-MM-dd');
    
    $scope.days = [];
    $scope.days.push({id: $scope.tournament.tournaments_fkStartDate, name: "Saturday"});
    $scope.days.push({id: $scope.tournament.tournaments_fkEndDate, name: "Sunday"});
    
    $scope.disabled = true;
    
    if(_date_full > $filter('date')($scope.tournament.EndDate_TournamentDate, 'yyyy-MM-dd')){
        $scope.disabled = false;
    }
    
    $scope.setDay = function(selectedDay){
        storage.setItem("day", selectedDay);
        $rootScope.dateId = selectedDay;
    }
    
    $scope.reset = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Reset',
         template: 'Are you sure you want to reset the application?'
       });
 
       confirmPopup.then(function(res) {
         if(res) {
             storage.removeItem("preffered");
             storage.removeItem("favorites");
             storage.removeItem("day");
             $ionicHistory.nextViewOptions({ disableBack: true });
             $state.go("app.home");
         } else {
           console.log('Reset canceled !');
         }
   });
 };
})

.controller('NewsCtrl', function($scope, News, $state){
    var storage = window.localStorage;
    var tournament = JSON.parse(storage.getItem("tournament")); 
    
    $scope.load = function(){
    
        News.getNewsPosts(tournament.tournaments_TournamentID).success(function(news){
            $scope.news = news;
        }).finally(function() {

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.load();
    
})

.controller('ActivitiesCtrl', function($scope, Activity, $state){
    var storage = window.localStorage;
    var tournament = JSON.parse(storage.getItem("tournament")); 
    
    $scope.load = function(){
        Activity.getActivities(tournament.tournaments_TournamentID).success(function(activities){
            $scope.activities = activities;
        }).finally(function() {

                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.load();
    
})
            
.controller('ReviewCtrl', function($scope, Activity, $state, Review, $ionicPopup){
     var storage = window.localStorage;
        var firstreview = storage.getItem("review");

        
    if(firstreview != null){
        $scope.disabled = true;
    }
    $scope.postNewReview = function(form){
           
            if(firstreview == null){
            Review.postNewReview(form.Grade, form.Comment).success(function(result){
                storage.setItem("review", "commit");
                var confirmPopup = $ionicPopup.alert({
                    title: 'Thanks',
                    template: 'we really appreciate your cooperation. Have fun at the tournament!'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        $state.go("app.review");
                    } else {
                        console.log('Reset canceled !');
                }
                });
            });
        }
    }
});