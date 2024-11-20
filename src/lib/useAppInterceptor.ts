import { enableMapSet } from 'immer';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import type {
  HeaderReceivedCallback,
  ID,
  OpenCallback,
  Request,
  RequestHeaderCallback,
  ResponseCallback,
  SendCallback,
} from './core/types';
import FetchInterceptor from './interceptors/FetchInterceptor';
import XHRInterceptor from './interceptors/XHRInterceptor';
import { createHeaderLine } from './utils';

interface AppInterceptorParams {
  autoEnabled?: boolean;
}

enableMapSet();

const xhrInterceptor = XHRInterceptor.getInstance();
const fetchInterceptor = FetchInterceptor.getInstance();

export default function useAppInterceptor(params?: AppInterceptorParams) {
  const { autoEnabled = true } = params || {};

  const [requests, setRequests] = useImmer<Map<NonNullable<ID>, Request>>(
    new Map(),
  );

  const isInterceptorEnabled = () =>
    xhrInterceptor.isInterceptorEnabled &&
    fetchInterceptor.isInterceptorEnabled;

  const enableInterceptions = useCallback(() => {
    if (isInterceptorEnabled()) return;

    const openCallback: OpenCallback = (id, type, method, url) => {
      if (!id) return;

      setRequests(draft => {
        draft.set(id, { type, method, url });
      });
    };

    const requestHeaderCallback: RequestHeaderCallback = (
      id,
      header,
      value,
    ) => {
      if (!id) return;

      setRequests(draft => {
        if (!draft.get(id)) return draft;
        draft.get(id)!.requestHeaders ??= '';
        draft.get(id)!.requestHeaders += createHeaderLine(header, value);
      });
    };

    const sendCallback: SendCallback = (id, data) => {
      if (!id) return;

      setRequests(draft => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.body = data;
      });
    };

    const headerReceivedCallback: HeaderReceivedCallback = (
      id,
      responseContentType,
      responseSize,
      responseHeaders,
    ) => {
      if (!id) return;

      setRequests(draft => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.responseContentType = responseContentType;
        draft.get(id)!.responseSize = responseSize;
        draft.get(id)!.responseHeaders = responseHeaders;
      });
    };

    const responseCallback: ResponseCallback = (
      id,
      status,
      timeout,
      response,
      responseURL,
      responseType,
    ) => {
      if (!id) return;

      setRequests(draft => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.status = status;
        draft.get(id)!.timeout = timeout;
        draft.get(id)!.response = response;
        draft.get(id)!.url = responseURL;
        draft.get(id)!.responseType = responseType;
      });
    };

    xhrInterceptor
      .setOpenCallback(openCallback)
      .setRequestHeaderCallback(requestHeaderCallback)
      .setSendCallback(sendCallback)
      .setHeaderReceivedCallback(headerReceivedCallback)
      .setResponseCallback(responseCallback)
      .enableInterception();

    fetchInterceptor
      .setOpenCallback(openCallback)
      .setRequestHeaderCallback(requestHeaderCallback)
      .setSendCallback(sendCallback)
      .setHeaderReceivedCallback(headerReceivedCallback)
      .setResponseCallback(responseCallback)
      .enableInterception();
  }, [setRequests]);

  const disableInterceptions = useCallback(() => {
    if (!isInterceptorEnabled()) return;

    xhrInterceptor.disableInterception();
    fetchInterceptor.disableInterception();
  }, []);

  useEffect(() => {
    if (autoEnabled) enableInterceptions();

    if (autoEnabled) return disableInterceptions;
  }, [autoEnabled, disableInterceptions, enableInterceptions]);

  return {
    isInterceptorEnabled,
    enableInterceptions,
    disableInterceptions,
    requests,
  };
}
