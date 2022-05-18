import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import Main from './src/navigation/navigationConfig';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </View>
  );
};

export default App;
