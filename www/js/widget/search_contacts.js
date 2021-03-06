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
        checkOfDevice();
        scope.$on('addContactsControllerIntoSearchZoneWidget', function() {
          element.val('');
        });

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
          checkOfDevice();
        });

        function checkOfDevice() {
          if (element.val() === '') {
            scope.phoneContacts = [];
            $rootScope.$broadcast('search_contacts_widget_add_controller', scope.phoneContacts);
          } else {
            if (isIPad || isIOS || isAndroid || isWindowsPhone) {
              getContacts();
            }
          }
        }

        function getContacts() {
          function onSuccess(contacts) {
            scope.phoneContacts = [];
            scope.phoneContacts_ios = [];
            for (var i = 0; i < contacts.length; i++) {
              if (i === 10) {return;}
              var contact = contacts[i];
              scope.phoneContacts.push({display_name: contact.name.formatted, photos: contact.photos, emails: contact.emails});

            }

            scope.$emit('search_contacts_widget_add_controller', scope.phoneContacts);
          }

          function onError(contactError) {
            alert(contactError);
          }

          var opts = {
            // filter  : element.val(),
            fields  : ['name.formatted'],
            multiple: false,
          };

          $cordovaContacts.find(opts).then(onSuccess, onError);
        }
      }
    }

}());
