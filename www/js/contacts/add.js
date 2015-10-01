(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('AddContacts', AddContacts);

  AddContacts.$inject = ['$rootScope', '$scope', '$cordovaContacts', '$ionicPopover', '$ionicModal'];

  function AddContacts($rootScope, $scope, $cordovaContacts, $ionicPopover, $ionicModal) {
    var vm = this;

    // vm.add_contact  = add_contact;
    vm.show_add_location_modal = show_add_location_modal;

    $scope.$on('search_contacts_widget_add_controller', function(event, data) {
      vm.contacts = data;
    });

    vm.contacts = ['jories'];

    $rootScope.$on('add_location_controller_add_controller', function() {
      vm.add_location_modal.hide();
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
  }
}());
