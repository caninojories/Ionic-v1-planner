(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('AddLocation', AddLocation);

  AddLocation.$inject = ['$rootScope', '$scope', '$cordovaContacts', '$ionicPopover'];

  function AddLocation($rootScope, $scope, $cordovaContacts, $ionicPopover) {
    var vm = this;

    vm.add_location = add_location;

    $scope.$on('search_zone_widget_add_location_controller', function(event, zone) {
      vm.zone = zone;
    });

    function add_location() {
      $rootScope.$broadcast('add_location_controller_add_controller');
      $rootScope.$broadcast('add_location_controller_contacts_controller');
    }
  }
}());
