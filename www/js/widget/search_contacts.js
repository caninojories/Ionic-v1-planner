(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('searchContacts', searchContacts);

    searchContacts.$inject = ['$rootScope', '$timeout', '$cordovaContacts'];

    function searchContacts($rootScope, $timeout, $cordovaContacts) {
      var directive = {
        restrict: 'A',
        link    : link
      };

      return directive;

      function link(scope, element, attrs) {
        var isIPad,
            isIOS,
            isAndroid,
            isWindowsPhone;

        ionic.Platform.ready(function(){
          isIPad = ionic.Platform.isIPad();
          isIOS = ionic.Platform.isIOS();
          isAndroid = ionic.Platform.isAndroid();
          isWindowsPhone = ionic.Platform.isWindowsPhone();
        });

        element.on('input', function() {
          console.log(element.val());
          if (element.val() === '') {
            scope.phoneContacts = [];
            scope.$emit('search_contacts_widget_add_controller', scope.phoneContacts);
          }
          if (isIPad || isIOS || isAndroid || isWindowsPhone) {
            getContacts();
          }
        });

        function getContacts() {
          scope.phoneContacts = [];

          function onSuccess(contacts) {
            for (var i = 0; i < contacts.length; i++) {
              var contact = contacts[i];
              scope.phoneContacts.push({displayName: contact.displayName, photos: contact.photos});
            }

            scope.$emit('search_contacts_widget_add_controller', scope.phoneContacts);
          }

          function onError(contactError) {
            alert(contactError);
          }

          var opts = {
            filter : element.val(),
            multiple: true,
          };

          $cordovaContacts.find(opts).then(onSuccess, onError);
        }
      }
    }

}());
