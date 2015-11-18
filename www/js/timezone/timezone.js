(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('TimezoneCtrl', TimezoneCtrl);

    TimezoneCtrl.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$cordovaContacts', '$cordovaEmailComposer', '$ionicPopover', '$ionicScrollDelegate', '$ionicModal', 'TimezoneDataService', 'PlannerService'];

    function TimezoneCtrl($rootScope, $scope, $state, $timeout, $stateParams, $cordovaContacts, $cordovaEmailComposer, $ionicPopover, $ionicScrollDelegate, $ionicModal, timezoneDataService, PlannerService) {
      var vm = this;

      vm.participants                     = [];
      vm.rev_id;

      vm.add_partcipants                  = add_partcipants;
      vm.detailed_view                    = detailed_view;
      vm.on_hold                          = on_hold;
      vm.open_participants_modal          = open_participants_modal;
      vm.open_my_location_modal           = open_my_location_modal;
      vm.open_participant_location_modal  = open_participant_location_modal;

      $scope.$on('$ionicView.loaded', function(){
        if($stateParams.timeId){
          PlannerService.getItem($stateParams.timeId).then(function(event){
            vm.title = event.title;
            vm.rev_id = event._rev;
            vm.my_timezone = event.myLocale;
            $rootScope.datepickerObject.inputDate = event.myLocaleDate;
            if(event.participants){
              event.participants.forEach(function(participant){
                populateParticipantList(
                  participant.participantname,
                  participant.localename,
                  participant.participantemail,
                  participant.photo)
              })
            }
          });
        }
      });

      // vm.send_email   = send_email;
      //
      // $cordovaEmailComposer.isAvailable().then(function() {
      //   console.log('available');
      // }, function () {
      //   console.log('not available');
      // });
      //
      // function send_email() {
      //   var contacts = [];
      //   /*get the participants*/
      //   vm.participants.forEach(function(participant) {
      //     contacts.push(participant.emails);
      //   });
      //
      //   var email = {
      //     to: contacts,
      //     cc: '',
      //     bcc: [],
      //     attachments: [
      //       cordova.file.externalRootDirectory + 'new_file1.ics'
      //     ],
      //     subject: '',
      //     body: '',
      //     isHtml: true
      //   };
      //
      //   $cordovaEmailComposer.open(email).then(null, function (data) {
      //     console.log(data);
      //   });
      // }


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
        vm.participants[vm.participant_index].emails       = participant.emails.length > 0 ?  participant.emails[0].value : null ;
        vm.participants[vm.participant_index].photos       = participant.hasOwnProperty(photos) ?  participant.photos[0].value : null ;
        // window.plugins.toast.showLongBottom(vm.participants[vm.participant_index].photos) ;
      });

      $scope.$on('add_controller_timezone_controller_cancel', function(){
        vm.participants_modal.hide();
      });

      $scope.$on('add_location_controller_timezone_controller_cancel', function(){
        vm.participant_location_modal.hide();
        vm.my_location_modal.hide();
      });

      function add_partcipants() {
        vm.participants.push({display_name: '', address: '', emails: '', photos: ''});
        $ionicScrollDelegate.scrollBottom();
      }

      function populateParticipantList(name, addr, email, photo){
          vm.participants.push({
            display_name: name?name:'',
            address: addr?addr:'',
            emails: email?email:'',
            photos: photo?photo:''
          });
      }

      // function add_zone(zone) {
      //   vm.zone = zone;
      //
      //   $scope.popover.remove();
      //   $ionicModal.fromTemplateUrl('templates/popover_search.html', {
      //     vm: vm,
      //     animation: 'slide-in-up'
      //   }).then(function(popover) {
      //     vm.my_location_modal = popover;
      //   });
      // }

      function detailed_view() {
        timezoneDataService.title =  vm.title;
        timezoneDataService.myLocation = vm.my_timezone;
        timezoneDataService.participants = vm.participants;
        if ($stateParams.timeId){
          timezoneDataService.eventId = $stateParams.timeId;
          timezoneDataService.revId = vm.rev_id;
        }
      }

      $ionicModal.fromTemplateUrl('templates/modal_add_participant.html', {
        vm: vm,
        animation: 'slide-in-up',
        focusFirstInput: true,
      }).then(function(modal) {
        vm.participants_modal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal_my_location.html', {
        vm: vm,
        animation: 'slide-in-up',
        focusFirstInput: true,
      }).then(function(modal) {
        vm.my_location_modal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal_participant_location.html', {
        vm: vm,
        animation: 'slide-in-up',
        focusFirstInput: true,
      }).then(function(modal) {
        vm.participant_location_modal = modal;
      });

      $ionicModal.fromTemplateUrl('templates/modal_add_location.html', {
        vm: vm,
        animation: 'slide-in-up',
        focusFirstInput: true,
      }).then(function(modal) {
        vm.participant_location_modal = modal;
      });

      function open_participants_modal($event, $index) {
        vm.participant_index = $index;
        vm.participants_modal.show($event);
      }

      $scope.moveItem = function(item, itemFromIndex, itemToIndex) {
        vm.participants.splice(itemFromIndex, 1);
        vm.participants.splice(itemToIndex, 0, item);
      };

      $scope.onItemDelete = function(item) {
        vm.participants.splice(vm.participants.indexOf(item), 1);
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
    }
}());
