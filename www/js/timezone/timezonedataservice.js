(function(){
  'use strict';
  angular
    .module('app.timezone')
    .service('TimezoneDataService', TimezoneDataService);

  function TimezoneDataService(){
    var vm = this;
    vm.title;
    vm.bookmark_flag = null;
    vm.myLocation;
    vm.participants;
    vm.eventId;
    vm.revId;
  }
}())
