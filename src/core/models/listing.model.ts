export interface SortingModel {
  direction: 'asc' | 'desc';
  sort: string;
}

export interface FilterModel {
  field: string;
  op: string;
  value: string | number;
}

export interface PaginationModel {
  offset: number;
  limit: number;
}
