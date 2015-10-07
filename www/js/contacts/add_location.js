(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('AddLocation', AddLocation);

  AddLocation.$inject = ['$rootScope', '$scope', '$cordovaContacts', '$ionicPopover'];

  function AddLocation($rootScope, $scope, $cordovaContacts, $ionicPopover) {
    var vm = this;

    vm.add_location             = add_location;
    vm.add_participant_location = add_participant_location;

    $scope.$on('search_zone_widget_add_location_controller', function(event, zone) {
      vm.zone = zone;
    });

    function add_location(zone) {
      $rootScope.$broadcast('add_location_controller_timezone_controller_for_my_location', zone);
    }

    function add_participant_location(zone) {
      $rootScope.$broadcast('add_location_controller_timezone_controller_for_participant', zone);
    }
  }
}());
