import { createRef, useImperativeHandle, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLogInterceptor, useNetworkInterceptor } from '../hooks';
import type {
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
} from '../types';
import { hexToHexAlpha } from '../utils';
import {
  InspectorBubble,
  InspectorHeader,
  LogInspectorList,
  NetworkInspectorList,
} from './components';
import RelensInspectorContext from './contexts/RelensInspectorContext';

interface RelensInspectorMethods {
  show: () => void;
  hide: () => void;
}

interface RelensInspectorProps {
  networkInspectorAutoEnabled?: boolean;
  logInspectorAutoEnabled?: boolean;
  bubbleSize?: number;
}

const rootRef = createRef<RelensInspectorMethods>();

const RelensInspectorComponent = ({
  networkInspectorAutoEnabled = false,
  logInspectorAutoEnabled = false,
  bubbleSize = 40,
}: RelensInspectorProps) => {
  const { width, height } = useWindowDimensions();

  const [inspectorVisibility, setInspectorVisibility] =
    useState<InspectorVisibility>('hidden');

  const [inspectorPosition, setInspectorPosition] =
    useState<InspectorPosition>('bottom');

  const [panelSelected, setPanelSelected] = useState<InspectorPanel>('network');

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

          {panelSelected === 'network' ? (
            <NetworkInspectorList />
          ) : (
            <LogInspectorList />
          )}
        </SafeAreaView>
      );
      break;
    default:
      content = null;
  }

  return (
    <RelensInspectorContext.Provider
      value={{
        inspectorVisibility,
        setInspectorVisibility,
        inspectorPosition,
        setInspectorPosition,
        panelSelected,
        setPanelSelected,
        networkInterceptor,
        logInterceptor,
      }}
    >
      {content}
    </RelensInspectorContext.Provider>
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

RelensInspectorComponent.displayName = 'RelensInspector';

const RelensInspector = {
  show() {
    rootRef.current?.show();
  },
  hide() {
    rootRef.current?.hide();
  },
  Component: RelensInspectorComponent,
};

export default RelensInspector;
