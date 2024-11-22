import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkInterceptor } from '../hooks';
import { hexToHexAlpha } from '../utils';
import { InspectorHeader, NetworkInspectorList } from './components';

export interface RelensInspectorMethods {
  show: () => void;
  hide: () => void;
}

interface RelensInspectorProps {
  networkInspectorAutoEnabled?: boolean;
}

type Edge = 'Top' | 'Bottom';

const RelensInspector = forwardRef<
  RelensInspectorMethods,
  RelensInspectorProps
>(({ networkInspectorAutoEnabled = true }, ref) => {
  const edgeInsets = useSafeAreaInsets();
  const [inspectorVisible, setInspectorVisible] = useState(false);
  const [inspectorPosition, setInspectorPosition] = useState<Edge>('Bottom');

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
    setInspectorPosition('Top');
  };

  const moveInspectorToDown = () => {
    setInspectorPosition('Bottom');
  };

  useImperativeHandle(
    ref,
    () => ({
      show: showInspector,
      hide: hideInspector,
    }),
    [],
  );

  const positionStyle = useMemo(() => {
    const edge = inspectorPosition.toLowerCase() as Lowercase<Edge>;

    return {
      paddingLeft: edgeInsets.left,
      paddingRight: edgeInsets.right,
      [`padding${inspectorPosition}`]: edgeInsets[edge],
      [edge]: 0,
    };
  }, [edgeInsets, inspectorPosition]);

  if (!inspectorVisible) return null;

  return (
    <View style={[styles.container, positionStyle]}>
      <InspectorHeader
        hideInspector={hideInspector}
        clearAllRecords={clearAllRecords}
        moveInspectorToUp={moveInspectorToUp}
        moveInspectorToDown={moveInspectorToDown}
      />

      <NetworkInspectorList data={networkRecords} />
    </View>
  );
});

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    bottom: undefined,
    zIndex: 9999,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
    height: Math.min(width, height) * 0.75,
  },
});

RelensInspector.displayName = 'RelensInspector';
export default RelensInspector;
