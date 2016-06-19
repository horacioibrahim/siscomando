/**
 * SisComando Javascript Library v0.1.2
 *
 * Copyright 2016 Siscomando and other contributors
 * Released under the MIT license
 * http://siscomando.github.io/api
 *
 *
 * .. versionchanged:: 0.1.1
 *    Adds helpers to help build urls
 *    Change filter for python filters supported by API (e.g:?where=name==XXX)
 */
DB_NAME = 'scv21.db';

var siscomando = siscomando || {};
siscomando.REMOTE_ADDR = 'http://localhost:5000'; //'https://agile-lake-26676.herokuapp.com';
siscomando.SESSION_KEY = 'scdata'; // hint: In the sc-login this is sessionKey property.
siscomando.currentUser = null;

/* Siscomando URL's */
siscomando.url = {
    home: '#/home',
    channels: siscomando.REMOTE_ADDR + '/api/services/followed',
    addchannel: siscomando.REMOTE_ADDR + '/api/services/addchannel', // not REST complaince 
    feeds: siscomando.REMOTE_ADDR + '/api/feeds',
    login: siscomando.REMOTE_ADDR + '/loginexp',
    logoff: siscomando.REMOTE_ADDR + '/logoff',
    searchservices: siscomando.REMOTE_ADDR + '/api/services/search/?model=services&q=',
    searchusers: siscomando.REMOTE_ADDR + '/api/services/search/?model=users&q=',
    followservices: siscomando.REMOTE_ADDR + '/api/services/follow',
    checkavailabilitydata: siscomando.REMOTE_ADDR + '/api/services/checkavailabilitydata',
    meetings: siscomando.REMOTE_ADDR + '/api/services/meetings',
    addmeetings: siscomando.REMOTE_ADDR + '/api/services/meetings/add',
    updates: siscomando.REMOTE_ADDR + '/streaming'
    //meetings: siscomando.REMOTE_ADDR + '/api/services/meetings/?q='
};

/* Siscomando sounds */
siscomando.sounds = {};

/** `getParameterByName` simple way get simple params in the querystring.
* This code is copied from:
* http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/
siscomando.getParameterByName = function (name, url) {
    url = !url ? window.location.href : url;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// capitalize first letter
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Cordova implementations
function playAudio(src) {

    // HTML5 Audio
    if (typeof Audio != "undefined") { 
        new Audio(src).play() ;

    // Phonegap media
    } else if (typeof device != "undefined") {

        // Android needs the search path explicitly specified
        if (device.platform == 'Android') {
            src = 'file:///android_asset/www/' + src; //assets/sounds/XXX.ogg
        }

        var mediaRes = new Media(src,
            function onSuccess() {
                // release the media resource once finished playing
                mediaRes.release();
            },
            function onError(e){
                console.log("error playing sound: " + JSON.stringify(e));
            });
        mediaRes.play();

    } else {
        console.log("no sound API to play: " + src);
    }
 };

// listen updates
/** Updates counters. This code bellow updates the counters
useful for badges. How to works? Listening sse events to increment
or listen html custom events to decrement. 

Events:
 `db-counters-messages`: decrement counter in counters.messages
 `db-counters-meetings`: decrement counter in counters.meetings
  ...
  or
  ...
  `sc-counters-messages`: increment counter in counters.messages
  `sc-counters-meetings`: increment counter in counters.meetings
*/

var es = new EventSource(siscomando.url.updates);
es.onmessage = function(event){
     var savedData = JSON.parse(window.sessionStorage.getItem('counters'));
     savedData = savedData ? savedData : {};
     var data = JSON.parse(event.data);
     console.log(data);
     // increment 
     switch (data.scope) {
         case 'messages':
             if ('messages' in savedData) {
                 savedData.service += 1;
                 var eventCounter = new CustomEvent('sc-counters-messages', { 'detail': savedData.service});
                 document.dispatchEvent(eventCounter);
             } else {
                 savedData.service = 0;
             }
             break;
         case 'meetings':
             if ('meetings' in savedData) {
                 savedData.meetings += 1;
                 var eventCounter = new CustomEvent('sc-counters-meetings', { 'detail': savedData.meetings});
                 document.dispatchEvent(eventCounter);                 
             } else {
                 savedData.meetings = 0;
             }             
             break;
         case 'dashboard':
             if ('dashboard' in savedData) {
                 savedData.dashboard += 1;
                 var eventCounter = new CustomEvent('sc-counters-meetings', { 'detail': savedData.dashboard});
                 document.dispatchEvent(eventCounter);                  
             } else {
                 savedData.dashboard = 0;
             }               
             break;
         default:
             console.log("scope outside");
     }
     // persist
     window.sessionStorage.setItem('counters', JSON.stringify(savedData));
};
// decremennt
var decrementCounters = function(scope) {
    document.addEventListener('db-counters-' + scope, function(){
         var savedData = JSON.parse(window.sessionStorage.getItem('counters'));
         savedData = savedData ? savedData : {}; 
         savedData[scope] = 0;
         window.sessionStorage.setItem('counters', JSON.stringify(savedData));
    });
};
// listeners
decrementCounters('messages');
decrementCounters('meetings');
decrementCounters('dashboard');

