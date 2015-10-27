(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('DetailedCtrl', DetailedCtrl);

    DetailedCtrl.$inject = ['$rootScope', '$scope', '$state', '$window', '$ionicHistory', '$cordovaFile', '$cordovaEmailComposer', 'PlannerService', 'TimezoneDataService'];

    function DetailedCtrl($rootScope, $scope, $state, $window, $ionicHistory, $cordovaFile, $cordovaEmailComposer, PlannerService, timezoneDataService) {
      var vm = this;

      vm.choose_time        = choose_time;
      vm.previous_index     = null;
      vm.save_events        = save_events;
      vm.times              = times;
      vm.zone_list          = [];
      vm.zone_time          = [];
      vm.zone_time_counter  = 0;
      var date              = moment($rootScope.datepickerObject.inputDate);
      var UPCOMMING         = "Upcomming" ;
      var PASSED            = "Passed" ;

      // document.addEventListener('deviceready', function() {
      //   vm.cordovaFile = $cordovaFile;
      // });

      // $cordovaEmailComposer.isAvailable().then(function() {
      //   console.log('available');
      // }, function () {
      //   console.log('not available');
      // });

      function send_email(participants) {
        var contacts = [];
        /*get the participants*/
        participants.forEach(function(participant) {
          contacts.push(participant.participantemail);
        });

        var email = {
          to: contacts,
          cc: '',
          bcc: [],
          attachments: [
            cordova.file.externalRootDirectory + 'appointment.ics'
          ],
          subject: '',
          body: '',
          isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function (data) {
          console.log(data);
        });
      }

      /*make every item an object*/
      object_literal();
      console.log(timezoneDataService.title);
      // receive data from timezoneDataService
      function object_literal(){
        date.tz(timezoneDataService.myLocation);
        vm.zone_list.push({name: timezoneDataService.myLocation, data: {item:[]}});
        for( var i = 0; i < timezoneDataService.participants.length; i++) {
          vm.zone_list.push({name : timezoneDataService.participants[i].address, data : {item:[]} });
        }
      }



      // function object_literal() {
      //   date.tz($rootScope.zone_list[0]);
      //   for (var i = 0; i < $rootScope.zone_list.length; i++) {
      //     vm.zone_list.push({name: $rootScope.zone_list[i], data: {item: []}});
      //   }
      // }

      function choose_time(time, item, index) {
        /*check if we have previous click items*/
        if (vm.zone_time_counter === 0) {
          for (var i = 0; i < vm.zone_list.length; i++) {
            vm.zone_list[i].data.item[index].class = true;
          }
          vm.zone_time_counter++;
          /*save the previous index*/
          vm.previous_index  = index;
        } else {
          for (var j = 0; j < vm.zone_list.length; j++) {
            vm.zone_list[j].data.item[vm.previous_index].class = false;
          }

          for (var z = 0; z < vm.zone_list.length; z++) {
            vm.zone_list[z].data.item[index].class = true;
          }

          vm.previous_index  = index;
        }
      }

      function save_events() {
        var objToStore = {} ;
        // objToStore.timeArray = [] ;
        objToStore.participants = [] ;
        objToStore.myLocale = vm.zone_list[0].name ;
        objToStore.myTime = vm.zone_list[0].data.item[vm.previous_index].time ;
        objToStore.myLocaleDate = vm.zone_list[0].data.item[vm.previous_index].cal ;
        objToStore.title = timezoneDataService.title ;
        objToStore.date= date ;

        for (var i = 0; i < vm.zone_list.length -1 ; i++) {
          var participant = {} ;
          console.log(timezoneDataService.participants[1]);
          participant.participantname = timezoneDataService.participants[i].display_name;
          // participant.participantlocation= timezoneDataService.participants[i].address;
          participant.participantemail = timezoneDataService.participants[i].emails;
          // participant.participantPhotots here
          participant.localename = vm.zone_list[i+1].name ;
          participant.localetime = vm.zone_list[i+1].data.item[vm.previous_index].time ;
          participant.localedate = vm.zone_list[i+1].data.item[vm.previous_index].cal ;
          objToStore.participants[i] = participant;
        }

        var defaultUTCDate = moment.utc(date) ;

        if (defaultUTCDate > moment.utc()){
          objToStore.urgency = UPCOMMING ;
        } else {
          objToStore.urgency = PASSED ;
        }

        // PlannerService.addItem(objToStore);

        /*attachement email*/
        var participants = objToStore.participants;
        icsSetup(objToStore.myLocaleDate, objToStore.myTime, objToStore.myLocale);
        send_email(participants);

        // $ionicHistory.nextViewOptions({
        //   disableAnimate: true,
        //   disableBack: true
        // });
        // $state.go('tabs.time');
      }

      function times(zone, index) {
        if (index === 0) {
          for (var i = 0; i < 24; i++) {
            date.hour(i);
            date.minutes(0);
            zone.data.item.push({time: date.format('HH:mm'), class: false, cal: date.format("YYYY-MM-DD")});
          }
        } else {
          for (var j = 0; j < 24; j++) {
            /*set the new time zone*/
            date.hour(j);
            date.minutes(0);
            // date = date.format('YYYY-MM-DD-HH-mm');
            var new_date = moment(date);
            var secondary_date  = new_date.tz(zone.name).format('ha z');
            var time_date =  new_date.tz(zone.name).format("YYYY-MM-DD");
            zone.data.item.push({time: secondary_date, class: false, cal : time_date });
          }
        }
      }

      function icsSetup(date, time, locale) {
        var cal = ics();
        var start = moment(new Date(date + ' ' + time)).tz(locale).format('YYYYMMDD');

        var startTime = time.split(':')[0];
            startTime = parseInt(startTime);
        var endTime   = time.split(':')[0];
            endTime   = parseInt(endTime);

        cal.addEvent('subject', 'description', '', moment(), moment());
        var ical = cal.download('filename').split('\n');

        ical[5] = 'DTSTART;TZID=' + locale + ':'+ start + 'T' + n(startTime) + '0000';
        ical[6] = 'DTEND;TZID=' + locale + ':' + start + 'T' + n(startTime) + '0000';

        // document.addEventListener('deviceready', function() {
          $cordovaFile.writeFile(cordova.file.externalRootDirectory, 'appointment.ics', ical.join('\n'), true)
          .then(function (success) {
            console.log(success);
          }, function (error) {
            console.log(error);
          });
        // });
      }

      function n(num){
        return num > 9 ? "" + num: "0" + num;
      }
    }
}());
