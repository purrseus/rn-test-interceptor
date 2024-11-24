import { createRef, useImperativeHandle, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants';
import { useNetworkInterceptor } from '../hooks';
import { hexToHexAlpha } from '../utils';
import {
  InspectorBubble,
  InspectorHeader,
  NetworkInspectorList,
} from './components';

interface RelensInspectorMethods {
  show: () => void;
  hide: () => void;
}

interface RelensInspectorProps {
  networkInspectorAutoEnabled?: boolean;
  bubbleSize?: number;
}

const rootRef = createRef<RelensInspectorMethods>();

const RelensInspectorComponent = ({
  networkInspectorAutoEnabled = false,
  bubbleSize = 40,
}: RelensInspectorProps) => {
  const [inspectorVisible, setInspectorVisible] = useState<
    'invisible' | 'bubble' | 'panel'
  >('invisible');

  const [inspectorPosition, setInspectorPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );

  const {
    networkRecords,
    clearAllRecords,
    enableInterception,
    disableInterception,
    isInterceptorEnabled,
  } = useNetworkInterceptor({
    autoEnabled: networkInspectorAutoEnabled,
  });

  const hideInspectorPanel = () => {
    setInspectorVisible('bubble');
  };

  const showInspectorPanel = () => {
    setInspectorVisible('panel');
  };

  const toggleNetworkInterception = () => {
    isInterceptorEnabled ? disableInterception() : enableInterception();
  };

  const toggleInspectorPosition = () => {
    setInspectorPosition(prevState =>
      prevState === 'bottom' ? 'top' : 'bottom',
    );
  };

  useImperativeHandle(
    rootRef,
    () => ({
      show: () => {
        setInspectorVisible('bubble');
      },
      hide: () => {
        setInspectorVisible('invisible');
      },
    }),
    [],
  );

  if (inspectorVisible === 'invisible') return null;

  if (inspectorVisible === 'bubble') {
    return (
      <View style={styles.bubbleBackdrop}>
        <InspectorBubble
          bubbleSize={bubbleSize}
          showInspectorPanel={showInspectorPanel}
        />
      </View>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, { [inspectorPosition]: 0 }]}>
      <InspectorHeader
        hideInspectorPanel={hideInspectorPanel}
        isInterceptorEnabled={isInterceptorEnabled}
        toggleNetworkInterception={toggleNetworkInterception}
        clearAllRecords={clearAllRecords}
        toggleInspectorPosition={toggleInspectorPosition}
      />

      <NetworkInspectorList data={networkRecords} />
    </SafeAreaView>
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
