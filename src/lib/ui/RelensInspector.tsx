import { createRef, useImperativeHandle, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants';
import { useLogInterceptor, useNetworkInterceptor } from '../hooks';
import { hexToHexAlpha } from '../utils';
import {
  InspectorBubble,
  InspectorHeader,
  LogInspectorList,
  NetworkInspectorList,
} from './components';
import type {
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
} from '../types';
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
        // eslint-disable-next-line react-native/no-inline-styles
        <SafeAreaView style={[styles.container, { [inspectorPosition]: 0 }]}>
          <InspectorHeader />

          {panelSelected === 'network' ? <NetworkInspectorList /> : <LogInspectorList />}
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
    height: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.75,
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
