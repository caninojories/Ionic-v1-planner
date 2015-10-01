(function() {
  'use strict';

  angular
    .module('app.contacts')
    .controller('ContactsCtrl', ContactsCtrl);

  ContactsCtrl.$inject = ['$scope', '$rootScope', '$cordovaContacts', '$ionicModal'];

  function ContactsCtrl($scope, $rootScope, $cordovaContacts, $ionicModal) {
    var vm = this;

    vm.phoneContacts = [];
    vm.show_contact_modal = show_contact_modal;

    $rootScope.$on('add_location_controller_contacts_controller', function() {
      vm.contact_modal.hide();
    });

    $ionicModal.fromTemplateUrl('templates/add_contact.html', {
      vm: vm,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.contact_modal = modal;
    });

    function show_contact_modal () {
      vm.contact_modal.show();
    }
  }
}());
