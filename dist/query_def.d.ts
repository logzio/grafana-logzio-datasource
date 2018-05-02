export declare const metricAggTypes: ({
    text: string;
    value: string;
    requiresField: boolean;
    supportsInlineScript?: undefined;
    supportsMissing?: undefined;
    isPipelineAgg?: undefined;
    minVersion?: undefined;
} | {
    text: string;
    value: string;
    requiresField: boolean;
    supportsInlineScript: boolean;
    supportsMissing: boolean;
    isPipelineAgg?: undefined;
    minVersion?: undefined;
} | {
    text: string;
    value: string;
    requiresField: boolean;
    supportsMissing: boolean;
    supportsInlineScript?: undefined;
    isPipelineAgg?: undefined;
    minVersion?: undefined;
} | {
    text: string;
    value: string;
    requiresField: boolean;
    isPipelineAgg: boolean;
    minVersion: number;
    supportsInlineScript?: undefined;
    supportsMissing?: undefined;
})[];
export declare const bucketAggTypes: ({
    text: string;
    value: string;
    requiresField: boolean;
} | {
    text: string;
    value: string;
    requiresField?: undefined;
})[];
export declare const orderByOptions: {
    text: string;
    value: string;
}[];
export declare const orderOptions: {
    text: string;
    value: string;
}[];
export declare const sizeOptions: {
    text: string;
    value: string;
}[];
export declare const extendedStats: {
    text: string;
    value: string;
}[];
export declare const intervalOptions: {
    text: string;
    value: string;
}[];
export declare const movingAvgModelOptions: {
    text: string;
    value: string;
}[];
export declare const pipelineOptions: {
    moving_avg: ({
        text: string;
        default: number;
    } | {
        text: string;
        default: string;
    } | {
        text: string;
        default: boolean;
    })[];
    derivative: {
        text: string;
        default: any;
    }[];
};
export declare const movingAvgModelSettings: {
    simple: any[];
    linear: any[];
    ewma: {
        text: string;
        value: string;
        default: any;
    }[];
    holt: {
        text: string;
        value: string;
        default: any;
    }[];
    holt_winters: ({
        text: string;
        value: string;
        default: any;
        isCheckbox?: undefined;
    } | {
        text: string;
        value: string;
        default: any;
        isCheckbox: boolean;
    })[];
};
export declare function getMetricAggTypes(esVersion: any): any;
export declare function getPipelineOptions(metric: any): any;
export declare function isPipelineAgg(metricType: any): boolean;
export declare function getPipelineAggOptions(targets: any): any[];
export declare function getMovingAvgSettings(model: any, filtered: any): any;
export declare function getOrderByOptions(target: any): {
    text: string;
    value: string;
}[];
export declare function describeOrder(order: any): any;
export declare function describeMetric(metric: any): string;
export declare function describeOrderBy(orderBy: any, target: any): any;
