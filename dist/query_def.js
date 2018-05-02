System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getMetricAggTypes(esVersion) {
        return lodash_1.default.filter(metricAggTypes, function (f) {
            if (f.minVersion) {
                return f.minVersion <= esVersion;
            }
            else {
                return true;
            }
        });
    }
    exports_1("getMetricAggTypes", getMetricAggTypes);
    function getPipelineOptions(metric) {
        if (!isPipelineAgg(metric.type)) {
            return [];
        }
        return pipelineOptions[metric.type];
    }
    exports_1("getPipelineOptions", getPipelineOptions);
    function isPipelineAgg(metricType) {
        if (metricType) {
            var po = pipelineOptions[metricType];
            return po !== null && po !== undefined;
        }
        return false;
    }
    exports_1("isPipelineAgg", isPipelineAgg);
    function getPipelineAggOptions(targets) {
        var result = [];
        lodash_1.default.each(targets.metrics, function (metric) {
            if (!isPipelineAgg(metric.type)) {
                result.push({ text: describeMetric(metric), value: metric.id });
            }
        });
        return result;
    }
    exports_1("getPipelineAggOptions", getPipelineAggOptions);
    function getMovingAvgSettings(model, filtered) {
        var filteredResult = [];
        if (filtered) {
            lodash_1.default.each(movingAvgModelSettings[model], function (setting) {
                if (!setting.isCheckbox) {
                    filteredResult.push(setting);
                }
            });
            return filteredResult;
        }
        return movingAvgModelSettings[model];
    }
    exports_1("getMovingAvgSettings", getMovingAvgSettings);
    function getOrderByOptions(target) {
        var metricRefs = [];
        lodash_1.default.each(target.metrics, function (metric) {
            if (metric.type !== 'count') {
                metricRefs.push({ text: describeMetric(metric), value: metric.id });
            }
        });
        return orderByOptions.concat(metricRefs);
    }
    exports_1("getOrderByOptions", getOrderByOptions);
    function describeOrder(order) {
        var def = lodash_1.default.find(orderOptions, { value: order });
        return def.text;
    }
    exports_1("describeOrder", describeOrder);
    function describeMetric(metric) {
        var def = lodash_1.default.find(metricAggTypes, { value: metric.type });
        return def.text + ' ' + metric.field;
    }
    exports_1("describeMetric", describeMetric);
    function describeOrderBy(orderBy, target) {
        var def = lodash_1.default.find(orderByOptions, { value: orderBy });
        if (def) {
            return def.text;
        }
        var metric = lodash_1.default.find(target.metrics, { id: orderBy });
        if (metric) {
            return describeMetric(metric);
        }
        else {
            return 'metric not found';
        }
    }
    exports_1("describeOrderBy", describeOrderBy);
    var lodash_1, metricAggTypes, bucketAggTypes, orderByOptions, orderOptions, sizeOptions, extendedStats, intervalOptions, movingAvgModelOptions, pipelineOptions, movingAvgModelSettings;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            exports_1("metricAggTypes", metricAggTypes = [
                { text: 'Count', value: 'count', requiresField: false },
                {
                    text: 'Average',
                    value: 'avg',
                    requiresField: true,
                    supportsInlineScript: true,
                    supportsMissing: true,
                },
                {
                    text: 'Sum',
                    value: 'sum',
                    requiresField: true,
                    supportsInlineScript: true,
                    supportsMissing: true,
                },
                {
                    text: 'Max',
                    value: 'max',
                    requiresField: true,
                    supportsInlineScript: true,
                    supportsMissing: true,
                },
                {
                    text: 'Min',
                    value: 'min',
                    requiresField: true,
                    supportsInlineScript: true,
                    supportsMissing: true,
                },
                {
                    text: 'Extended Stats',
                    value: 'extended_stats',
                    requiresField: true,
                    supportsMissing: true,
                    supportsInlineScript: true,
                },
                {
                    text: 'Percentiles',
                    value: 'percentiles',
                    requiresField: true,
                    supportsMissing: true,
                    supportsInlineScript: true,
                },
                {
                    text: 'Unique Count',
                    value: 'cardinality',
                    requiresField: true,
                    supportsMissing: true,
                },
                {
                    text: 'Moving Average',
                    value: 'moving_avg',
                    requiresField: false,
                    isPipelineAgg: true,
                    minVersion: 2,
                },
                {
                    text: 'Derivative',
                    value: 'derivative',
                    requiresField: false,
                    isPipelineAgg: true,
                    minVersion: 2,
                },
                { text: 'Raw Document', value: 'raw_document', requiresField: false },
            ]);
            exports_1("bucketAggTypes", bucketAggTypes = [
                { text: 'Terms', value: 'terms', requiresField: true },
                { text: 'Filters', value: 'filters' },
                { text: 'Geo Hash Grid', value: 'geohash_grid', requiresField: true },
                { text: 'Date Histogram', value: 'date_histogram', requiresField: true },
                { text: 'Histogram', value: 'histogram', requiresField: true },
            ]);
            exports_1("orderByOptions", orderByOptions = [{ text: 'Doc Count', value: '_count' }, { text: 'Term value', value: '_term' }]);
            exports_1("orderOptions", orderOptions = [{ text: 'Top', value: 'desc' }, { text: 'Bottom', value: 'asc' }]);
            exports_1("sizeOptions", sizeOptions = [
                { text: 'No limit', value: '0' },
                { text: '1', value: '1' },
                { text: '2', value: '2' },
                { text: '3', value: '3' },
                { text: '5', value: '5' },
                { text: '10', value: '10' },
                { text: '15', value: '15' },
                { text: '20', value: '20' },
            ]);
            exports_1("extendedStats", extendedStats = [
                { text: 'Avg', value: 'avg' },
                { text: 'Min', value: 'min' },
                { text: 'Max', value: 'max' },
                { text: 'Sum', value: 'sum' },
                { text: 'Count', value: 'count' },
                { text: 'Std Dev', value: 'std_deviation' },
                { text: 'Std Dev Upper', value: 'std_deviation_bounds_upper' },
                { text: 'Std Dev Lower', value: 'std_deviation_bounds_lower' },
            ]);
            exports_1("intervalOptions", intervalOptions = [
                { text: 'auto', value: 'auto' },
                { text: '10s', value: '10s' },
                { text: '1m', value: '1m' },
                { text: '5m', value: '5m' },
                { text: '10m', value: '10m' },
                { text: '20m', value: '20m' },
                { text: '1h', value: '1h' },
                { text: '1d', value: '1d' },
            ]);
            exports_1("movingAvgModelOptions", movingAvgModelOptions = [
                { text: 'Simple', value: 'simple' },
                { text: 'Linear', value: 'linear' },
                { text: 'Exponentially Weighted', value: 'ewma' },
                { text: 'Holt Linear', value: 'holt' },
                { text: 'Holt Winters', value: 'holt_winters' },
            ]);
            exports_1("pipelineOptions", pipelineOptions = {
                moving_avg: [
                    { text: 'window', default: 5 },
                    { text: 'model', default: 'simple' },
                    { text: 'predict', default: undefined },
                    { text: 'minimize', default: false },
                ],
                derivative: [{ text: 'unit', default: undefined }],
            });
            exports_1("movingAvgModelSettings", movingAvgModelSettings = {
                simple: [],
                linear: [],
                ewma: [{ text: 'Alpha', value: 'alpha', default: undefined }],
                holt: [{ text: 'Alpha', value: 'alpha', default: undefined }, { text: 'Beta', value: 'beta', default: undefined }],
                holt_winters: [
                    { text: 'Alpha', value: 'alpha', default: undefined },
                    { text: 'Beta', value: 'beta', default: undefined },
                    { text: 'Gamma', value: 'gamma', default: undefined },
                    { text: 'Period', value: 'period', default: undefined },
                    { text: 'Pad', value: 'pad', default: undefined, isCheckbox: true },
                ],
            });
        }
    };
});
//# sourceMappingURL=query_def.js.map