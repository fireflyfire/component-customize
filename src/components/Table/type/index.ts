export interface RowSelectionI {
  fixed?: boolean;
  onChange?: (
    selectedRowKeys: string[] | number[]
    // selectedRows: Object[]
  ) => any;
  selectedRowKeys?: any[];
}
export interface ColumnPropsI {
  title: string;
  key: string | number;
  dataIndex?: string;
  width?: number;
  sorter?: boolean;
  slots?: {
    title?: string;
    customRender?: string;
  };
  fixed?: "left" | "right";
}
