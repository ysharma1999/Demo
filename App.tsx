


import { enableScreens } from 'react-native-screens';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ErrorBoundary from 'react-native-error-boundary';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import TechNewsApp from './src/screens/TechNewsApp';
import ArticleDetailScreen from './src/screens/ArticleDetails';

enableScreens();
const Stack = createStackNavigator();

const App = () => {



  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={TechNewsApp} />
            <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ headerShown: true, }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  );
};

export default App;
