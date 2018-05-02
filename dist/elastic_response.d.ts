export declare class ElasticResponse {
    private targets;
    private response;
    constructor(targets: any, response: any);
    processMetrics(esAgg: any, target: any, seriesList: any, props: any): void;
    processAggregationDocs(esAgg: any, aggDef: any, target: any, table: any, props: any): void;
    processBuckets(aggs: any, target: any, seriesList: any, table: any, props: any, depth: any): void;
    private getMetricName(metric);
    private getSeriesName(series, target, metricTypeCount);
    nameSeries(seriesList: any, target: any): void;
    processHits(hits: any, seriesList: any): void;
    trimDatapoints(aggregations: any, target: any): void;
    getErrorFromElasticResponse(response: any, err: any): any;
    getTimeSeries(): {
        data: any[];
    };
}
