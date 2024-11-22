export enum NetworkType {
  XHR = 'xhr',
  Fetch = 'fetch',
  WS = 'ws',
}

export type ID = string | undefined;

export interface NetworkRecord {
  status?: number;
}

export type NetworkRecords<T> = Map<NonNullable<ID>, T>;

export interface RelensInspectorMethods {
  show: () => void;
  hide: () => void;
}
