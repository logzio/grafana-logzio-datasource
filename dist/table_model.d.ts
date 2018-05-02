export default class TableModel {
    columns: any[];
    rows: any[];
    type: string;
    columnMap: any;
    constructor();
    sort(options: any): void;
    addColumn(col: any): void;
}
