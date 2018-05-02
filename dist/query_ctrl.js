System.register(["angular", "lodash", "./query_def", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, queryDef, sdk_1, LogzioQueryCtrl;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (queryDef_1) {
                queryDef = queryDef_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {
            LogzioQueryCtrl = (function (_super) {
                __extends(LogzioQueryCtrl, _super);
                function LogzioQueryCtrl($scope, $injector, $rootScope, uiSegmentSrv) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.$rootScope = $rootScope;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.esVersion = _this.datasource.esVersion;
                    _this.queryUpdated();
                    return _this;
                }
                LogzioQueryCtrl.prototype.getFields = function (type) {
                    var jsonStr = angular_1.default.toJson({ find: 'fields', type: type });
                    return this.datasource
                        .metricFindQuery(jsonStr)
                        .then(this.uiSegmentSrv.transformToSegments(false))
                        .catch(this.handleQueryError.bind(this));
                };
                LogzioQueryCtrl.prototype.queryUpdated = function () {
                    var newJson = angular_1.default.toJson(this.datasource.queryBuilder.build(this.target), true);
                    if (this.rawQueryOld && newJson !== this.rawQueryOld) {
                        this.refresh();
                    }
                    this.rawQueryOld = newJson;
                    this.$rootScope.appEvent('elastic-query-updated');
                };
                LogzioQueryCtrl.prototype.getCollapsedText = function () {
                    var metricAggs = this.target.metrics;
                    var bucketAggs = this.target.bucketAggs;
                    var metricAggTypes = queryDef.getMetricAggTypes(this.esVersion);
                    var bucketAggTypes = queryDef.bucketAggTypes;
                    var text = '';
                    if (this.target.query) {
                        text += 'Query: ' + this.target.query + ', ';
                    }
                    text += 'Metrics: ';
                    lodash_1.default.each(metricAggs, function (metric, index) {
                        var aggDef = lodash_1.default.find(metricAggTypes, { value: metric.type });
                        text += aggDef.text + '(';
                        if (aggDef.requiresField) {
                            text += metric.field;
                        }
                        text += '), ';
                    });
                    lodash_1.default.each(bucketAggs, function (bucketAgg, index) {
                        if (index === 0) {
                            text += ' Group by: ';
                        }
                        var aggDef = lodash_1.default.find(bucketAggTypes, { value: bucketAgg.type });
                        text += aggDef.text + '(';
                        if (aggDef.requiresField) {
                            text += bucketAgg.field;
                        }
                        text += '), ';
                    });
                    if (this.target.alias) {
                        text += 'Alias: ' + this.target.alias;
                    }
                    return text;
                };
                LogzioQueryCtrl.prototype.handleQueryError = function (err) {
                    this.error = err.message || 'Failed to issue metric query';
                    return [];
                };
                LogzioQueryCtrl.templateUrl = 'partials/query.editor.html';
                return LogzioQueryCtrl;
            }(sdk_1.QueryCtrl));
            exports_1("LogzioQueryCtrl", LogzioQueryCtrl);
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map