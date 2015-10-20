(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('TimezoneCtrl', TimezoneCtrl);

    TimezoneCtrl.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$cordovaContacts', '$ionicPopover', '$ionicModal', 'TimezoneDataService'];

    function TimezoneCtrl($rootScope, $scope, $state, $timeout, $cordovaContacts, $ionicPopover, $ionicModal, timezoneDataService) {
      var vm = this;

      vm.participants     = [];

      vm.add_zone                         = add_zone;
      vm.add_partcipants                  = add_partcipants;
      vm.detailed_view                    = detailed_view;
      vm.on_hold                          = on_hold;
      vm.open_participants_modal          = open_participants_modal;
      vm.open_my_location_modal           = open_my_location_modal;
      vm.open_participant_location_modal  = open_participant_location_modal;

      $scope.$on('add_location_controller_timezone_controller_for_my_location', function(event, zone) {
        vm.my_timezone = zone;
        vm.my_location_modal.hide();
      });

      $scope.$on('add_location_controller_timezone_controller_for_participant', function(event, zone) {
        vm.participants[vm.participant_index].address = zone;
        vm.participant_location_modal.hide();
      });

      $scope.$on('add_controller_timezone_controller', function(event, participant) {
        vm.participants_modal.hide();
        vm.participants[vm.participant_index].display_name = participant.display_name;
        vm.participants[vm.participant_index].emails       = participant.emails[0].value;
        vm.participants[vm.participant_index].photos       = participant.photos;
      });

      $scope.$on('add_controller_timezone_controller_cancel', function(){
        vm.participants_modal.hide();
      })

      $scope.$on('add_location_controller_timezone_controller_cancel', function(){
        vm.participant_location_modal.hide();
        vm.my_location_modal.hide();
      })

      function add_partcipants() {
        vm.participants.push({display_name: '', address: '', emails: '', photos: ''});
      }

      function add_zone(zone) {
        vm.zone = zone;

        $scope.popover.remove();
        $ionicModal.fromTemplateUrl('templates/popover_search.html', {
          vm: vm,
          animation: 'slide-in-up'
        }).then(function(popover) {
          vm.my_location_modal = popover;
        });
      }

      function detailed_view() {
        timezoneDataService.title =  vm.title;
        timezoneDataService.myLocation = vm.my_timezone;
        timezoneDataService.participants = vm.participants;
      }

      $ionicModal.fromTemplateUrl('templates/modal_add_participant.html', {
        vm: vm,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.participants_modal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal_my_location.html', {
        vm: vm,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.my_location_modal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal_participant_location.html', {
        vm: vm,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.participant_location_modal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal_add_location.html', {
        vm: vm,
        animation: 'slide-in-up'
      }).then(function(modal) {
        vm.participant_location_modal = modal;
      });

      function open_participants_modal($event, $index) {
        vm.participant_index = $index;
        vm.participants_modal.show($event);
      }

      $scope.moveItem = function(item, itemFromIndex, itemToIndex) {
        vm.zone_list.splice(itemFromIndex, 1);
        vm.zone_list.splice(itemToIndex, 0, item);
      };

      $scope.onItemDelete = function(item) {
        vm.zone_list.splice(vm.zone_list.indexOf(item), 1);
        $rootScope.data_object.push(item);
      };

      function on_hold(zone) {
        vm.showReorder = !vm.showReorder;
      }

      $ionicPopover.fromTemplateUrl('templates/popover_search.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      function open_my_location_modal($event) {
        vm.my_location_modal.show($event);
      }

      function open_participant_location_modal($event, $index) {
        vm.participant_index = $index;
        vm.participant_location_modal.show($event);
      }

      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });
    }
}());
