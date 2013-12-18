'use strict';

angular.module('jlogApp.services')
    .factory('backup', [function() {
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
                    catch(e) {
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
                var old_url = this.save_url;
                this.save_url = null;
                if(old_url !== null) {
                    URL.revokeObjectURL(old_url);
                }
                var string = JSON.stringify(data);
                var blob = new Blob([string]);
                var url = URL.createObjectURL(blob, { type: 'text/plain' });
                var today = new Date();
                this.save_name = 'battle_list_' + today.getTime() + '.txt';
                this.save_url = url;
            }
        };
    }]);
