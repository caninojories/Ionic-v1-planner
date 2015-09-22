(function(){
  'use strict' ;

  angular
  .module('app.time')
  .controller('TimeCtrl', TimeCtrl) ;

  TimeCtrl.$inject = ['$scope', '$http', '$state'] ;

  function TimeCtrl($scope, $http, $state){
      var vm = this ;
      $http.get('js/data/times.json').success(function(data) {
        $scope.timedata = data ;
        $scope.timecard = $state.params.timeId ;
      })
      $scope.displayDetail = function(id) {
        $state.go('tabs.timedetail', {timeId: id});
      }
  }
}()) ;
