(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('focusMe', focusMe);

    focusMe.$inject = ['$timeout'];

    function focusMe($timeout) {
      var directive = {
        restrict: 'A',
        link    : link
      };

      return directive;

      function link(scope, element, attrs) {
        $timeout(function() {
          element[0].focus();
        }, 150);
      }
    }
}());
