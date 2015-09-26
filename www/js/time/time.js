(function(){
  'use strict' ;

  angular
  .module('app.time')
  .controller('TimeCtrl', TimeCtrl) ;

  TimeCtrl.$inject = ['$rootScope', '$scope', '$http', '$state', '$timeout', 'PlannerService'] ;

  function TimeCtrl($rootScope, $scope, $http, $state, $timeout, PlannerService) {
      // Initialize DB
      PlannerService.initDB() ;
      // Create design doc for key
      var vm = this ;
      // createDesignDoc("by_urgency", function (doc) {emit(doc.timearray[0].localedate, doc);}) ;

      // $http.get('js/data/times.json').success(function(data) {
      //   $scope.timedata = data ;
      //   $scope.timecard = $state.params.timeId ;
      // });

      PlannerService.getAllEvents().then(function(eventslist){
        if (eventslist){
          console.log(eventslist) ;
          $scope.timedata = eventslist ;
          $scope.timecard = $state.params.timeId ;
        }
      }) ;

      $scope.displayDetail = function(id) {
        $state.go('tabs.timedetail', {timeId: id});
      };

  }
}()) ;
