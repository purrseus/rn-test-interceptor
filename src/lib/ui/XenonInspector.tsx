import { createRef, useImperativeHandle, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLogInterceptor, useNetworkInterceptor } from '../hooks';
import type {
  HttpRecord,
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
  LogRecord,
  WebSocketRecord,
} from '../types';
import { hexToHexAlpha } from '../utils';
import {
  InspectorBubble,
  InspectorDetails,
  InspectorHeader,
  LogInspectorList,
  NetworkInspectorList,
} from './components';
import XenonInspectorContext from './contexts/XenonInspectorContext';

interface XenonInspectorMethods {
  show: () => void;
  hide: () => void;
}

interface XenonInspectorProps {
  networkInspectorAutoEnabled?: boolean;
  logInspectorAutoEnabled?: boolean;
  bubbleSize?: number;
}

const rootRef = createRef<XenonInspectorMethods>();

const XenonInspectorComponent = ({
  networkInspectorAutoEnabled = false,
  logInspectorAutoEnabled = false,
  bubbleSize = 40,
}: XenonInspectorProps) => {
  const { width, height } = useWindowDimensions();

  const detailsData = useRef<Partial<
    Record<InspectorPanel, LogRecord | HttpRecord | WebSocketRecord>
  > | null>(null);

  const [inspectorVisibility, setInspectorVisibility] =
    useState<InspectorVisibility>('hidden');

  const [inspectorPosition, setInspectorPosition] =
    useState<InspectorPosition>('bottom');

  const [panelSelected, setPanelSelected] = useState<InspectorPanel | null>(
    'network',
  );

  const networkInterceptor = useNetworkInterceptor({
    autoEnabled: networkInspectorAutoEnabled,
  });

  const logInterceptor = useLogInterceptor({
    autoEnabled: logInspectorAutoEnabled,
  });

  useImperativeHandle(
    rootRef,
    () => ({
      show: () => {
        setInspectorVisibility('bubble');
      },
      hide: () => {
        setInspectorVisibility('hidden');
      },
    }),
    [],
  );

  let content;

  switch (inspectorVisibility) {
    case 'bubble':
      content = (
        <View style={styles.bubbleBackdrop}>
          <InspectorBubble bubbleSize={bubbleSize} />
        </View>
      );
      break;
    case 'panel':
      content = (
        <SafeAreaView
          style={[
            styles.container,
            // eslint-disable-next-line react-native/no-inline-styles
            { [inspectorPosition]: 0, height: Math.min(width, height) * 0.75 },
          ]}
        >
          <InspectorHeader />

          {panelSelected === 'network' && <NetworkInspectorList />}
          {panelSelected === 'log' && <LogInspectorList />}

          {!panelSelected && !!detailsData.current && <InspectorDetails />}
        </SafeAreaView>
      );
      break;
    default:
      content = null;
  }

  return (
    <XenonInspectorContext.Provider
      value={{
        inspectorVisibility,
        setInspectorVisibility,
        inspectorPosition,
        setInspectorPosition,
        panelSelected,
        setPanelSelected,
        networkInterceptor,
        logInterceptor,
        detailsData,
      }}
    >
      {content}
    </XenonInspectorContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    bottom: undefined,
    zIndex: 9999,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
  },
  bubbleBackdrop: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
});

XenonInspectorComponent.displayName = 'XenonInspector';

const XenonInspector = {
  show() {
    rootRef.current?.show();
  },
  hide() {
    rootRef.current?.hide();
  },
  Component: XenonInspectorComponent,
};

export default XenonInspector;
