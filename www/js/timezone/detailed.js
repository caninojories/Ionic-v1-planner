(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('DetailedCtrl', DetailedCtrl);

    DetailedCtrl.$inject = ['$rootScope', '$scope'];

    function DetailedCtrl($rootScope, $scope) {
      var vm = this;

      vm.times          = times;
      vm.zone_list      = [];
      vm.zone_time      = [];
      var date          = moment($rootScope.datepickerObject.inputDate);

      /*make every item an object*/
      object_literal();

      function object_literal() {
        date.tz($rootScope.zone_list[0]);
        for (var i = 0; i < $rootScope.zone_list.length; i++) {
          vm.zone_list.push({name: $rootScope.zone_list[i], data: []});
        }
      }

      function times(zone, index) {
        if (index === 0) {
          for (var i = 0; i < 24; i++) {
            date.hour(i);
            date.minutes(0);
            zone.data.push(date.format('HH:mm'));
          }
        } else {
          for (var j = 0; j < 24; j++) {
            /*set the new time zone*/
            date.hour(j);
            date.minutes(0);
            // date = date.format('YYYY-MM-DD-HH-mm');
            var new_date = moment(date);
            var secondary_date  = new_date.tz(zone.name).format('ha z');
            zone.data.push(secondary_date);
          }
        }
      }
    }
}());
