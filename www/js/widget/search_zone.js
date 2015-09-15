(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('onSearch', onSearch);

    onSearch.$inject = ['$rootScope', '$timeout'];

    function onSearch($rootScope, $timeout) {
      var directive = {
        restrict: 'A',
        link    : link
      };

      return directive;

      function link(scope, element, attrs) {
        var substringMatcher = function(q, strs) {
          // return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            var substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
              if (substrRegex.test(str)) {
                if (matches.length === 10) {
                  return matches;
                }
                matches.push(str);
              }
            });

            return matches;
            // cb(matches);
          // };
        };
        var data = moment.tz.names();
        element.on('input', function() {
            if (element.val() === '') {
              $timeout(function() {
                $rootScope.data = [];
              }, 0);
            } else {
              var dataObject = substringMatcher(element.val(), data);
              $timeout(function() {
                $rootScope.data = dataObject;
              }, 0);
              scope.$broadcast('widget_search_zone_controller_typeahead', dataObject);
            }
        });
      }
    }

}());
