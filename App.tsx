import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import Main from './src/navigation/navigationConfig';
import store from './src/store/configStore';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Provider store={store}>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </Provider>
    </View>
  );
};

export default App;
