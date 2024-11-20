export interface Request {
  type: 'xhr' | 'fetch' | 'websocket';
  method?: string;
  url?: string;
  requestHeaders?: string;
  body?: any;
  responseContentType?: string;
  responseSize?: number;
  responseHeaders?: string;
  status?: number;
  timeout?: number;
  response?: any;
  responseType?: string;
}

export type ID = string | undefined;

export type OpenCallback =
  | ((id: ID, type: Request['type'], method: string, url: string) => void)
  | null;

export type RequestHeaderCallback =
  | ((id: ID, header: string, value: string) => void)
  | null;

export type SendCallback = ((id: ID, data?: any) => void) | null;

export type HeaderReceivedCallback =
  | ((
      id: ID,
      responseContentType: string | undefined,
      responseSize: number | undefined,
      responseHeaders: string,
    ) => void)
  | null;

export type ResponseCallback =
  | ((
      id: ID,
      status: number | undefined,
      timeout: number | undefined,
      response: any,
      responseURL: string | undefined,
      responseType: string | undefined,
    ) => void)
  | null;
