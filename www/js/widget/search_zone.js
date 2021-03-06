(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('onSearch', onSearch);

    onSearch.$inject = ['$rootScope', '$timeout'];

    function onSearch($rootScope, $timeout) {
      var directive = {
        restrict: 'A',
        scope   : {},
        link    : link
      };

      $rootScope.data_object = moment.tz.names();

      return directive;

      function link(scope, element, attrs) {
        // scope.$on('timezoneControllerIntoSearchZoneWidget', function(event, data) {
        //   $timeout(function() {
        //     console.log(element);
        //     element[0].focus();
        //   }, 750);
        // });

        scope.$on('addLocationControllerIntoSearchZoneWidget', function() {
          console.log('location');
          element.val('');
        });

        var substringMatcher = function(q, strs) {
          var matches, substringRegex;

          matches = [];

          var substrRegex = new RegExp(q, 'i');

          $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
              if (matches.length === 10) {
                return matches;
              }

              matches.push(str);
            }
          });

          return matches;
        };

        element.on('input', function() {
            if (element.val() === '') {
              $timeout(function() {
                $rootScope.data = [];
              }, 0);
            } else {
              var dataObject = substringMatcher(element.val(), $rootScope.data_object);
              $timeout(function() {
                $rootScope.data = dataObject;
              }, 0);
              // scope.$emit('search_zone_widget_timezone_controller', dataObject);
              scope.$emit('search_zone_widget_add_location_controller', dataObject);
            }
        });
      }
    }

}());
