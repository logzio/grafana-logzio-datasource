export declare class LogzioConfigCtrl {
    static templateUrl: string;
    current: any;
    constructor();
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
    getSuggestUrls(): string[];
    migrateUrlAndApiKey(instanceSettings: any): void;
}
