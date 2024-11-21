import type {
  WebSocketCloseCallback,
  WebSocketConnectCallback,
  WebSocketOnCloseCallback,
  WebSocketOnErrorCallback,
  WebSocketOnMessageCallback,
  WebSocketOnOpenCallback,
  WebSocketSendCallback,
} from '../types';
import { NetworkInterceptor } from './NetworkInterceptor';

export default class WebSocketInterceptor extends NetworkInterceptor {
  static instance = new WebSocketInterceptor();

  private constructor() {
    super();
  }

  protected connectCallback: WebSocketConnectCallback = null;
  protected sendCallback: WebSocketSendCallback = null;
  protected closeCallback: WebSocketCloseCallback = null;
  protected onOpenCallback: WebSocketOnOpenCallback = null;
  protected onMessageCallback: WebSocketOnMessageCallback = null;
  protected onErrorCallback: WebSocketOnErrorCallback = null;
  protected onCloseCallback: WebSocketOnCloseCallback = null;

  setConnectCallback(callback: typeof this.connectCallback) {
    this.connectCallback = callback;
    return this;
  }

  setSendCallback(callback: typeof this.sendCallback) {
    this.sendCallback = callback;
    return this;
  }

  setCloseCallback(callback: typeof this.closeCallback) {
    this.closeCallback = callback;
    return this;
  }

  setOnOpenCallback(callback: typeof this.onOpenCallback) {
    this.onOpenCallback = callback;
    return this;
  }

  setOnMessageCallback(callback: typeof this.onMessageCallback) {
    this.onMessageCallback = callback;
    return this;
  }

  setOnErrorCallback(callback: typeof this.onErrorCallback) {
    this.onErrorCallback = callback;
    return this;
  }

  setOnCloseCallback(callback: typeof this.onCloseCallback) {
    this.onCloseCallback = callback;
    return this;
  }

  protected getCallbacks() {
    const connectCallback = this.connectCallback?.bind(this);
    const sendCallback = this.sendCallback?.bind(this);
    const closeCallback = this.closeCallback?.bind(this);
    const setOnOpenCallback = this.setOnOpenCallback?.bind(this);
    const setOnMessageCallback = this.setOnMessageCallback?.bind(this);
    const setOnErrorCallback = this.setOnErrorCallback?.bind(this);
    const setOnCloseCallback = this.setOnCloseCallback?.bind(this);

    return {
      connectCallback,
      sendCallback,
      closeCallback,
      setOnOpenCallback,
      setOnMessageCallback,
      setOnErrorCallback,
      setOnCloseCallback,
    };
  }

  protected clearCallbacks(): void {
    this.connectCallback = null;
    this.sendCallback = null;
    this.closeCallback = null;
    this.onOpenCallback = null;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
    this.onCloseCallback = null;
  }

  enableInterception(): void {
    if (this.isInterceptorEnabled) return;

    // const {
    //   connectCallback,
    //   sendCallback,
    //   closeCallback,
    //   setOnOpenCallback,
    //   setOnMessageCallback,
    //   setOnErrorCallback,
    //   setOnCloseCallback,
    // } = this.getCallbacks();

    // Implement here

    this.isInterceptorEnabled = true;
  }

  disableInterception(): void {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    // Implement here

    this.clearCallbacks();
  }
}
