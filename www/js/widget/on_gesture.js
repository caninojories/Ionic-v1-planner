(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('onGesture', onGesture);

    onGesture.$inject = ['$ionicGesture'];

    function onGesture($ionicGesture) {
      var directive = {
        restrict: 'A',
        link    : link
      };

      return directive;

      function link(scope, element, attrs) {
        $ionicGesture.on('hold', function(e) {
          console.log(e);
          $ionicGesture.on('reorder', function(e) {
            console.log('reorder');
          }, element);
        }, element);
      }
    }
}());
