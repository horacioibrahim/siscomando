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
siscomando.REMOTE_ADDR = 'https://agile-lake-26676.herokuapp.com';
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
    searchservices: siscomando.REMOTE_ADDR + '/api/services/search/?q=',
    followservices: siscomando.REMOTE_ADDR + '/api/services/follow',
    checkavailabilitydata: siscomando.REMOTE_ADDR + '/api/services/checkavailabilitydata'
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