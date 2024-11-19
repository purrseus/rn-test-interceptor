import NetworkInterceptor from './NetworkInterceptor';

const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;
const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

export default class XHRInterceptor extends NetworkInterceptor {
  static #instance = new XHRInterceptor();

  private constructor() {
    super();
  }

  static getInstance() {
    return XHRInterceptor.#instance;
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

    const isInterceptorEnabled = () => this.isInterceptorEnabled;

    XMLHttpRequest.prototype.open = function (method, url) {
      openCallback?.(method, url);

      originalXHROpen.apply(
        this,
        arguments as unknown as Parameters<typeof originalXHROpen>,
      );
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      requestHeaderCallback?.(header, value);

      originalXHRSetRequestHeader.apply(
        this,
        arguments as unknown as Parameters<typeof originalXHRSetRequestHeader>,
      );
    };

    XMLHttpRequest.prototype.send = function (data) {
      sendCallback?.(data);

      this.addEventListener?.('readystatechange', () => {
        if (!isInterceptorEnabled()) return;

        if (this.readyState === this.HEADERS_RECEIVED) {
          const contentTypeString = this.getResponseHeader('Content-Type');
          const contentLengthString = this.getResponseHeader('Content-Length');

          let responseContentType: string | undefined;
          let responseSize: number | undefined;

          if (contentTypeString)
            responseContentType = contentTypeString.split(';')[0];

          if (contentLengthString)
            responseSize = parseInt(contentLengthString, 10);

          headerReceivedCallback?.(
            responseContentType,
            responseSize,
            this.getAllResponseHeaders(),
          );
        }

        if (this.readyState === this.DONE) {
          responseCallback?.(
            this.status,
            this.timeout,
            this.response,
            this.responseURL,
            this.responseType,
          );
        }
      });

      originalXHRSend.apply(
        this,
        arguments as unknown as Parameters<typeof originalXHRSend>,
      );
    };

    this.isInterceptorEnabled = true;
  }

  disableInterception() {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;


    XMLHttpRequest.prototype.send = originalXHRSend;
    XMLHttpRequest.prototype.open = originalXHROpen;
    XMLHttpRequest.prototype.setRequestHeader = originalXHRSetRequestHeader;

    this.clearCallback();
  }
}
