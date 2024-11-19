export default abstract class NetworkInterceptor {
  isInterceptorEnabled = false;

  protected openCallback: ((method: string, url: string) => void) | null = null;

  protected requestHeaderCallback:
    | ((header: string, value: string) => void)
    | null = null;

  protected sendCallback: ((data?: any) => void) | null = null;

  protected headerReceivedCallback:
    | ((
        responseContentType: string | undefined,
        responseSize: number | undefined,
        responseHeaders: string,
      ) => void)
    | null = null;

  protected responseCallback:
    | ((
        status: number | undefined,
        timeout: number | undefined,
        response: any,
        responseURL: string | undefined,
        responseType: string | undefined,
      ) => void)
    | null = null;

  setOpenCallback(callback: typeof this.openCallback) {
    this.openCallback = callback;
    return this;
  }

  setSendCallback(callback: typeof this.sendCallback) {
    this.sendCallback = callback;
    return this;
  }

  setHeaderReceivedCallback(callback: typeof this.headerReceivedCallback) {
    this.headerReceivedCallback = callback;
    return this;
  }

  setResponseCallback(callback: typeof this.responseCallback) {
    this.responseCallback = callback;
    return this;
  }

  setRequestHeaderCallback(callback: typeof this.requestHeaderCallback) {
    this.requestHeaderCallback = callback;
    return this;
  }

  protected getCallbacks() {
    const openCallback = this.openCallback?.bind(this);
    const requestHeaderCallback = this.requestHeaderCallback?.bind(this);
    const sendCallback = this.sendCallback?.bind(this);
    const headerReceivedCallback = this.headerReceivedCallback?.bind(this);
    const responseCallback = this.responseCallback?.bind(this);

    return {
      openCallback,
      requestHeaderCallback,
      sendCallback,
      headerReceivedCallback,
      responseCallback,
    };
  }

  protected clearCallback() {
    this.openCallback = null;
    this.requestHeaderCallback = null;
    this.responseCallback = null;
    this.sendCallback = null;
    this.headerReceivedCallback = null;
  }

  abstract enableInterception(): void;
  abstract disableInterception(): void;
}
