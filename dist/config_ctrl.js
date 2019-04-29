System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, LogzioConfigCtrl;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            LogzioConfigCtrl = (function () {
                function LogzioConfigCtrl() {
                    this.indexPatternTypes = [
                        { name: 'No pattern', value: undefined },
                        { name: 'Hourly', value: 'Hourly', example: '[logstash-]YYYY.MM.DD.HH' },
                        { name: 'Daily', value: 'Daily', example: '[logstash-]YYYY.MM.DD' },
                        { name: 'Weekly', value: 'Weekly', example: '[logstash-]GGGG.WW' },
                        { name: 'Monthly', value: 'Monthly', example: '[logstash-]YYYY.MM' },
                        { name: 'Yearly', value: 'Yearly', example: '[logstash-]YYYY' },
                    ];
                    this.esVersions = [
                        { name: '2.x', value: 2 },
                        { name: '5.x', value: 5 },
                        { name: '5.6+', value: 56 },
                    ];
                    this.current.secureJsonData = this.current.secureJsonData || {};
                    this.current.secureJsonFields = this.current.secureJsonFields || {};
                    this.current.jsonData.timeField =
                        this.current.jsonData.timeField || '@timestamp';
                    this.current.jsonData.esVersion = this.current.jsonData.esVersion || 5;
                    this.current.jsonData.maxConcurrentShardRequests =
                        this.current.jsonData.maxConcurrentShardRequests || 256;
                    this.migrateUrlAndApiKey(this.current);
                }
                LogzioConfigCtrl.prototype.indexPatternTypeChanged = function () {
                    var def = lodash_1.default.find(this.indexPatternTypes, {
                        value: this.current.jsonData.interval,
                    });
                    this.current.database = def.example || 'es-index-name';
                };
                LogzioConfigCtrl.prototype.getSuggestUrls = function () {
                    return [
                        'https://api.logz.io/v1/elasticsearch',
                        'https://api-eu.logz.io/v1/elasticsearch',
                    ];
                };
                LogzioConfigCtrl.prototype.migrateUrlAndApiKey = function (instanceSettings) {
                    if ((!instanceSettings.jsonData.url ||
                        instanceSettings.jsonData.url.length === 0) &&
                        !instanceSettings.jsonData.url) {
                        instanceSettings.jsonData.url = instanceSettings.url || '';
                    }
                    if (!instanceSettings.secureJsonFields.apiKey &&
                        instanceSettings.jsonData.headers &&
                        instanceSettings.jsonData.headers.length > 0) {
                        var headerIndexToMigrate = instanceSettings.jsonData.headers.findIndex(function (e) {
                            return e.key === 'X-API-TOKEN';
                        });
                        if (headerIndexToMigrate > -1) {
                            instanceSettings.secureJsonData.apiKey =
                                instanceSettings.jsonData.headers[headerIndexToMigrate].value;
                            instanceSettings.jsonData.headers.splice(headerIndexToMigrate, 1);
                        }
                    }
                };
                LogzioConfigCtrl.templateUrl = './partials/config.html';
                return LogzioConfigCtrl;
            }());
            exports_1("LogzioConfigCtrl", LogzioConfigCtrl);
        }
    };
});
//# sourceMappingURL=config_ctrl.js.map