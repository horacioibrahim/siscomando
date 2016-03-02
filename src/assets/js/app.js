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
siscomando.REMOTE_ADDR = 'http://localhost:5000'// 'https://agile-lake-26676.herokuapp.com';
siscomando.SESSION_KEY = 'scdata' // hint: In the sc-login this is sessionKey property.
siscomando.currentUser = null;

/* Siscomando URL's */
siscomando.url = {
  home: '#/home',
  channels: siscomando.REMOTE_ADDR + '/api/services/followed',
  feeds: siscomando.REMOTE_ADDR + '/api/feeds',
  login: siscomando.REMOTE_ADDR + '/loginexp',
  searchservices: siscomando.REMOTE_ADDR + '/api/services/search/?q=',
  followservices: siscomando.REMOTE_ADDR + '/api/services/follow'
};

/** `getParameterByName` simple way get simple params in the querystring.
* This code is copied from:
* http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/
siscomando.getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//'https://gist.githubusercontent.com/horacioibrahim/55ce6b7b8a338ab2ad59/raw/09aa4c7af173f00b93010357ec2c808ab7d90647/data_home.json'
