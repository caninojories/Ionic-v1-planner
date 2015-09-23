(function() {
  'use strict';

  angular
    .module('app.timezone')
    .controller('TimezoneCtrl', TimezoneCtrl);

    TimezoneCtrl.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$ionicPopover'];

    function TimezoneCtrl($rootScope, $scope, $state, $timeout, $ionicPopover) {
      var vm = this;

      vm.add_zone       = add_zone;
      vm.detailed_view  = detailed_view;
      vm.on_hold        = on_hold;
      vm.zone_list      = [];

      function add_zone(zone) {
        vm.zone_list.push(zone);
        $rootScope.data = '';

        $scope.popover.remove();
        $ionicPopover.fromTemplateUrl('templates/popover_search.html', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
        });
      }

      function detailed_view() {
        $rootScope.zone_list = vm.zone_list;
        $rootScope.title     = vm.title;
      }

      $scope.moveItem = function(item, itemFromIndex, itemToIndex) {
        vm.zone_list.splice(itemFromIndex, 1);
        vm.zone_list.splice(itemToIndex, 0, item);
      };

      $scope.onItemDelete = function(item) {
        vm.zone_list.splice(vm.zone_list.indexOf(item), 1);
      };

      function on_hold(zone) {
        console.log(zone);
        vm.showReorder = !vm.showReorder;
      }

      $ionicPopover.fromTemplateUrl('templates/popover_search.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
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
