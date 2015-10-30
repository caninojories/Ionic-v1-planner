(function(){
  'use strict' ;

  angular
  .module('app.time')
  .controller('TimeCtrl', TimeCtrl) ;

  TimeCtrl.$inject = ['$rootScope', '$scope', '$http', '$state', '$timeout', '$cordovaFile', 'PlannerService'] ;

  function TimeCtrl($rootScope, $scope, $http, $state, $timeout, $cordovaFile, PlannerService) {
      // Initialize DB
      PlannerService.initDB() ;
      var vm = this ;

      vm.timedata = [];
      vm.timecard = null;

      vm.loadData = loadData ;
      vm.displayDetail = displayDetail ;
      vm.deleteItem = deleteItem ;

      function loadData() {
        PlannerService.getAllEvents().then(function(eventslist){
          if (eventslist){
            vm.timedata = eventslist ;
            vm.timecard = $state.params.timeId ;
          }
        }) ;
      }

      function displayDetail(id) {
        // id, myLocale, myLocaleDate, myTime,participants, title
        $state.go('tabs.timezone', {
          timeId: id
        });
      }

      function deleteItem(item) {
        PlannerService.deleteItem(item);
        loadData();
      }
      vm.loadData() ;
  }
}()) ;
