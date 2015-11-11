'use strict';

angular.module('jlogApp.services')
  .value('parseStorageKeys', {
    sessionToken: 'jlogApp.parse.sessionToken',
    sync: 'jlogApp.parse.sync',
  })
  .value('parseUrls', {
    root: 'https://api.parse.com/1'
  })
  .value('parseHeaders', {
    'X-Parse-Application-Id': 'LkO5rF2pzzCXuC37BH2pUsccpXfO5Fafv22FvpTW',
    'X-Parse-REST-API-Key': 'G2Ok330t9e4EALJUEBhymk50gpJ2F1yWj8EMFaob',
  });
