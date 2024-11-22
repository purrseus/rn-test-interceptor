import { forwardRef, useImperativeHandle, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { useNetworkInterceptor } from '../hooks';
import { hexToHexAlpha } from '../utils';
import { InspectorHeader, NetworkInspectorList } from './components';
import type { RelensInspectorMethods } from '../types';

interface RelensInspectorProps {
  networkInspectorAutoEnabled?: boolean;
}

const RelensInspector = forwardRef<
  RelensInspectorMethods,
  RelensInspectorProps
>(({ networkInspectorAutoEnabled = true }, ref) => {
  const [inspectorVisible, setInspectorVisible] = useState(false);
  const [inspectorPosition, setInspectorPosition] = useState<'top' | 'bottom'>(
    'bottom',
  );

  const { networkRecords, clearAllRecords } = useNetworkInterceptor({
    autoEnabled: networkInspectorAutoEnabled,
  });

  const showInspector = () => {
    setInspectorVisible(true);
  };

  const hideInspector = () => {
    setInspectorVisible(false);
  };

  const moveInspectorToUp = () => {
    setInspectorPosition('top');
  };

  const moveInspectorToDown = () => {
    setInspectorPosition('bottom');
  };

  useImperativeHandle(
    ref,
    () => ({
      show: showInspector,
      hide: hideInspector,
    }),
    [],
  );

  if (!inspectorVisible) return null;

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, { [inspectorPosition]: 0 }]}>
      <InspectorHeader
        hideInspector={hideInspector}
        clearAllRecords={clearAllRecords}
        moveInspectorToUp={moveInspectorToUp}
        moveInspectorToDown={moveInspectorToDown}
      />

      <View style={styles.divider} />

      <NetworkInspectorList data={networkRecords} />
    </SafeAreaView>
  );
});

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    bottom: undefined,
    zIndex: Infinity,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
    height: Math.min(width, height) * 0.75,
  },
  divider: {
    height: 1,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
  },
});

RelensInspector.displayName = 'RelensInspector';
export default RelensInspector;
