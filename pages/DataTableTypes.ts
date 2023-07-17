export interface HeaderType {
    field: string;
    label: string;
    sortable: boolean;
  }
  
  export interface DataType {
    id: number;
    timestamp: string;
    mail: string;
    name: string;
    source: string;
    status: string;
    select: boolean;
    [key: string]: any;
  }
  
  export interface DataTableProps {
    sortable: boolean;
    caption: string;
    headers: HeaderType[];
    rows: DataType[];
  }
  