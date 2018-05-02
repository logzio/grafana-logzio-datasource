System.register(["lodash", "./query_def", "./table_model"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, queryDef, table_model_1, ElasticResponse;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (queryDef_1) {
                queryDef = queryDef_1;
            },
            function (table_model_1_1) {
                table_model_1 = table_model_1_1;
            }
        ],
        execute: function () {
            ElasticResponse = (function () {
                function ElasticResponse(targets, response) {
                    this.targets = targets;
                    this.response = response;
                    this.targets = targets;
                    this.response = response;
                }
                ElasticResponse.prototype.processMetrics = function (esAgg, target, seriesList, props) {
                    var metric, y, i, newSeries, bucket, value;
                    for (y = 0; y < target.metrics.length; y++) {
                        metric = target.metrics[y];
                        if (metric.hide) {
                            continue;
                        }
                        switch (metric.type) {
                            case 'count': {
                                newSeries = { datapoints: [], metric: 'count', props: props };
                                for (i = 0; i < esAgg.buckets.length; i++) {
                                    bucket = esAgg.buckets[i];
                                    value = bucket.doc_count;
                                    newSeries.datapoints.push([value, bucket.key]);
                                }
                                seriesList.push(newSeries);
                                break;
                            }
                            case 'percentiles': {
                                if (esAgg.buckets.length === 0) {
                                    break;
                                }
                                var firstBucket = esAgg.buckets[0];
                                var percentiles = firstBucket[metric.id].values;
                                for (var percentileName in percentiles) {
                                    newSeries = {
                                        datapoints: [],
                                        metric: 'p' + percentileName,
                                        props: props,
                                        field: metric.field,
                                    };
                                    for (i = 0; i < esAgg.buckets.length; i++) {
                                        bucket = esAgg.buckets[i];
                                        var values = bucket[metric.id].values;
                                        newSeries.datapoints.push([values[percentileName], bucket.key]);
                                    }
                                    seriesList.push(newSeries);
                                }
                                break;
                            }
                            case 'extended_stats': {
                                for (var statName in metric.meta) {
                                    if (!metric.meta[statName]) {
                                        continue;
                                    }
                                    newSeries = {
                                        datapoints: [],
                                        metric: statName,
                                        props: props,
                                        field: metric.field,
                                    };
                                    for (i = 0; i < esAgg.buckets.length; i++) {
                                        bucket = esAgg.buckets[i];
                                        var stats = bucket[metric.id];
                                        stats.std_deviation_bounds_upper = stats.std_deviation_bounds.upper;
                                        stats.std_deviation_bounds_lower = stats.std_deviation_bounds.lower;
                                        newSeries.datapoints.push([stats[statName], bucket.key]);
                                    }
                                    seriesList.push(newSeries);
                                }
                                break;
                            }
                            default: {
                                newSeries = {
                                    datapoints: [],
                                    metric: metric.type,
                                    field: metric.field,
                                    props: props,
                                };
                                for (i = 0; i < esAgg.buckets.length; i++) {
                                    bucket = esAgg.buckets[i];
                                    value = bucket[metric.id];
                                    if (value !== undefined) {
                                        if (value.normalized_value) {
                                            newSeries.datapoints.push([value.normalized_value, bucket.key]);
                                        }
                                        else {
                                            newSeries.datapoints.push([value.value, bucket.key]);
                                        }
                                    }
                                }
                                seriesList.push(newSeries);
                                break;
                            }
                        }
                    }
                };
                ElasticResponse.prototype.processAggregationDocs = function (esAgg, aggDef, target, table, props) {
                    if (table.columns.length === 0) {
                        for (var _i = 0, _a = lodash_1.default.keys(props); _i < _a.length; _i++) {
                            var propKey = _a[_i];
                            table.addColumn({ text: propKey, filterable: true });
                        }
                        table.addColumn({ text: aggDef.field, filterable: true });
                    }
                    var addMetricValue = function (values, metricName, value) {
                        table.addColumn({ text: metricName });
                        values.push(value);
                    };
                    for (var _b = 0, _c = esAgg.buckets; _b < _c.length; _b++) {
                        var bucket = _c[_b];
                        var values = [];
                        for (var _d = 0, _e = lodash_1.default.values(props); _d < _e.length; _d++) {
                            var propValues = _e[_d];
                            values.push(propValues);
                        }
                        values.push(bucket.key);
                        for (var _f = 0, _g = target.metrics; _f < _g.length; _f++) {
                            var metric = _g[_f];
                            switch (metric.type) {
                                case 'count': {
                                    addMetricValue(values, this.getMetricName(metric.type), bucket.doc_count);
                                    break;
                                }
                                case 'extended_stats': {
                                    for (var statName in metric.meta) {
                                        if (!metric.meta[statName]) {
                                            continue;
                                        }
                                        var stats = bucket[metric.id];
                                        stats.std_deviation_bounds_upper = stats.std_deviation_bounds.upper;
                                        stats.std_deviation_bounds_lower = stats.std_deviation_bounds.lower;
                                        addMetricValue(values, this.getMetricName(statName), stats[statName]);
                                    }
                                    break;
                                }
                                default: {
                                    var metricName = this.getMetricName(metric.type);
                                    var otherMetrics = lodash_1.default.filter(target.metrics, { type: metric.type });
                                    if (otherMetrics.length > 1) {
                                        metricName += ' ' + metric.field;
                                    }
                                    addMetricValue(values, metricName, bucket[metric.id].value);
                                    break;
                                }
                            }
                        }
                        table.rows.push(values);
                    }
                };
                ElasticResponse.prototype.processBuckets = function (aggs, target, seriesList, table, props, depth) {
                    var bucket, aggDef, esAgg, aggId;
                    var maxDepth = target.bucketAggs.length - 1;
                    for (aggId in aggs) {
                        aggDef = lodash_1.default.find(target.bucketAggs, { id: aggId });
                        esAgg = aggs[aggId];
                        if (!aggDef) {
                            continue;
                        }
                        if (depth === maxDepth) {
                            if (aggDef.type === 'date_histogram') {
                                this.processMetrics(esAgg, target, seriesList, props);
                            }
                            else {
                                this.processAggregationDocs(esAgg, aggDef, target, table, props);
                            }
                        }
                        else {
                            for (var nameIndex in esAgg.buckets) {
                                bucket = esAgg.buckets[nameIndex];
                                props = lodash_1.default.clone(props);
                                if (bucket.key !== void 0) {
                                    props[aggDef.field] = bucket.key;
                                }
                                else {
                                    props['filter'] = nameIndex;
                                }
                                if (bucket.key_as_string) {
                                    props[aggDef.field] = bucket.key_as_string;
                                }
                                this.processBuckets(bucket, target, seriesList, table, props, depth + 1);
                            }
                        }
                    }
                };
                ElasticResponse.prototype.getMetricName = function (metric) {
                    var metricDef = lodash_1.default.find(queryDef.metricAggTypes, { value: metric });
                    if (!metricDef) {
                        metricDef = lodash_1.default.find(queryDef.extendedStats, { value: metric });
                    }
                    return metricDef ? metricDef.text : metric;
                };
                ElasticResponse.prototype.getSeriesName = function (series, target, metricTypeCount) {
                    var metricName = this.getMetricName(series.metric);
                    if (target.alias) {
                        var regex = /\{\{([\s\S]+?)\}\}/g;
                        return target.alias.replace(regex, function (match, g1, g2) {
                            var group = g1 || g2;
                            if (group.indexOf('term ') === 0) {
                                return series.props[group.substring(5)];
                            }
                            if (series.props[group] !== void 0) {
                                return series.props[group];
                            }
                            if (group === 'metric') {
                                return metricName;
                            }
                            if (group === 'field') {
                                return series.field;
                            }
                            return match;
                        });
                    }
                    if (series.field && queryDef.isPipelineAgg(series.metric)) {
                        var appliedAgg = lodash_1.default.find(target.metrics, { id: series.field });
                        if (appliedAgg) {
                            metricName += ' ' + queryDef.describeMetric(appliedAgg);
                        }
                        else {
                            metricName = 'Unset';
                        }
                    }
                    else if (series.field) {
                        metricName += ' ' + series.field;
                    }
                    var propKeys = lodash_1.default.keys(series.props);
                    if (propKeys.length === 0) {
                        return metricName;
                    }
                    var name = '';
                    for (var propName in series.props) {
                        name += series.props[propName] + ' ';
                    }
                    if (metricTypeCount === 1) {
                        return name.trim();
                    }
                    return name.trim() + ' ' + metricName;
                };
                ElasticResponse.prototype.nameSeries = function (seriesList, target) {
                    var metricTypeCount = lodash_1.default.uniq(lodash_1.default.map(seriesList, 'metric')).length;
                    for (var i = 0; i < seriesList.length; i++) {
                        var series = seriesList[i];
                        series.target = this.getSeriesName(series, target, metricTypeCount);
                    }
                };
                ElasticResponse.prototype.processHits = function (hits, seriesList) {
                    var series = {
                        target: 'docs',
                        type: 'docs',
                        datapoints: [],
                        total: hits.total,
                        filterable: true,
                    };
                    var propName, hit, doc, i;
                    for (i = 0; i < hits.hits.length; i++) {
                        hit = hits.hits[i];
                        doc = {
                            _id: hit._id,
                            _type: hit._type,
                            _index: hit._index,
                        };
                        if (hit._source) {
                            for (propName in hit._source) {
                                doc[propName] = hit._source[propName];
                            }
                        }
                        for (propName in hit.fields) {
                            doc[propName] = hit.fields[propName];
                        }
                        series.datapoints.push(doc);
                    }
                    seriesList.push(series);
                };
                ElasticResponse.prototype.trimDatapoints = function (aggregations, target) {
                    var histogram = lodash_1.default.find(target.bucketAggs, { type: 'date_histogram' });
                    var shouldDropFirstAndLast = histogram && histogram.settings && histogram.settings.trimEdges;
                    if (shouldDropFirstAndLast) {
                        var trim = histogram.settings.trimEdges;
                        for (var prop in aggregations) {
                            var points = aggregations[prop];
                            if (points.datapoints.length > trim * 2) {
                                points.datapoints = points.datapoints.slice(trim, points.datapoints.length - trim);
                            }
                        }
                    }
                };
                ElasticResponse.prototype.getErrorFromElasticResponse = function (response, err) {
                    var result = {};
                    result.data = JSON.stringify(err, null, 4);
                    if (err.root_cause && err.root_cause.length > 0 && err.root_cause[0].reason) {
                        result.message = err.root_cause[0].reason;
                    }
                    else {
                        result.message = err.reason || 'Unkown elastic error response';
                    }
                    if (response.$$config) {
                        result.config = response.$$config;
                    }
                    return result;
                };
                ElasticResponse.prototype.getTimeSeries = function () {
                    var seriesList = [];
                    for (var i = 0; i < this.response.responses.length; i++) {
                        var response = this.response.responses[i];
                        if (response.error) {
                            throw this.getErrorFromElasticResponse(this.response, response.error);
                        }
                        if (response.hits && response.hits.hits.length > 0) {
                            this.processHits(response.hits, seriesList);
                        }
                        if (response.aggregations) {
                            var aggregations = response.aggregations;
                            var target = this.targets[i];
                            var tmpSeriesList = [];
                            var table = new table_model_1.default();
                            this.processBuckets(aggregations, target, tmpSeriesList, table, {}, 0);
                            this.trimDatapoints(tmpSeriesList, target);
                            this.nameSeries(tmpSeriesList, target);
                            for (var y = 0; y < tmpSeriesList.length; y++) {
                                seriesList.push(tmpSeriesList[y]);
                            }
                            if (table.rows.length > 0) {
                                seriesList.push(table);
                            }
                        }
                    }
                    return { data: seriesList };
                };
                return ElasticResponse;
            }());
            exports_1("ElasticResponse", ElasticResponse);
        }
    };
});
//# sourceMappingURL=elastic_response.js.map