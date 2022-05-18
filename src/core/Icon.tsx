import React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

const iconsMap = {
  home: require('../assets/home.png'),
  history: require('../assets/history.png'),
  infor: require('../assets/infor.png'),
  close: require('../assets/close.png'),
  star: require('../assets/star.png'),
  heart: require('../assets/heart.png'),
};

export type IconNames = keyof typeof iconsMap;
interface IconProps extends ViewProps {
  containerStyle?: ViewStyle;
  name: IconNames;
  iconStyle?: ImageStyle;
  style?: ImageStyle;
  size?: number;
  color?: string;
}

export const Icon = React.memo((props: IconProps) => {
  const source = iconsMap[props.name];
  return (
    <View style={[styles.containerStyle, props.containerStyle]}>
      <Image
        fadeDuration={0}
        source={source}
        style={[
          styles.iconStyle,
          {
            width: props.size || 20,
            tintColor: props.color,
            height: props.size || 20,
          },
          props.iconStyle,
          props.style,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  containerStyle: { justifyContent: 'center', alignItems: 'center' },
  iconStyle: {
    resizeMode: 'contain',
  },
});
