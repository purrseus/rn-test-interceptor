export enum NetworkType {
  XHR = 'xhr',
  Fetch = 'fetch',
  Websocket = 'websocket',
}

export type ID = string | undefined;

export interface NetworkRecord {
  type: NetworkType;
}