//// MOBILE SCOPE
var nullHandler = function(tx, r) {
    //alert(1);
    console.log(JSON.stringify(tx));
    //alert(JSON.stringify(r));
}
var errorHandler = function(tx, e) {
    //alert(0);
    console.log(JSON.stringify(tx));
    //alert(JSON.stringify(e));
}
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event');
        // SQLITE setup
        app.setupDatabase();
    },
    setupDatabase: function(){
        /// IMPORTANT NOTE: This androidLockWorkaround is only applied when using db.sqlBatch 
        /// or db.transaction(), not applied when running executeSql() on the database object.
        if (window.sqlitePlugin) {
            app.db = window.sqlitePlugin.openDatabase(
                    {name: DB_NAME, location: 'default', androidLockWorkaround: 1}, 
                    app.createSchemas, 
                    function(err){console.log('Open database ERROR: ' + JSON.stringify(err));}
            );                    
        } else {
            // mockup for tests
            app.db = window.openDatabase(DB_NAME, '1.0', 'myDatabase', 10000000);
            app.createSchemas(); // force for web
        }
        
        return app.db;
    },
    openDatabase: function(){
        if (app.db) {
            return app.db;
        } else {
            return app.setupDatabase();    
        }
        
    },
    // Create databases schema
    createSchemas: function(db, queries, dbname) {
        console.log("CREATING SCHEMAS...");
        var db = app.db;
        var queries =  [
            'CREATE TABLE IF NOT EXISTS meetings (keydb text primary key not null, _id text, senderId text, receiverId text unique, body text, createdAt text, updatedAt text, senderName text, receiverName text)',
            'CREATE TABLE IF NOT EXISTS messages (keydb text primary key not null, body text, source_type integer, userId text, serviceId text, ticketId text, createdAt text, updatedAt text, authorName text)',
            'CREATE TABLE IF NOT EXISTS feeds_meetings (keydb text primary key not null, scope text not null, body text, createdAt text, updatedAt text, read integer, _id text, senderId text, receiverId text, senderName text, receiverName text)'  
        ]
        // transactions
        db.transaction(function(tx){
            for (var idx = 0; idx < queries.length; idx++) {
                tx.executeSql(queries[idx], [], 
                    function(){console.log('done schema')},
                    function(tx, err){console.log('error: ' + err.message)}
                ); // end tx.executeSql
            }                
        }); // end db.transaction
    
    }, 
    /** `insertMeetings` add data from JSON returned by API. 
    The scope here is meetings.
    */
    insertMeetings: function(keydb, _id, senderId, receiverId, body, createdAt, updatedAt, senderName, receiverName){
        var db = app.openDatabase();
        db.transaction(function(tx){
               tx.executeSql('INSERT INTO meetings(keydb, _id, senderId, receiverId, body, createdAt, updatedAt, senderName, receiverName) VALUES (?,?,?,?,?,?,?,?,?)',[keydb, _id, senderId, receiverId, body, createdAt, updatedAt, senderName, receiverName],nullHandler, function(tx,e){
                   // error primary so update. check if primary key exception or receiverID
                   tx.executeSql("SELECT * FROM meetings WHERE keydb = ?", [keydb], 
                        function(tx, res){
                                    var tuple = res.rows.item(0);
                                    if (tuple.updatedAt < updatedAt){
                                        tx.executeSql('UPDATE meetings SET updatedAt = ?, body = ? WHERE keydb = ?', [updatedAt, body, keydb], function(tx, res){ 
                                            //alert('updated')
                                        }, function(tx, err){console.log('update error: ' + JSON.stringify(err))});
                                    } 
                                },
                        function(tx, err){
                                    console.log("Error addMeetings: " + JSON.stringify(err));
                                }
                    );
               });
        });
    },
    /** `insertMessages` add data from JSON returned by API. 
    The scope here is Messages/Services.
    */    
    insertMessages: function(keydb, body, source_type, userId, serviceId, createdAt, updatedAt, authorName){
    },
    /* `insertFeedsMeetings` adds at local database `feeds` 
    * based on scope `meetings`.
    */    
    insertFeedsMeetings: function(keydb, body, createdAt, updatedAt, _id, senderId, receiverId, senderName, receiverName){
        var db = app.openDatabase();
        var query = "INSERT into feeds_meetings (keydb, scope, body, createdAt, updatedAt, read, _id, senderId, receiverId, senderName, receiverName) VALUES (?,?,?,?,?,?,?,?,?,?,?)"; // where read is false
        var params = [keydb, 'meetings', body, createdAt, updatedAt, 0, _id, senderId, receiverId,  senderName, receiverName];
        //transaction
        db.transaction(function(tx){
            tx.executeSql(query, params,
                function(tx, res){console.log("ok: " + JSON.stringify(res))},
                function(tx, err){
                //error handling: start
                  tx.executeSql("SELECT * FROM feeds_meetings WHERE keydb = ?", [keydb], 
                        function(tx, res){
                                    var tuple = res.rows.item(0);
                                    // db.updateAt less than current return by 
                                    // request
                                    if (tuple.updatedAt < updatedAt){
                                        console.log("trying update feeds meetings");
                                        tx.executeSql('UPDATE feeds_meetings SET updatedAt = ?, body = ? WHERE keydb = ?', [updatedAt, body, keydb], function(tx, res){ 
                                            //alert('updated')
                                        }, function(tx, err){console.log('update error: ' + JSON.stringify(err))});
                                    } 
                                },
                        function(tx, err){
                                    console.log("Error addMeetings: " + JSON.stringify(err));
                                }
                    );                
                //error handling: end
                }
            );
        });
    },  
    /* `insertFeedsMessages` adds at local database `feeds` 
    * based on scope `messages`.
    */        
    insertFeedsMessages: function(keydb, body, source_type, userId, serviceId, ticketId, createdAt, updatedAt, authorName){
        var db = app.openDatabase();
        var query = "INSERT into messages (keydb, body, source_type, userId, serviceId, ticketId, createdAt, updatedAt, authorName) VALUES (?,?,?,?,?,?,?,?,?)"; // where read is false
        var params = [keydb, body, source_type, userId, serviceId, ticketId, createdAt, updatedAt, authorName];
        //transaction
        db.transaction(function(tx){
            tx.executeSql(query, params,
                function(tx, res){console.log("ok: " + JSON.stringify(res))},
                function(tx, err){
                //error handling: start
                  // console.log("err messages: " + err);
                  // console.log(err);
                  tx.executeSql("SELECT * FROM messages WHERE keydb = ?", [keydb], 
                        function(tx, res){
                                    var tuple = res.rows.item(0);
                                    // db.updateAt less than current return by 
                                    // request
                                    if (tuple.updatedAt < updatedAt){
                                        console.log("trying update feeds messages");
                                        tx.executeSql('UPDATE messages SET updatedAt = ?, body = ? WHERE keydb = ?', [updatedAt, body, keydb], function(tx, res){ 
                                            //alert('updated')
                                        }, function(tx, err){console.log('update error: ' + JSON.stringify(err))});
                                    } 
                                },
                        function(tx, err){
                                    console.log("Error add messages: " + JSON.stringify(err));
                                }
                    );                
                //error handling: end
                }
            );
        });
    },      
    /** `sqliteSelect` select data from SQLite and emit
    * results as events.
    * @param where: is a string separated by comma "field,value"
    */
    selectTable: function(table, where){
        var results = [];
        var where = where ? where.split(',') : null;
    
        if (where) {
            var query = "SELECT * FROM " + table + ' WHERE ' + where[0] + ' = "' + where[1] + '"';
        } else {
            var query = "SELECT * FROM " + table;    
        }
        
        var db = app.openDatabase();
        var errorHandler = function(t, e){
           console.log(0);
           console.log(e);  
        };
        
        //
        // console.log("query:");
        // console.log(query);
        db.transaction(function(tx){
            tx.executeSql(query, [],
            function(tx, res){
                //console.log("Num lines: " + res.rows.length);
                for (var i = 0; i < res.rows.length; i++) {
                    results.push(res.rows.item(i));
                }
                // console.log('results:');
                // console.log(results);
                var eventSelect = new CustomEvent('sql-select', {detail: results});
                document.dispatchEvent(eventSelect);
                return results; // emit
            }, errorHandler);
        });
        
    },
    /* TODO: `deleteTable` updates the local database to messages 
    * was erased on server side. For this work fine the server side 
    * must to implement async message as Server-Side Events
    */
    deleteTable: function(channel, table, where, keydb){
        var sseChannel = channel; // 'deleteMessageListener';
        var scope = table; //sample
        var where = where ? where.split(',') : null;
        var db = app.openDatabase();
        var query;
        
        if (Array.isArray(where)) {
            query = "DELETE FROM " + scope + " WHERE " + where[0] + " = " + where[1];
        } else {
            query = "DELETE FROM " + scope + " WHERE keydb = ?";
        }
        
        var params = keydb ? [keydb] : [];
            
        db.transaction(function(tx){
            tx.executeSql(query, [keydb], 
                function(tx, res){console.log("Deleted: " + JSON.stringify(res))}, 
                function(tx, err){console.log("Err delete: " + JSON.stringify(err))});
        });
    } 
};

app.initialize();