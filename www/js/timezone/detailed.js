(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('DetailedCtrl', DetailedCtrl);

    DetailedCtrl.$inject = ['$rootScope', '$scope'];

    function DetailedCtrl($rootScope, $scope) {
      var vm = this;

      vm.choose_time        = choose_time;
      vm.previous_index     = null;
      vm.times              = times;
      vm.zone_list          = [];
      vm.zone_time          = [];
      vm.zone_time_counter  = 0;
      var date              = moment($rootScope.datepickerObject.inputDate);

      /*make every item an object*/
      object_literal();

      function object_literal() {
        date.tz($rootScope.zone_list[0]);
        for (var i = 0; i < $rootScope.zone_list.length; i++) {
          vm.zone_list.push({name: $rootScope.zone_list[i], data: {item: []}});
        }
      }

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

      function times(zone, index) {
        if (index === 0) {
          for (var i = 0; i < 24; i++) {
            date.hour(i);
            date.minutes(0);
            zone.data.item.push({time: date.format('HH:mm'), class: false});
          }
        } else {
          for (var j = 0; j < 24; j++) {
            /*set the new time zone*/
            date.hour(j);
            date.minutes(0);
            // date = date.format('YYYY-MM-DD-HH-mm');
            var new_date = moment(date);
            var secondary_date  = new_date.tz(zone.name).format('ha z');
            zone.data.item.push({time: secondary_date, class: false});
          }
        }
      }
    }
}());
