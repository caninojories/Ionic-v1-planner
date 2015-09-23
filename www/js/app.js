// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic-datepicker', 'app.timezone', 'app.widgets', 'app.time', 'app.plannerService'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tabs', {
    url         : '/tab',
    abstract    : true,
    templateUrl : 'templates/tabs.html'
  })
  .state('tabs.time', {
    url   : '/time',
    views : {
      'time-tab': {
        templateUrl: 'templates/time.html',
        controller: 'TimeCtrl as vm'
      }
    }
  })
  .state('tabs.timedetail', {
    url   : '/time/:timeId',
    views : {
      'time-tab': {
        templateUrl: 'templates/timedetail.html',
        controller: 'TimeCtrl as vm'
      }
    }
  })
  .state('tabs.timezone', {
    url   : '/time/timezone',
    views : {
      'time-tab': {
        templateUrl : 'templates/timezone.html',
        controller  : 'TimezoneCtrl as vm',
        resolve     : {
          init : function($rootScope) {
            $rootScope.datepickerObject = {
              titleLabel: 'Select',  //Optional
              todayLabel: 'Today',  //Optional
              closeLabel: 'Close',  //Optional
              setLabel: 'Set',  //Optional
              setButtonType   : 'button-assertive',  //Optional
              todayButtonType : 'button-assertive',  //Optional
              closeButtonType : 'button-assertive',  //Optional
              inputDate: new Date(),    //Optional
              // mondayFirst: true,    //Optional
              // disabledDates: disabledDates, //Optional
              // weekDaysList: weekDaysList,   //Optional
              // monthList: monthList, //Optional
              // templateType: 'popup', //Optional
              modalHeaderColor: 'bar-assertive', //Optional
              modalFooterColor: 'bar-assertive', //Optional
              // from: new Date(2012, 8, 2),   //Optional
              // to: new Date(2018, 8, 25),    //Optional
              callback: function (val) {    //Mandatory
                $rootScope.datepickerObject.inputDate = new Date(val);
              }
            };
          }
        }
      }
    }
  })
  .state('tabs.detailed', {
    url   : '/timezone/detailed',
    views : {
      'time-tab': {
        templateUrl: 'templates/detailed.html',
        controller : 'DetailedCtrl as vm'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/time');
});
