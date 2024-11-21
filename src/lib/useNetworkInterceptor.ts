import { enableMapSet } from 'immer';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { NETWORK_INSPECTOR_REQUEST_HEADER } from './constants';
import FetchInterceptor from './interceptors/FetchInterceptor';
import WebSocketInterceptor from './interceptors/WebSocketInterceptor';
import XHRInterceptor from './interceptors/XHRInterceptor';
import {
  NetworkType,
  type HttpHeaderReceivedCallback,
  type HttpOpenCallback,
  type HttpRecord,
  type HttpRequestHeaderCallback,
  type HttpResponseCallback,
  type HttpSendCallback,
  type ID,
  type WebSocketCloseCallback,
  type WebSocketConnectCallback,
  type WebSocketOnCloseCallback,
  type WebSocketOnErrorCallback,
  type WebSocketOnMessageCallback,
  type WebSocketOnOpenCallback,
  type WebSocketRecord,
  type WebSocketSendCallback,
} from './types';
import { createHeaderLine } from './utils';

interface AppInterceptorParams {
  autoEnabled?: boolean;
}

type CommonRecord = HttpRecord | WebSocketRecord;
type NetworkRecords<T> = Map<NonNullable<ID>, T>;

enableMapSet();

export default function useNetworkInterceptor(params?: AppInterceptorParams) {
  const { autoEnabled = true } = params || {};

  const [records, setRecords] = useImmer<NetworkRecords<CommonRecord>>(
    new Map(),
  );

  const clearAllRecords = () => {
    setRecords(new Map());
  };

  const isInterceptorEnabled = () =>
    XHRInterceptor.instance.isInterceptorEnabled &&
    FetchInterceptor.instance.isInterceptorEnabled &&
    WebSocketInterceptor.instance.isInterceptorEnabled;

  const enableHttpInterceptions = useCallback(() => {
    const openCallback: HttpOpenCallback = (id, type, method, url) => {
      if (!id) return;

      setRecords((draft: NetworkRecords<HttpRecord>) => {
        draft.set(id, { type, method, url });
      });
    };

    const requestHeaderCallback: HttpRequestHeaderCallback = (
      id,
      header,
      value,
    ) => {
      if (!id) return;

      setRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        const currentHeaderLine = createHeaderLine(header, value);

        const fetchRequestHeaderLineRegex = RegExp(
          createHeaderLine(NETWORK_INSPECTOR_REQUEST_HEADER, NetworkType.Fetch),
          'gi',
        );

        const isFetchInXHR =
          draft.get(id)!.type === NetworkType.XHR &&
          !!currentHeaderLine.match(fetchRequestHeaderLineRegex);

        if (isFetchInXHR) {
          draft.delete(id);
        } else {
          draft.get(id)!.requestHeaders ??= '';
          draft.get(id)!.requestHeaders += currentHeaderLine;
        }
      });
    };

    const sendCallback: HttpSendCallback = (id, data) => {
      if (!id) return;

      setRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.body = data;
      });
    };

    const headerReceivedCallback: HttpHeaderReceivedCallback = (
      id,
      responseContentType,
      responseSize,
      responseHeaders,
    ) => {
      if (!id) return;

      setRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.responseContentType = responseContentType;
        draft.get(id)!.responseSize = responseSize;
        draft.get(id)!.responseHeaders = responseHeaders;
      });
    };

    const responseCallback: HttpResponseCallback = (
      id,
      status,
      timeout,
      response,
      responseURL,
      responseType,
    ) => {
      if (!id) return;

      setRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.status = status;
        draft.get(id)!.timeout = timeout;
        draft.get(id)!.response = response;
        draft.get(id)!.url = responseURL;
        draft.get(id)!.responseType = responseType;
      });
    };

    XHRInterceptor.instance
      .setOpenCallback(openCallback)
      .setRequestHeaderCallback(requestHeaderCallback)
      .setSendCallback(sendCallback)
      .setHeaderReceivedCallback(headerReceivedCallback)
      .setResponseCallback(responseCallback)
      .enableInterception();

    FetchInterceptor.instance
      .setOpenCallback(openCallback)
      .setRequestHeaderCallback(requestHeaderCallback)
      .setSendCallback(sendCallback)
      .setHeaderReceivedCallback(headerReceivedCallback)
      .setResponseCallback(responseCallback)
      .enableInterception();
  }, [setRecords]);

  const enableWebSocketInterception = useCallback(() => {
    const connectCallback: WebSocketConnectCallback = () => {};
    const sendCallback: WebSocketSendCallback = () => {};
    const closeCallback: WebSocketCloseCallback = () => {};
    const onOpenCallback: WebSocketOnOpenCallback = () => {};
    const onMessageCallback: WebSocketOnMessageCallback = () => {};
    const onErrorCallback: WebSocketOnErrorCallback = () => {};
    const onCloseCallback: WebSocketOnCloseCallback = () => {};

    WebSocketInterceptor.instance
      .setConnectCallback(connectCallback)
      .setSendCallback(sendCallback)
      .setCloseCallback(closeCallback)
      .setOnOpenCallback(onOpenCallback)
      .setOnMessageCallback(onMessageCallback)
      .setOnErrorCallback(onErrorCallback)
      .setOnCloseCallback(onCloseCallback)
      .enableInterception();
  }, []);

  const enableInterception = useCallback(() => {
    if (isInterceptorEnabled()) return;

    enableHttpInterceptions();
    enableWebSocketInterception();
  }, [enableHttpInterceptions, enableWebSocketInterception]);

  const disableInterception = useCallback(() => {
    if (!isInterceptorEnabled()) return;

    XHRInterceptor.instance.disableInterception();
    FetchInterceptor.instance.disableInterception();
    WebSocketInterceptor.instance.disableInterception();
  }, []);

  useEffect(() => {
    if (autoEnabled) enableInterception();

    if (autoEnabled) return disableInterception;
  }, [autoEnabled, disableInterception, enableInterception]);

  return {
    isInterceptorEnabled,
    enableInterception,
    disableInterception,
    clearAllRecords,
    records,
  };
}
