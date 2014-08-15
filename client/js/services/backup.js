'use strict';

angular.module('jlogApp.services')
  .factory('backup', [
    '$window',
    '$http',
    '$q',
    function($window,
             $http,
             $q) {
      $window.URL = $window.URL || $window.webkitURL;
      return {
        read_result: null,
        save_url: null,
        save_name: 'battle_list.txt',
        read: function backupRead(file, success_cbk, error_cbk) {
          var success_cbk_ = typeof(success_cbk) === 'function' ? 
              success_cbk : 
              function(data) { console.log(data); };
          var error_cbk_ = typeof(error_cbk) === 'function' ? 
              error_cbk : 
              function(error) { console.log(error); };
          this.read_result = null;
          var reader = new $window.FileReader();
          reader.onload = function(e) {
            var data;
            try {
              data = JSON.parse(e.target.result);
              success_cbk_(data);
            }
            catch (event) {
              error_cbk_('invalid file');
            }
          };
          reader.onerror = function(e) {
            error_cbk_('error reading file');
          };
          reader.onabort = function(e) {
            error_cbk_('abort reading file');
          };
          reader.readAsText(file);
        },
        generate: function backupGenerate(data) {
          console.log('generate backup file');
          var old_url = this.save_url;
          this.save_url = null;
          if (old_url !== null) {
            $window.URL.revokeObjectURL(old_url);
          }
          var string = JSON.stringify(data);
          var blob = new $window.Blob([string], {type: 'text/plain'});
          var url = $window.URL.createObjectURL(blob);
          var today = new Date();
          this.save_name = 'battle_list_' + today.getTime() + '.txt';
          this.save_url = url;
        },
        upload: function backupUpload(battles) {
          var instance = this;
          instance.upload.id = null;
          instance.upload.status = null;
          instance.upload.msg = '';
          return $http.post('/api/log', { battles: battles })
            .then(function(response) {
              instance.upload.status = true;
              instance.upload.msg = 'data uploaded';
              instance.upload.id = response.data.id;
              return response.data;
            }, function(response) {
              instance.upload.status = false;
              instance.upload.msg = 'upload failure ('+response.status+')';
              return $q.reject(response);
            });
        },
        download: function backupDownload() {
          var instance = this;
          instance.download.status = null;
          instance.download.msg = '';
          return $http.get('/api/log/' + instance.download.id)
            .then(function(response) {
              instance.download.status = true;
              instance.download.msg = 'data downloaded';
              return response.data.battles;
            }, function(response) {
              instance.download.status = false;
              instance.download.msg = 'download failure ('+response.status+')';
              return $q.reject(response);
            });
        },
        statusReset: function backupStatusReset() {
          this.upload.id = null;
          this.upload.status = null;
          this.upload.msg = null;

          this.download.id = null;
          this.download.status = null;
          this.download.msg = null;
        }
      };
    }]);
