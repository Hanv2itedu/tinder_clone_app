import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '../core/Icon';

interface TabBarButtonProps {
  width: number | string;
  tintColor: string;
  iconName: string;
  onPress: () => void;
}

const TabBarButton = ({
  width,
  tintColor,
  iconName,
  onPress,
}: TabBarButtonProps) => {
  return (
    <TouchableOpacity style={{ width }} onPress={onPress}>
      <View style={styles.tabIcon}>
        <View style={styles.icon}>
          <Icon name={iconName as any} size={25} color={tintColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const activeTintColor = 'red';
const inactiveTintColor = 'grey';
export const TabBar = ({ navigation, state }: BottomTabBarProps) => {
  const { routes } = state;
  const renderTab = (
    route: { key: string | null | undefined; name: any },
    index: number,
  ) => {
    const focused = index === state.index;
    const _press = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route?.key || '',
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return;
      }
      if (!focused) {
        navigation.navigate(route.name);
      }
    };

    let icon = index === 0 ? 'home' : 'history';

    const tintColor = focused ? activeTintColor : inactiveTintColor;
    return (
      <View key={route.key}>
        <TabBarButton
          tintColor={tintColor}
          iconName={icon}
          width={'100%'}
          onPress={_press}
        />
      </View>
    );
  };
  return (
    <View style={styles.tabBarContainer}>
      {routes && routes.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 52,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    // paddingBottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'grey',
  },
  tabIcon: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 45,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
