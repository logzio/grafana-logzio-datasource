System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment_1, intervalMap, IndexPattern;
    return {
        setters: [
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }
        ],
        execute: function () {
            intervalMap = {
                Hourly: { startOf: 'hour', amount: 'hours' },
                Daily: { startOf: 'day', amount: 'days' },
                Weekly: { startOf: 'isoWeek', amount: 'weeks' },
                Monthly: { startOf: 'month', amount: 'months' },
                Yearly: { startOf: 'year', amount: 'years' },
            };
            IndexPattern = (function () {
                function IndexPattern(pattern, interval) {
                    this.pattern = pattern;
                    this.interval = interval;
                }
                IndexPattern.prototype.getIndexForToday = function () {
                    if (this.interval) {
                        return moment_1.default.utc().format(this.pattern);
                    }
                    else {
                        return this.pattern;
                    }
                };
                IndexPattern.prototype.getIndexList = function (from, to) {
                    if (!this.interval) {
                        return this.pattern;
                    }
                    var intervalInfo = intervalMap[this.interval];
                    var start = moment_1.default(from)
                        .utc()
                        .startOf(intervalInfo.startOf);
                    var endEpoch = moment_1.default(to)
                        .utc()
                        .startOf(intervalInfo.startOf)
                        .valueOf();
                    var indexList = [];
                    while (start.valueOf() <= endEpoch) {
                        indexList.push(start.format(this.pattern));
                        start.add(1, intervalInfo.amount);
                    }
                    return indexList;
                };
                return IndexPattern;
            }());
            exports_1("IndexPattern", IndexPattern);
        }
    };
});
//# sourceMappingURL=index_pattern.js.map