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
