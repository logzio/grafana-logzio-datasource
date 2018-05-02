/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class LogzioQueryCtrl extends QueryCtrl {
    private $rootScope;
    private uiSegmentSrv;
    static templateUrl: string;
    esVersion: any;
    rawQueryOld: string;
    constructor($scope: any, $injector: any, $rootScope: any, uiSegmentSrv: any);
    getFields(type: any): any;
    queryUpdated(): void;
    getCollapsedText(): string;
    handleQueryError(err: any): any[];
}
