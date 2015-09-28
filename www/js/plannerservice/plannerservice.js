(function() {
  'use strict';

  angular
    .module('app.plannerService')
    .factory('PlannerService', ['$q', PlannerService]);

    function PlannerService($q) {
      var db ;
      var events ;

      return {
        initDB: initDB,

        getAllEvents : getAllEvents,
        addEvent : addEvent,
        updateEvent : updateEvent,
        deleteEvent : deleteEvent
      } ;


      function initDB() {
          // Creates the database or opens if it already exists
          db = new PouchDB('events', {adapter: 'websql'});

          var ddoc = createDesignDoc('by_urgency', function(doc) {
            emit([doc.urgency, Date.parse(doc.date)])
          }) ;
          db.put(ddoc)
            .then(function(){
              db.query('by_urgency', {limit:0})
                .then(function(res){
                  console.log(res) ;
                })
                .catch(function (err) {
                  throw err;
                })
            })
            .catch(function (err) {
              if (err.status !== 409) {
                throw err;
              }
              // ignore doc if already exists
            })
          // db.destroy().then(function() { console.log('ALL YOUR BASE ARE BELONG TO US') });
      };

      function getAllEvents() {
        // if(!events){
          return $q.when(db.query('by_urgency', {
            include_docs: true,
            descending:true
          })).then(function(docs){
            events = docs.rows.map(function(row){
              return row.doc ;
            }) ;

            db.changes({ live: true, since: 'now', include_docs: true})
                       .on('change', onDatabaseChange) ;
            return events ;
          })
        // } else {
        //   return $q.when(events) ;
        // }
      }

      function addEvent(event) {
        return $q.when(db.post(event));
      }

      function updateEvent(event) {
        return $q.when(db.put(event)) ;
      }

      function deleteEvent(event) {
        return $q.when(db.remove(event)) ;
      }

      function onDatabaseChange(change) {
        var index = findIndex(events, change.id);
        var event = events[index];

        if (change.deleted) {
            if (event) {
                events.splice(index, 1); // delete
            }
        } else {
            if (event && event.id === change.id) {
                events[index] = change.doc; // update
            } else {
                events.splice(index, 0, change.doc) // insert
            }
        }
      }

      function findIndex(array, id) {
            var low = 0, high = array.length, mid;
            while (low < high) {
              mid = (low + high) >>> 1;
              array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
      }


      // Helper function to create design docs to be used in queries
      // Takes the name of the design doc and the function containing the emit() method
      function createDesignDoc(name, mapFunction) {
        var ddoc = {
          _id: '_design/' + name,
          views: {}
        };
        ddoc.views[name] = { map: mapFunction.toString() };
        return ddoc;
      }
    }
}());
