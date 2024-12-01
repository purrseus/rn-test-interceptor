import { useRef, useState, type JSX } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import {
  NetworkType,
  type HttpRecord,
  type NetworkTab,
  type WebSocketRecord,
} from '../../../types';
import {
  formatMethod,
  formatStatusCode,
  hexToHexAlpha,
  limitChar,
} from '../../../utils';
import NetworkDetailsHeader from '../header/NetworkDetailsHeader';
import NetworkDetailsItem from '../items/NetworkDetailsItem';

interface NetworkDetailsProps {
  item: HttpRecord | WebSocketRecord;
}

export default function NetworkDetails({ item }: NetworkDetailsProps) {
  const [selectedTab, setSelectedTab] = useState<NetworkTab>('headers');

  const isWebSocket = item.type === NetworkType.WS;

  const url = new URL(isWebSocket ? item.uri : item.url);

  const headerShown = (isWebSocket ? 'uri' : 'url') in item;
  const queryStringParametersShown = !!url.search;
  const bodyShown = !isWebSocket && !!item.body;
  const responseShown = !isWebSocket && !!item.response;
  const messagesShown = isWebSocket && !!item.messages;

  const content = useRef<Record<NetworkTab, JSX.Element | null>>({
    headers: null,
    queryStringParameters: null,
    body: null,
    response: null,
    messages: null,
  });

  if (headerShown && !content.current.headers) {
    content.current.headers = (
      <>
        <NetworkDetailsItem label="Request Type" content={item.type} />

        <NetworkDetailsItem
          label="Request URL"
          content={isWebSocket ? item.uri : item.url}
        />

        <NetworkDetailsItem
          label="Request Method"
          content={formatMethod(isWebSocket ? undefined : item.method)}
        />

        <NetworkDetailsItem
          label="Status Code"
          content={formatStatusCode(item.status)}
        />

        {isWebSocket && (
          <NetworkDetailsItem
            label="Headers"
            content={limitChar(item.options?.headers)}
          />
        )}

        {!isWebSocket && (
          <NetworkDetailsItem
            label="Response Headers"
            content={item.responseHeaders}
          />
        )}

        {!isWebSocket && (
          <NetworkDetailsItem
            label="Request Headers"
            content={item.requestHeaders}
          />
        )}
      </>
    );
  }

  if (queryStringParametersShown && !content.current.queryStringParameters) {
    const queryStringParameters: Record<'name' | 'value', string>[] = [];

    url.searchParams.forEach((value, name) => {
      queryStringParameters.push({ name, value });
    });

    content.current.queryStringParameters = (
      <>
        {queryStringParameters.map(({ name, value }, index) => (
          <NetworkDetailsItem key={index} label={name} content={value} />
        ))}
      </>
    );
  }

  if (bodyShown && !content.current.body) {
    content.current.body = (
      <>
        <NetworkDetailsItem content={limitChar(item.body)} />
      </>
    );
  }

  if (responseShown && !content.current.response) {
    content.current.response = (
      <>
        <NetworkDetailsItem content={limitChar(item.response)} />
      </>
    );
  }

  if (messagesShown && !content.current.messages) {
    content.current.messages = (
      <>
        <NetworkDetailsItem content={item.messages} />
      </>
    );
  }

  return (
    <>
      <NetworkDetailsHeader
        selectedTab={selectedTab}
        onChangeTab={setSelectedTab}
        headersShown={headerShown}
        queryStringParametersShown={queryStringParametersShown}
        bodyShown={bodyShown}
        responseShown={responseShown}
        messagesShown={messagesShown}
      />
      <ScrollView style={styles.container}>
        {content.current[selectedTab]}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
  },
  text: {
    fontSize: 14,
    color: '#000000',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
});
