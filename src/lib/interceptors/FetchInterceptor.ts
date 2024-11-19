import NetworkInterceptor from './NetworkInterceptor';

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

      openCallback?.(method, url);

      const headers = init?.headers;
      if (!headers) {
        requestHeaderCallback?.('', '');
      } else {
        switch (true) {
          case headers instanceof Headers:
            for (const [headerKey, headerValue] of headers.entries()) {
              requestHeaderCallback?.(headerKey, headerValue);
            }
            break;
          case Array.isArray(headers):
            for (const [headerKey, headerValue] of headers) {
              requestHeaderCallback?.(headerKey, headerValue);
            }
            break;
          default:
            for (const key in headers) {
              requestHeaderCallback?.(key, headers[key]);
            }
            break;
        }
      }

      sendCallback?.(init);

      const response = await originalFetch.apply(
        this,
        arguments as unknown as Parameters<typeof originalFetch>,
      );

      const contentTypeString = response.headers.get('Content-Type');
      const contentLengthString = response.headers.get('Content-Length');

      let responseContentType: string | undefined;
      let responseSize: number | undefined;
      let responseHeaders: string = '';

      if (contentTypeString)
        responseContentType = contentTypeString.split(';')[0];

      if (contentLengthString) responseSize = parseInt(contentLengthString, 10);

      for (const [headerKey, headerValue] of response.headers.entries()) {
        responseHeaders += `${headerKey}: ${headerValue}\n`;
      }

      headerReceivedCallback?.(
        responseContentType,
        responseSize,
        responseHeaders,
      );

      const clonedResponse = response.clone();

      const isJson = !!clonedResponse.headers
        .get('Content-Type')
        ?.includes('json');

      const responseBody = await (isJson
        ? clonedResponse.json()
        : clonedResponse.text()
      ).catch(() => null);

      responseCallback?.(
        response.status,
        0,
        responseBody,
        response.url,
        response.type,
      );

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
