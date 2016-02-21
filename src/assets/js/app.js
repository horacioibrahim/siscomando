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
siscomando.REMOTE_ADDR = 'http://192.168.1.104:9000'
siscomando.SESSION_KEY = 'scdata' // hint: In the sc-login this is sessionKey property.
siscomando.currentUser = null;

/* Siscomando URL's */
siscomando.url = {
  home: '#/home',
  channels: siscomando.REMOTE_ADDR + '/channels',
  feeds: siscomando.REMOTE_ADDR + '/feeds',
  login: siscomando.REMOTE_ADDR + '/loginexp'
};


//'https://gist.githubusercontent.com/horacioibrahim/55ce6b7b8a338ab2ad59/raw/09aa4c7af173f00b93010357ec2c808ab7d90647/data_home.json'
