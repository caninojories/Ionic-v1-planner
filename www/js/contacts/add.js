(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('AddContacts', AddContacts);

  AddContacts.$inject = ['$rootScope', '$scope', '$cordovaContacts', '$ionicPopover', '$ionicModal'];

  function AddContacts($rootScope, $scope, $cordovaContacts, $ionicPopover, $ionicModal) {
    var vm = this;

    // vm.add_contact  = add_contact;
    vm.add_participant = add_participant;
    vm.show_add_location_modal = show_add_location_modal;
    vm.hide_add_participant_modal = hide_add_participant_modal;

    $scope.$on('search_contacts_widget_add_controller', function(event, data) {
      vm.contacts = data;
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

    function hide_add_participant_modal(){
      console.log("elo") ;
      $rootScope.$broadcast('add_controller_timezone_controller_cancel');
    }

    function add_participant(participant) {
      $rootScope.$broadcast('add_controller_timezone_controller', participant);
    }
  }
}());
