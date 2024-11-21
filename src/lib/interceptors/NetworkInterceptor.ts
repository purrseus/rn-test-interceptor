export abstract class NetworkInterceptor {
  isInterceptorEnabled = false;

  protected abstract getCallbacks(): any;
  protected abstract clearCallbacks(): void;

  abstract enableInterception(): void;
  abstract disableInterception(): void;
}
