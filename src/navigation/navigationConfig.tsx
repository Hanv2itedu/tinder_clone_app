import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import History from '../screens/History';
import Home from '../screens/Home';
import { TabBar } from './NavigationComponents';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions: StackNavigationOptions = {
  cardShadowEnabled: false,
  cardOverlayEnabled: true,
  cardStyle: {
    shadowOpacity: 0,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 0,
    elevation: 0,
    backgroundColor: '#fff',
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  headerTitleStyle: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  headerStyle: {
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTransparent: false,
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
};
const stackProps = {
  mode: 'card' as any,
  screenOptions,
};

const Tabs = () => {
  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      tabBar={(props: JSX.IntrinsicAttributes & BottomTabBarProps) => (
        <TabBar {...props} />
      )}
      initialRouteName="HomeTab">
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="HistoryTab" component={History} />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Main" {...stackProps}>
      <Stack.Screen
        name="Main"
        component={Tabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
