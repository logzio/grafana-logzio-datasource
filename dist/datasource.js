System.register(["angular", "lodash", "moment", "./query_builder", "./index_pattern", "./elastic_response"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var angular_1, lodash_1, moment_1, query_builder_1, index_pattern_1, elastic_response_1, LogzioDatasource;
    return {
        setters: [
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (query_builder_1_1) {
                query_builder_1 = query_builder_1_1;
            },
            function (index_pattern_1_1) {
                index_pattern_1 = index_pattern_1_1;
            },
            function (elastic_response_1_1) {
                elastic_response_1 = elastic_response_1_1;
            }
        ],
        execute: function () {
            LogzioDatasource = (function () {
                function LogzioDatasource(instanceSettings, $q, backendSrv, templateSrv, timeSrv) {
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.timeSrv = timeSrv;
                    this.basicAuth = instanceSettings.basicAuth;
                    this.withCredentials = instanceSettings.withCredentials;
                    this.url = instanceSettings.url;
                    this.name = instanceSettings.name;
                    this.index = instanceSettings.index;
                    this.timeField = instanceSettings.jsonData.timeField;
                    this.esVersion = instanceSettings.jsonData.esVersion;
                    this.indexPattern = new index_pattern_1.IndexPattern(instanceSettings.index, instanceSettings.jsonData.interval);
                    this.interval = instanceSettings.jsonData.timeInterval;
                    this.maxConcurrentShardRequests =
                        instanceSettings.jsonData.maxConcurrentShardRequests;
                    this.queryBuilder = new query_builder_1.ElasticQueryBuilder({
                        timeField: this.timeField,
                        esVersion: this.esVersion,
                    });
                }
                LogzioDatasource.prototype.request = function (method, url, data) {
                    var routeKey = 'logzio';
                    var options = {
                        url: this.url + "/" + routeKey + "/" + url,
                        method: method,
                        data: data,
                    };
                    return this.backendSrv.datasourceRequest(options);
                };
                LogzioDatasource.prototype.get = function (url) {
                    var range = this.timeSrv.timeRange();
                    var index_list = this.indexPattern.getIndexList(range.from.valueOf(), range.to.valueOf());
                    if (lodash_1.default.isArray(index_list) && index_list.length) {
                        return this.request('GET', index_list[0] + url).then(function (results) {
                            results.data.$$config = results.config;
                            return results.data;
                        });
                    }
                    else {
                        return this.request('GET', this.indexPattern.getIndexForToday() + url).then(function (results) {
                            results.data.$$config = results.config;
                            return results.data;
                        });
                    }
                };
                LogzioDatasource.prototype.post = function (url, data) {
                    return this.request('POST', url, data)
                        .then(function (results) {
                        results.data.$$config = results.config;
                        return results.data;
                    })
                        .catch(function (err) {
                        if (err.data && err.data.error) {
                            throw {
                                message: 'Elasticsearch error: ' + err.data.error.reason,
                                error: err.data.error,
                            };
                        }
                        throw err;
                    });
                };
                LogzioDatasource.prototype.annotationQuery = function (options) {
                    var annotation = options.annotation;
                    var timeField = annotation.timeField || '@timestamp';
                    var queryString = annotation.query || '*';
                    var tagsField = annotation.tagsField || 'tags';
                    var textField = annotation.textField || null;
                    var range = {};
                    range[timeField] = {
                        from: options.range.from.valueOf(),
                        to: options.range.to.valueOf(),
                        format: 'epoch_millis',
                    };
                    var queryInterpolated = this.templateSrv.replace(queryString, {}, 'lucene');
                    var query = {
                        bool: {
                            filter: [
                                { range: range },
                                {
                                    query_string: {
                                        query: queryInterpolated,
                                    },
                                },
                            ],
                        },
                    };
                    var data = {
                        query: query,
                        size: 10000,
                    };
                    if (this.esVersion < 5) {
                        data['fields'] = [timeField, '_source'];
                    }
                    var header = {
                        search_type: 'query_then_fetch',
                        ignore_unavailable: true,
                    };
                    if (annotation.index) {
                        header.index = annotation.index;
                    }
                    else {
                        header.index = this.indexPattern.getIndexList(options.range.from, options.range.to);
                    }
                    var payload = angular_1.default.toJson(header) + '\n' + angular_1.default.toJson(data) + '\n';
                    return this.post('_msearch', payload).then(function (res) {
                        var list = [];
                        var hits = res.responses[0].hits.hits;
                        var getFieldFromSource = function (source, fieldName) {
                            if (!fieldName) {
                                return;
                            }
                            var fieldNames = fieldName.split('.');
                            var fieldValue = source;
                            for (var i = 0; i < fieldNames.length; i++) {
                                fieldValue = fieldValue[fieldNames[i]];
                                if (!fieldValue) {
                                    console.log('could not find field in annotation: ', fieldName);
                                    return '';
                                }
                            }
                            return fieldValue;
                        };
                        for (var i = 0; i < hits.length; i++) {
                            var source = hits[i]._source;
                            var time = getFieldFromSource(source, timeField);
                            if (typeof hits[i].fields !== 'undefined') {
                                var fields = hits[i].fields;
                                if (lodash_1.default.isString(fields[timeField]) || lodash_1.default.isNumber(fields[timeField])) {
                                    time = fields[timeField];
                                }
                            }
                            var event = {
                                annotation: annotation,
                                time: moment_1.default.utc(time).valueOf(),
                                text: getFieldFromSource(source, textField),
                                tags: getFieldFromSource(source, tagsField),
                            };
                            if (annotation.titleField) {
                                var title = getFieldFromSource(source, annotation.titleField);
                                if (title) {
                                    event.text = title + '\n' + event.text;
                                }
                            }
                            if (typeof event.tags === 'string') {
                                event.tags = event.tags.split(',');
                            }
                            list.push(event);
                        }
                        return list;
                    });
                };
                LogzioDatasource.prototype.testDatasource = function () {
                    this.timeSrv.setTime({ from: 'now-1m', to: 'now' }, true);
                    return this.getFields({ type: 'date' }).then(function (dateFields) {
                        var timeField = lodash_1.default.find(dateFields, { text: this.timeField });
                        if (!timeField) {
                            return {
                                status: 'error',
                                message: 'No date field named ' + this.timeField + ' found',
                            };
                        }
                        return { status: 'success', message: 'Index OK. Time field name OK.' };
                    }.bind(this), function (err) {
                        console.log(err);
                        if (err.data && err.data.error) {
                            var message = angular_1.default.toJson(err.data.error);
                            if (err.data.error.reason) {
                                message = err.data.error.reason;
                            }
                            return { status: 'error', message: message };
                        }
                        else {
                            return { status: 'error', message: err.status };
                        }
                    });
                };
                LogzioDatasource.prototype.getQueryHeader = function (searchType, timeFrom, timeTo) {
                    var query_header = {
                        search_type: searchType,
                        ignore_unavailable: true,
                        index: this.indexPattern.getIndexList(timeFrom, timeTo),
                    };
                    if (this.esVersion >= 56) {
                        query_header['max_concurrent_shard_requests'] = this.maxConcurrentShardRequests;
                    }
                    return angular_1.default.toJson(query_header);
                };
                LogzioDatasource.prototype.query = function (options) {
                    var payload = '';
                    var target;
                    var sentTargets = [];
                    var adhocFilters = this.templateSrv.getAdhocFilters(this.name);
                    for (var i = 0; i < options.targets.length; i++) {
                        target = options.targets[i];
                        if (target.hide) {
                            continue;
                        }
                        var queryString = this.templateSrv.replace(target.query || '*', options.scopedVars, 'lucene');
                        var queryObj = this.queryBuilder.build(target, adhocFilters, queryString);
                        var esQuery = angular_1.default.toJson(queryObj);
                        var searchType = queryObj.size === 0 && this.esVersion < 5
                            ? 'count'
                            : 'query_then_fetch';
                        var header = this.getQueryHeader(searchType, options.range.from, options.range.to);
                        payload += header + '\n';
                        payload += esQuery + '\n';
                        sentTargets.push(target);
                    }
                    if (sentTargets.length === 0) {
                        return this.$q.when([]);
                    }
                    payload = payload.replace(/\$timeFrom/g, options.range.from.valueOf());
                    payload = payload.replace(/\$timeTo/g, options.range.to.valueOf());
                    payload = this.templateSrv.replace(payload, options.scopedVars);
                    return this.post('_msearch', payload).then(function (res) {
                        return new elastic_response_1.ElasticResponse(sentTargets, res).getTimeSeries();
                    });
                };
                LogzioDatasource.prototype.getFields = function (query) {
                    return this.get('/_mapping').then(function (result) {
                        if (result.code >= 400) {
                            throw { status: "Logz.io API: " + result.code + " " + result.message };
                        }
                        var typeMap = {
                            float: 'number',
                            double: 'number',
                            integer: 'number',
                            long: 'number',
                            date: 'date',
                            string: 'string',
                            text: 'string',
                            scaled_float: 'number',
                            nested: 'nested',
                        };
                        function shouldAddField(obj, key, query) {
                            if (key[0] === '_') {
                                return false;
                            }
                            if (!query.type) {
                                return true;
                            }
                            return query.type === obj.type || query.type === typeMap[obj.type];
                        }
                        var fieldNameParts = [];
                        var fields = {};
                        function getFieldsRecursively(obj) {
                            for (var key in obj) {
                                var subObj = obj[key];
                                if (lodash_1.default.isObject(subObj.properties)) {
                                    fieldNameParts.push(key);
                                    getFieldsRecursively(subObj.properties);
                                }
                                if (lodash_1.default.isObject(subObj.fields)) {
                                    fieldNameParts.push(key);
                                    getFieldsRecursively(subObj.fields);
                                }
                                if (lodash_1.default.isString(subObj.type)) {
                                    var fieldName = fieldNameParts.concat(key).join('.');
                                    if (shouldAddField(subObj, key, query)) {
                                        fields[fieldName] = {
                                            text: fieldName,
                                            type: subObj.type,
                                        };
                                    }
                                }
                            }
                            fieldNameParts.pop();
                        }
                        for (var indexName in result) {
                            var index = result[indexName];
                            if (index && index.mappings) {
                                var mappings = index.mappings;
                                for (var typeName in mappings) {
                                    var properties = mappings[typeName].properties;
                                    getFieldsRecursively(properties);
                                }
                            }
                        }
                        return lodash_1.default.map(fields, function (value) {
                            return value;
                        });
                    });
                };
                LogzioDatasource.prototype.getTerms = function (queryDef) {
                    var range = this.timeSrv.timeRange();
                    var searchType = this.esVersion >= 5 ? 'query_then_fetch' : 'count';
                    var header = this.getQueryHeader(searchType, range.from, range.to);
                    var esQuery = angular_1.default.toJson(this.queryBuilder.getTermsQuery(queryDef));
                    esQuery = esQuery.replace(/\$timeFrom/g, range.from.valueOf());
                    esQuery = esQuery.replace(/\$timeTo/g, range.to.valueOf());
                    esQuery = header + '\n' + esQuery + '\n';
                    return this.post('_msearch?search_type=' + searchType, esQuery).then(function (res) {
                        if (!res.responses[0].aggregations) {
                            return [];
                        }
                        var buckets = res.responses[0].aggregations['1'].buckets;
                        return lodash_1.default.map(buckets, function (bucket) {
                            return {
                                text: bucket.key_as_string || bucket.key,
                                value: bucket.key,
                            };
                        });
                    });
                };
                LogzioDatasource.prototype.metricFindQuery = function (query) {
                    query = angular_1.default.fromJson(query);
                    if (!query) {
                        return this.$q.when([]);
                    }
                    if (query.find === 'fields') {
                        query.field = this.templateSrv.replace(query.field, {}, 'lucene');
                        return this.getFields(query);
                    }
                    if (query.find === 'terms') {
                        query.query = this.templateSrv.replace(query.query || '*', {}, 'lucene');
                        return this.getTerms(query);
                    }
                };
                LogzioDatasource.prototype.getTagKeys = function () {
                    return this.getFields({});
                };
                LogzioDatasource.prototype.getTagValues = function (options) {
                    return this.getTerms({ field: options.key, query: '*' });
                };
                return LogzioDatasource;
            }());
            exports_1("LogzioDatasource", LogzioDatasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map