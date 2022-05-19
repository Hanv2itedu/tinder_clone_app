import React, { useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { User } from '../types/users';

const ROTATION = 60;

type Context = Record<string, number>;
const { width: screenWidth } = Dimensions.get('window');

interface CardsStackProps {
  currentProfile?: User | null;
  nextProfile?: User | null;
  onSwipe: (isLeft: boolean) => void;
  renderItem: Function;
}

const CardsStack = (props: CardsStackProps) => {
  const { renderItem, onSwipe, currentProfile, nextProfile } = props;
  const [cardHeight, setCardHeight] = useState(0);

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);
  const startY = useSharedValue(0);

  const rotate = useDerivedValue(() => {
    return (
      interpolate(
        translateX.value,
        [0, hiddenTranslateX],
        [0, ROTATION * Math.sign(startY.value > cardHeight / 2 ? -1 : 1)],
      ) + 'deg'
    );
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-screenWidth, 0, screenWidth],
      [0.4, 1, 0.4],
    ),
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.9, 1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.8, 1],
    ),
  }));

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (event, context: Context) => {
      context.startX = 0;
      context.startY = event.y;
      startY.value = event.y;
    },
    onActive: (event, context: Context) => {
      translateX.value = context.startX + event.translationX;
      startY.value = context.startY;
    },
    onEnd: event => {
      if (translateX.value > 0.5 * screenWidth) {
        translateX.value = withSpring(
          hiddenTranslateX * Math.sign(event.velocityX),
          {},
          () => (startY.value = 0),
        );
        onSwipe && runOnJS(onSwipe)(event.velocityX < 0);
        return;
      } else {
        translateX.value = withSpring(0, {}, () => (startY.value = 0));
        return;
      }
    },
  });

  useEffect(() => {
    translateX.value = 0;
  }, [currentProfile, translateX]);

  const onMeasureLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  };

  return (
    <>
      <View style={styles.root}>
        {nextProfile && (
          <View style={styles.nextCardContainer}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
              {renderItem({ item: nextProfile })}
            </Animated.View>
          </View>
        )}

        {currentProfile && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={[styles.animatedCard, cardStyle]}
              onLayout={onMeasureLayout}>
              {renderItem({ item: currentProfile })}
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  animatedCard: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGr: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default CardsStack;
