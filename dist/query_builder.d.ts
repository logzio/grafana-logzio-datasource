export declare class ElasticQueryBuilder {
    timeField: string;
    esVersion: number;
    constructor(options: any);
    getRangeFilter(): {};
    buildTermsAgg(aggDef: any, queryNode: any, target: any): any;
    getDateHistogramAgg(aggDef: any): any;
    getHistogramAgg(aggDef: any): any;
    getFiltersAgg(aggDef: any): {};
    documentQuery(query: any, size: any): any;
    addAdhocFilters(query: any, adhocFilters: any): void;
    build(target: any, adhocFilters?: any, queryString?: any): any;
    getTermsQuery(queryDef: any): any;
}
