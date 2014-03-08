'use strict';

angular.module('jlogApp.services')
    .factory('backup', [ '$http', function($http) {
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
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data;
                    try {
                        data = JSON.parse(e.target.result);
                        success_cbk_(data);
                    }
                    catch (e) {
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
                    URL.revokeObjectURL(old_url);
                }
                var string = JSON.stringify(data);
                var blob = new Blob([string], {type: 'text/plain'});
                window.URL = window.URL || window.webkitURL;
                var url = window.URL.createObjectURL(blob);
                var today = new Date();
                this.save_name = 'battle_list_' + today.getTime() + '.txt';
                this.save_url = url;
            },
            upload: function backupUpload(battles) {
                var instance = this;
                instance.upload_result = '';
                instance.download_result = '';
                $http.post('/api/log', { battles: battles })
                    .success(function(data) {
                        instance.upload_result = 'uploaded data';
                        console.log(data);
                        instance.upload_id = data.id;
                    })
                    .error(function() {
                        instance.upload_result = 'upload failure';
                    });
            },
            download: function backupDownload(success_cbk, error_cbk) {
                var instance = this;
                var success_cbk_ = typeof(success_cbk) === 'function' ? 
                    success_cbk : 
                    function(data) { console.log(data); };
                var error_cbk_ = typeof(error_cbk) === 'function' ? 
                    error_cbk : 
                    function(error) { console.log(error); };
                instance.upload_result = '';
                instance.download_result = '';
                $http.get('/api/log/' + instance.download_id)
                    .success(function(data) {
                        instance.download_result = 'downloaded data';
                        success_cbk_(data);
                    })
                    .error(function(error) {
                        instance.download_result = 'download failure';
                        error_cbk_(error);
                    });
            }
        };
    }]);
