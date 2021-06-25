export interface RowSelectionI {
    fixed: boolean | undefined;
    // onChange?: (
    //     selectedRowKeys: string[] | number[],
    //     selectedRows: Object[]
    // ) => any;
}
export interface ColumnPropsI {
    title: string | undefined;
    dataIndex: string | undefined;
    key: string | number | undefined;
    width: number | undefined;
    sorter: boolean | undefined;
    slots: { customRender: string } | undefined
}

export interface TablePropsI {
    dataSource: any[] | undefined;
    columns: ColumnPropsI[] | undefined;
    rowKey: string;
}
