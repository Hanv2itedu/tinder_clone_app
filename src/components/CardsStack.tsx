import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Status, User } from '../types/users';
import { TinderCard } from './TinderCard';

const STATUS_COLORS = {
  [Status.LIKED]: 'green',
  [Status.NOPED]: 'red',
  [Status.SUPPER_LIKED]: 'blue',
};

const ROTATION = 60;

type Context = Record<string, number>;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CardsStackProps {
  currentProfile?: User | null;
  nextProfile?: User | null;
  onSwipe: (status: Status) => void;
  onViewDetailPress: () => void;
}

const CardsStack = (props: CardsStackProps) => {
  const { onSwipe, currentProfile, nextProfile, onViewDetailPress } = props;
  const [cardHeight, setCardHeight] = useState(0);

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
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
        translateY: translateY.value,
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
      translateY.value = event.translationY;
      startY.value = context.startY;
    },
    onEnd: event => {
      if (translateY.value < -0.8 * cardHeight) {
        translateY.value = withSpring(
          -screenHeight * 2,
          {},
          () => (startY.value = 0),
        );
        onSwipe && runOnJS(onSwipe)(Status.SUPPER_LIKED);
      } else if (Math.abs(translateX.value) > 0.5 * screenWidth) {
        translateY.value = withTiming(0, {
          duration: 100,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        translateX.value = withSpring(
          hiddenTranslateX * Math.sign(event.velocityX),
          {},
          () => (startY.value = 0),
        );
        onSwipe &&
          runOnJS(onSwipe)(event.velocityX < 0 ? Status.NOPED : Status.LIKED);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0, {}, () => (startY.value = 0));
      }
    },
  });

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [currentProfile, translateX, translateY]);

  const onMeasureLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  };

  const currentStatus = currentProfile?.status;

  const renderStatus = (status: Status) => {
    return (
      <Text
        style={[
          styles.status,
          {
            color: STATUS_COLORS[status],
            borderColor: STATUS_COLORS[status],
          },
          currentStatus === Status.NOPED ? styles.nopeStyle : styles.yesStyle,
        ]}>
        {currentStatus}
      </Text>
    );
  };

  return (
    <>
      <View style={styles.root}>
        {nextProfile && (
          <View style={styles.nextCardContainer}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
              <TinderCard
                data={nextProfile}
                onViewDetailPress={onViewDetailPress}
              />
            </Animated.View>
          </View>
        )}

        {currentProfile && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={[styles.animatedCard, cardStyle]}
              onLayout={onMeasureLayout}>
              <TinderCard
                data={currentProfile}
                onViewDetailPress={onViewDetailPress}
              />
              {currentStatus && renderStatus(currentStatus)}
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
  status: {
    fontSize: 30,
    borderRadius: 10,
    borderWidth: 3,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 20,
  },
  nopeStyle: { transform: [{ rotate: '-15deg' }], left: 10 },
  yesStyle: { transform: [{ rotate: '15deg' }], right: 10 },
});

export default CardsStack;
