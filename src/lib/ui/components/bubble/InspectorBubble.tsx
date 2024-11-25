import { useContext, useRef } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { hexToHexAlpha } from '../../../utils';
import RelensInspectorContext from '../../contexts/RelensInspectorContext';

interface InspectorBubbleProps {
  bubbleSize: number;
}

export default function InspectorBubble({ bubbleSize }: InspectorBubbleProps) {
  const { width, height } = useWindowDimensions();
  const verticalSafeValue = height / 8;
  const { setInspectorVisibility } = useContext(RelensInspectorContext)!;

  const pan = useRef(
    new Animated.ValueXY({ x: 0, y: verticalSafeValue }),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // @ts-ignore
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.moveX === 0 && gesture.moveY === 0) {
          showInspectorPanel();
          return;
        }

        pan.flattenOffset();

        const finalX =
          gesture.moveX < (width - bubbleSize) / 2 ? 0 : width - bubbleSize;

        const finalY = Math.min(
          Math.max(verticalSafeValue, gesture.moveY),
          height - verticalSafeValue - bubbleSize,
        );

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const showInspectorPanel = () => {
    setInspectorVisibility('panel');
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.bubble,
        {
          width: bubbleSize,
          height: bubbleSize,
          borderRadius: bubbleSize / 2,
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <Image
        source={require('../../../assets/code.png')}
        style={{
          width: bubbleSize * 0.75,
          height: bubbleSize * 0.75,
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: hexToHexAlpha('#000000', 0.25),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
