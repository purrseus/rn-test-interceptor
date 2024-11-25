import { useContext, useRef } from 'react';
import { Animated, Image, PanResponder, StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants';
import { hexToHexAlpha } from '../../../utils';
import RelensInspectorContext from '../../contexts/RelensInspectorContext';

interface InspectorBubbleProps {
  bubbleSize: number;
}

const SAFE_HEIGHT_VALUE = SCREEN_HEIGHT / 8;

export default function InspectorBubble({ bubbleSize }: InspectorBubbleProps) {
  const { setInspectorVisibility } = useContext(RelensInspectorContext)!;

  const pan = useRef(
    new Animated.ValueXY({ x: 0, y: SAFE_HEIGHT_VALUE }),
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
          gesture.moveX < (SCREEN_WIDTH - bubbleSize) / 2
            ? 0
            : SCREEN_WIDTH - bubbleSize;

        const finalY = Math.min(
          Math.max(SAFE_HEIGHT_VALUE, gesture.moveY),
          SCREEN_HEIGHT - SAFE_HEIGHT_VALUE - bubbleSize,
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
