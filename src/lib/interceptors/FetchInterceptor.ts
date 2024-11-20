import 'react-native-get-random-values';

import { nanoid } from 'nanoid';
import NetworkInterceptor from './NetworkInterceptor';
import { createHeaderLine } from '../utils';

const originalFetch = global.fetch;

export default class FetchInterceptor extends NetworkInterceptor {
  static #instance = new FetchInterceptor();

  private constructor() {
    super();
  }

  static getInstance() {
    return FetchInterceptor.#instance;
  }

  enableInterception() {
    if (this.isInterceptorEnabled) return;

    const {
      openCallback,
      requestHeaderCallback,
      sendCallback,
      headerReceivedCallback,
      responseCallback,
    } = this.getCallbacks();

    global.fetch = async function (input, init) {
      const interceptionId = nanoid();

      //#region open
      const method = init?.method ?? 'GET';

      let url: string;

      switch (true) {
        case input instanceof Request:
          url = input.url;
          break;
        case input instanceof URL:
          url = input.href;
          break;
        default:
          url = input;
      }

      openCallback?.(interceptionId, 'fetch', method, url);
      //#endregion

      //#region requestHeader
      const headers = init?.headers;
      if (headers) {
        switch (true) {
          case headers instanceof Headers:
            for (const [headerKey, headerValue] of headers.entries()) {
              requestHeaderCallback?.(interceptionId, headerKey, headerValue);
            }
            break;
          case Array.isArray(headers):
            for (const [headerKey, headerValue] of headers) {
              requestHeaderCallback?.(interceptionId, headerKey, headerValue);
            }
            break;
          default:
            for (const key in headers) {
              requestHeaderCallback?.(interceptionId, key, headers[key]);
            }
            break;
        }
      }
      //#endregion

      //#region send
      sendCallback?.(interceptionId, init?.body ?? null);
      //#endregion

      const response = await originalFetch.apply(
        this,
        arguments as unknown as Parameters<typeof originalFetch>,
      );

      const clonedResponse = response.clone();
      const clonedResponseHeaders = clonedResponse.headers;

      //#region headerReceived
      const contentTypeString = clonedResponseHeaders.get('Content-Type');
      const contentLengthString = clonedResponseHeaders.get('Content-Length');

      let responseContentType: string | undefined;
      let responseSize: number | undefined;
      let responseHeaders: string = '';

      if (contentTypeString)
        responseContentType = contentTypeString.split(';')[0];

      if (contentLengthString) responseSize = parseInt(contentLengthString, 10);

      for (const [headerKey, headerValue] of clonedResponseHeaders.entries()) {
        responseHeaders += createHeaderLine(headerKey, headerValue);
      }

      headerReceivedCallback?.(
        interceptionId,
        responseContentType,
        responseSize,
        responseHeaders,
      );
      //#endregion

      //#region response
      const responseBody: string | null = await clonedResponse.text().catch(() => null);

      responseCallback?.(
        interceptionId,
        clonedResponse.status,
        0,
        responseBody,
        clonedResponse.url,
        clonedResponse.type,
      );
      //#endregion

      return response;
    };

    this.isInterceptorEnabled = true;
  }

  disableInterception() {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    global.fetch = originalFetch;

    this.clearCallback();
  }
}
