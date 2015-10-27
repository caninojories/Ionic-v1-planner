(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('AddLocation', AddLocation);

  AddLocation.$inject = ['$rootScope', '$scope', '$timeout', '$cordovaContacts', '$ionicPopover'];

  function AddLocation($rootScope, $scope, $timeout, $cordovaContacts, $ionicPopover) {
    var vm = this;

    vm.add_location             = add_location;
    vm.add_participant_location = add_participant_location;
    vm.hide_add_location_modal  = hide_add_location_modal;

    $scope.$on('search_zone_widget_add_location_controller', function(event, zone) {
      $timeout(function () {
        vm.zone = zone;
      }, 10);
    });

    function add_location(zone) {
      $rootScope.$broadcast('add_location_controller_timezone_controller_for_my_location', zone);
      $rootScope.$broadcast('addLocationControllerIntoSearchZoneWidget');
      vm.zone = [];
    }

    function add_participant_location(zone) {
      $rootScope.$broadcast('add_location_controller_timezone_controller_for_participant', zone);
      $rootScope.$broadcast('addLocationControllerIntoSearchZoneWidget');
      vm.zone = [];
    }

    function hide_add_location_modal(){
      console.log("elo") ;
      $rootScope.$broadcast('add_location_controller_timezone_controller_cancel');
    }
  }
}());
