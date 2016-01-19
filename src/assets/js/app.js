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
siscomando.REMOTE_ADDR = 'http://localhost:9090/'

/* Siscomando URL's */
siscomando.url = {
  //home: siscomando.REMOTE_ADDR + '/data_home.json',
  home: 'https://gist.githubusercontent.com/horacioibrahim/55ce6b7b8a338ab2ad59/raw/09aa4c7af173f00b93010357ec2c808ab7d90647/data_home.json',
  feeds: 'https://raw.githubusercontent.com/siscomando/first-mobile-home/master/demo/'
};
