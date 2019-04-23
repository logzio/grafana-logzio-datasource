export declare class LogzioConfigCtrl {
    static templateUrl: string;
    current: any;
    constructor($scope: any);
    indexPatternTypes: ({
        name: string;
        value: any;
        example?: undefined;
    } | {
        name: string;
        value: string;
        example: string;
    })[];
    esVersions: {
        name: string;
        value: number;
    }[];
    indexPatternTypeChanged(): void;
    addHeader(): void;
    removeHeader($index: any): void;
    getSuggestUrls(): string[];
}
