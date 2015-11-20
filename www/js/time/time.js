(function(){
  'use strict' ;

  angular
  .module('app.time')
  .controller('TimeCtrl', TimeCtrl) ;

  TimeCtrl.$inject = ['$rootScope', '$scope', '$http', '$state', '$timeout', '$cordovaFile', 'PlannerService'] ;

  function TimeCtrl($rootScope, $scope, $http, $state, $timeout, $cordovaFile, PlannerService) {
      var vm = this ;

      vm.timedata = [];
      vm.timecard = null;
      vm.todayDate = null;

      vm.loadData = loadData ;
      vm.displayDetail = displayDetail ;
      vm.deleteItem = deleteItem ;
      vm.bookmarkItem = bookmarkItem ;

      $scope.$on("$ionicView.loaded", function(){
        // Initialize DB
        PlannerService.initDB() ;
        vm.loadData() ;
      })

      $scope.$on("$ionicView.enter", function(){
        vm.todayDate = new Date();
      })

      function loadData() {
        PlannerService.getAllEvents().then(function(eventslist){
          if (eventslist.length != 0){
            $rootScope.noEventsFlag = false;
            vm.timedata = eventslist ;
            vm.timecard = $state.params.timeId ;
          } else {
            $rootScope.noEventsFlag = true;
            vm.displayDetail(null) ;
          }
        }) ;
      }

      function displayDetail(id) {
        $state.go('timezone', {
          timeId: id
        });
      }

      function deleteItem(item) {
        PlannerService.deleteItem(item);
        loadData();
      }

      function bookmarkItem(item) {
        item.bookmark_flag = !item.bookmark_flag ;
        PlannerService.updateItem(item) ;
        loadData();
      }
  }
}()) ;
