angular.module('starter.services', [])

.factory('Match', function($http) {
    return{
        getMatchesForSpecificDay : function(fkDayID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/matches/day/' + fkDayID);  
        },
        getMatchesPerGroupPerDay : function(fkGroupID, fkDayID) {
            return $http.get('https://buto-back-end.herokuapp.com/mobile/matches/group/'+ fkGroupID + '/day/' + fkDayID);
        },
        getSpecificMatch : function(MatchID) {
            return $http.get('https://buto-back-end.herokuapp.com/mobile/matches/' + MatchID);
        }
    };
})

.factory('Tournament', function($http) {
    return{
        getCurrentTournament : function(Year){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/tournaments/startdate/' + Year)
        }
    }
})

.factory('Level', function($http) {
    return{
        getAllLevels : function(){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/levels');
        }
    }
})

.factory('Group', function($http) {
    return{
        getGroupPerLevelPerDay : function(fkLevelID, fkDayID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/group/level/' + fkLevelID + '/day/' + fkDayID);
        },
        getGroupHasParticipantsPerLevel : function(fkLevelID, fkDayID ){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/level/' + fkLevelID + '/day/' + fkDayID);   
        }
    }
})

.factory('Participant', function($http) {
    return{
        gerParticipantsWithEndDate : function(EndDate){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/participant/enddate/' + EndDate);  
        },
        getParticipantPerGroupPerDay : function(fkGroupID, fkDayID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/participant/group/' + fkGroupID + '/day/' + fkDayID);
        },
        getParticipantPerTournament : function(fkTournamentID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/participant/tournament/' +fkTournamentID);
        },
        getParticipant : function(ParticipantID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/participant/' + ParticipantID);
        }
    }
})

.factory('Day', function($http){
   return{
       getCurrentDay : function(date){
           return $http.get('https://buto-back-end.herokuapp.com/mobile/day/' + date);                        
       }
   } 
})

.factory('News', function($http){
    return{
        getNewsPosts : function(fkTournamentID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/tournament/'+fkTournamentID+'/news');
        }
    } 
})

.factory('Activity', function($http){
    return{
        getActivities : function(fkTournamentID){
            return $http.get('https://buto-back-end.herokuapp.com/mobile/tournament/'+fkTournamentID+'/activities');
        }
    } 
});