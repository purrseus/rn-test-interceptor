import { useCallback } from 'react';
import FetchInterceptor from './interceptors/FetchInterceptor';
import XHRInterceptor from './interceptors/XHRInterceptor';

const xhrInterceptor = XHRInterceptor.getInstance();
const fetchInterceptor = FetchInterceptor.getInstance();

export default function useAppInspector() {
  // const [requests, setRequests] = useState();

  const isInterceptorEnabled = () =>
    xhrInterceptor.isInterceptorEnabled &&
    fetchInterceptor.isInterceptorEnabled;

  const enableInterceptions = useCallback(() => {
    xhrInterceptor
      .setOpenCallback((method, url) => {
        console.log('setOpenCallback', { method, url });
      })
      .setRequestHeaderCallback((header, value) => {
        console.log('setRequestHeaderCallback', { header, value });
      })
      .setSendCallback(data => {
        console.log('setSendCallback', { data });
      })
      .setHeaderReceivedCallback(
        (responseContentType, responseSize, responseHeaders) => {
          console.log('setHeaderReceivedCallback', {
            responseContentType,
            responseSize,
            responseHeaders,
          });
        },
      )
      .setResponseCallback(
        (status, timeout, response, responseURL, responseType) => {
          console.log('setResponseCallback', {
            status,
            timeout,
            response,
            responseURL,
            responseType,
          });
        },
      )
      .enableInterception();

    fetchInterceptor.enableInterception();
  }, []);

  const disableInterceptions = useCallback(() => {
    xhrInterceptor.disableInterception();
    fetchInterceptor.disableInterception();
  }, []);

  return { isInterceptorEnabled, enableInterceptions, disableInterceptions };
}
