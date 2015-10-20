(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('AddContacts', AddContacts);

  AddContacts.$inject = ['$rootScope', '$scope', '$timeout', '$cordovaContacts', '$ionicPopover', '$ionicModal'];

  function AddContacts($rootScope, $scope, $timeout, $cordovaContacts, $ionicPopover, $ionicModal) {
    var vm = this;

    // vm.add_contact  = add_contact;
    vm.add_participant = add_participant;
    vm.show_add_location_modal = show_add_location_modal;

    $scope.$on('search_contacts_widget_add_controller', function(event, data) {
      console.log(data);
      $timeout(function() {
        vm.contacts = data;
      }, 10);
    });

    $ionicModal.fromTemplateUrl('templates/popover_add_location.html', {
      vm: vm,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.add_location_modal = modal;
    });

    function show_add_location_modal() {
      vm.add_location_modal.show();
    }

    function add_participant(participant) {
      $rootScope.$broadcast('add_controller_timezone_controller', participant);
    }
  }
}());
