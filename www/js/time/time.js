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

      // Helper function to create design docs to be used in queries
      // Takes the name of the design doc and the function containing the emit() method
      function createDesignDoc(name, mapFunction) {
        var ddoc = {
          _id: '_design/' + name,
          views: {}
        };
        ddoc.views[name] = { map: mapFunction.toString() };
        return ddoc;
      }

  }
}()) ;
