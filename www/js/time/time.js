(function(){
  'use strict' ;

  angular
  .module('app.time')
  .controller('TimeCtrl', TimeCtrl) ;

  TimeCtrl.$inject = ['$rootScope', '$scope', '$http', '$state', '$timeout', 'PlannerService'] ;

  function TimeCtrl($rootScope, $scope, $http, $state, $timeout, PlannerService) {
      // Initialize DB
      PlannerService.initDB() ;
      var vm = this ;

      vm.timedata = [];
      vm.timecard ;

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
        $state.go('tabs.timedetail', {timeId: id});
      }

      function deleteItem(item) {
        PlannerService.deleteItem(item);
        loadData();
      }
      vm.loadData() ;
  }
}()) ;
