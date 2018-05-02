System.register(["./datasource", "./query_ctrl", "./config_ctrl"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, query_ctrl_1, config_ctrl_1, LogzioQueryOptionsCtrl, LogzioAnnotationsQueryCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            },
            function (query_ctrl_1_1) {
                query_ctrl_1 = query_ctrl_1_1;
            },
            function (config_ctrl_1_1) {
                config_ctrl_1 = config_ctrl_1_1;
            }
        ],
        execute: function () {
            exports_1("Datasource", datasource_1.LogzioDatasource);
            exports_1("QueryCtrl", query_ctrl_1.LogzioQueryCtrl);
            exports_1("ConfigCtrl", config_ctrl_1.LogzioConfigCtrl);
            LogzioQueryOptionsCtrl = (function () {
                function LogzioQueryOptionsCtrl() {
                }
                LogzioQueryOptionsCtrl.templateUrl = 'partials/query.options.html';
                return LogzioQueryOptionsCtrl;
            }());
            exports_1("QueryOptionsCtrl", LogzioQueryOptionsCtrl);
            LogzioAnnotationsQueryCtrl = (function () {
                function LogzioAnnotationsQueryCtrl() {
                }
                LogzioAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
                return LogzioAnnotationsQueryCtrl;
            }());
            exports_1("AnnotationsQueryCtrl", LogzioAnnotationsQueryCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map