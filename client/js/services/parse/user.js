'use strict';

angular.module('jlogApp.services')
  .factory('parseUser', [
    '$window',
    '$http',
    '$q',
    'parseUrls',
    'parseHeaders',
    'parseStorageKeys',
    function($window,
             $http,
             $q,
             parseUrls,
             parseHeaders,
             parseStorageKeys) {
      function isValidSessionToken(token) {
        return ( _.isString(token) &&
                 token.length > 0
               );
      }
      var parseUserService = {
        init: function() {
          return $q.when($window.localStorage.getItem(parseStorageKeys.sessionToken))
            .then(parseUserService.validateSessionToken)
            .then(parseUserService.retrieveSession)
            .catch(function(error) {
              console.log('Parse User: init: error', error);
              return $q.reject(error);
            });
        },
        validateSessionToken: function(token) {
          if(isValidSessionToken(token)) return token;
          return $q.reject('invalid session token "'+token+'"');
        },
        retrieveSession: function(token) {
          var request = {
            method: 'GET',
            url: parseUrls.root+'/users/me',
            headers: _.extend({
              'X-Parse-Session-Token': token,
            }, parseHeaders)
          };
          console.log('Parse User: retrieve session: ', request);
          return $http(request)
            .then(function(response) {
              console.log('Parse User: retrieve session: success', response);
              return response.data;
            })
            .catch(function(error) {
              console.log('Parse User: retrieve session: error', error.data.error);
              return $q.reject(error.data.error);
            });
        },
        signup: function(signup) {
          signup = _.pick(signup, 'username','password','email');
          var request = {
            method: 'POST',
            url: parseUrls.root+'/users',
            headers: _.extend({
              'X-Parse-Revocable-Session': '1',
            }, parseHeaders),
            data: JSON.stringify(signup)
          };
          console.log('Parse User: Sign Up: ', request);
          return $http(request)
            .then(function(response) {
              console.log('Parse User: Sign Up: success', response);
              var user = _.extend(signup, response.data);
              $window.localStorage.setItem(parseStorageKeys.sessionToken, user.sessionToken);
              return user;
            })
            .catch(function(error) {
              console.log('Parse User: Sign Up: error', error.data.error);
              return $q.reject(error.data.error);
            });
        },
        login: function(login) {
          var request = {
            method: 'GET',
            url: parseUrls.root+'/login',
            headers: _.extend({
              'X-Parse-Revocable-Session': '1',
            }, parseHeaders),
            params: login
          };
          console.log('Parse User: Log In: ', request);
          return $http(request)
            .then(function(response) {
              console.log('Parse User: Log In: success', response);
              var user = response.data;
              $window.localStorage.setItem(parseStorageKeys.sessionToken,
                                           user.sessionToken);
              return user;
            })
            .catch(function(error) {
              console.log('Parse User: Log In: error', error.data.error);
              return $q.reject(error.data.error);
            });
        },
        logout: function(user) {
          var request = {
            method: 'POST',
            url: parseUrls.root+'/logout',
            headers: _.extend({
              'X-Parse-Session-Token': user.sessionToken,
            }, parseHeaders)
          };
          console.log('Parse User: Log Out: ', request);
          return $http(request)
            .then(function(response) {
              console.log('Parse User: Log Out: success', response);
              $window.localStorage.removeItem(parseStorageKeys.sessionToken);
              return {};
            })
            .catch(function(error) {
              console.log('Parse User: Log Out: error', error.data.error);
              return $q.reject(error.data.error);
            });
        },
        users: function() {
          var request = {
            method: 'GET',
            url: parseUrls.root+'/users',
            headers: parseHeaders,
          };
          console.log('Parse User: get Users: ', request);
          return $http(request)
            .then(function(response) {
              console.log('Parse User: get Users: success', response);
              return response.data.results;
            })
            .catch(function(error) {
              console.log('Parse User: get Users: error', error.data.error);
              return error.data.error;
            });
        },
      };
      return parseUserService;
    }
  ]);
