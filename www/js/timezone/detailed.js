(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('DetailedCtrl', DetailedCtrl);

    DetailedCtrl.$inject = ['$rootScope', '$scope', '$state', '$window', '$ionicHistory', '$cordovaFile', '$cordovaEmailComposer', 'PlannerService', 'TimezoneDataService', '$q'];

    function DetailedCtrl($rootScope, $scope, $state, $window, $ionicHistory, $cordovaFile, $cordovaEmailComposer, PlannerService, timezoneDataService, $q) {
      var vm = this;

      vm.choose_time        = choose_time;
      vm.previous_index     = null;
      vm.save_events        = save_events;
      vm.times              = times;
      vm.zone_list          = [];
      vm.zone_time          = [];
      vm.zone_time_counter  = 0;
      var date              = moment($rootScope.datepickerObject.inputDate);
      var UPCOMMING         = "Upcoming" ;
      var PASSED            = "Passed" ;
      var attachmentPath    = null;
      var appointmentFileName = 'appointment.ics' ;
      vm.selectedItemIndex  = 0;

      $scope.$on('$ionicView.enter', function(){
        if(ionic.Platform.isAndroid()){
          attachmentPath = cordova.file.externalCacheDirectory ;
        } else if (ionic.Platform.isIOS()) {
          attachmentPath = cordova.file.cacheDirectory;
        }
      })

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
        var appointmentFile = [] ;

        $cordovaFile.checkFile(attachmentPath, appointmentFileName)
        .then(function (success) {
          appointmentFile.push(attachmentPath + appointmentFileName);
        }, function (error) {
          console.log("detailed.js, error on checking up file") ;
        });
        var email = {
          to: contacts,
          cc: '',
          bcc: [],
          attachments: [attachmentPath + appointmentFileName],
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
      // receive data from timezoneDataService
      function object_literal(){
        date.tz(timezoneDataService.myLocation);
        vm.zone_list.push({name: timezoneDataService.myLocation, data: {item:[]}});
        for( var i = 0; i < timezoneDataService.participants.length; i++) {
          if (timezoneDataService.participants[i].address) {
            vm.zone_list.push({name : timezoneDataService.participants[i].address, data : {item:[]} });
          }
        }
      }

      function choose_time(index) {
        console.log("time chosen!" + index);
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
        var objToStore = buildObjectToStore() ;

        $q.when(buildObjectToStore()).then(function(objToStore){
            saveToDB(objToStore);
            participantMailerHelper(objToStore) ;
            // $cordovaFile.checkFile(cordova.file.cacheDirectory, "appointment.ics").then(function(success){console.log(console.log("cordova directory: file found"))}, function(error){console.log("cordova directory: file not found")})

        }).then(function(){
          goToHomeScreen();
        })
      }

      function buildObjectToStore() {
        var objToStore = {} ;
        objToStore.bookmark_flag = timezoneDataService.bookmark_flag === null ? false : true;
        objToStore.participants = [] ;
        objToStore.myLocale = vm.zone_list[0].name ;
        objToStore.myTime = vm.zone_list[0].data.item[vm.selectedItemIndex].time ;
        objToStore.myLocaleDate = vm.zone_list[0].data.item[vm.selectedItemIndex].cal ;
        objToStore.title = timezoneDataService.title ;
        objToStore.created_date= new Date() ;

        for (var i = 0; i < vm.zone_list.length -1 ; i++) {
          var participant = {} ;
          participant.participantname = timezoneDataService.participants[i].display_name;
          participant.participantemail = timezoneDataService.participants[i].emails;
          participant.participantPhoto = timezoneDataService.participants[i].photos;
          participant.localename = vm.zone_list[i+1].name ;
          participant.localetime = vm.zone_list[i+1].data.item[vm.selectedItemIndex].time ;
          participant.localedate = vm.zone_list[i+1].data.item[vm.selectedItemIndex].cal ;
          objToStore.participants[i] = participant;
        }

        return objToStore;
      }

      function saveToDB(objToStore){
        if (timezoneDataService.eventId){
          objToStore._id = timezoneDataService.eventId;
          objToStore._rev = timezoneDataService.revId;
          PlannerService.updateItem(objToStore)
        } else {
          PlannerService.addItem(objToStore);
        }
      }

      function participantMailerHelper(objToStore){
        var participants = objToStore.participants;
        if(participants.length !=0){
          icsSetup(objToStore.myLocaleDate, objToStore.myTime, objToStore.myLocale);
          send_email(participants);
        }
      }

      function goToHomeScreen(){
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go('time');
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
        // var filePath = cordova.file.cacheDirectory ;// ? cordova.file.externalRootDirectory : cordova.file.dataDirectory;
          $cordovaFile.writeFile(attachmentPath, appointmentFileName, ical.join('\n'), true)
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
