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