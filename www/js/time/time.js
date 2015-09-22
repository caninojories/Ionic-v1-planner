(function(){
  'use strict' ;

  angular
  .module('app.time')
  .controller('TimeCtrl', TimeCtrl) ;

  TimeCtrl.$inject = ['$scope', '$http'] ;

  function TimeCtrl($scope, $http){
      var vm = this ;
      $http.get('js/data/times.json').success(function(data) {
        console.log(data) ;
        $scope.timedata = data ;
      })
  }
}()) ;
