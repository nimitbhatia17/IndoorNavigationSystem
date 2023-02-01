import 'react-native-gesture-handler';
import React from 'react';


import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import Home from 'C:/Projects/App development/IndoorNavigationSystem/src/screens/home.js';
import  Path from 'C:/Projects/App development/IndoorNavigationSystem/src/screens/path';
import NavigationPage from 'C:/Projects/App development/IndoorNavigationSystem/src/screens/navigationPage';
import SearchPage from './src/screens/searchPage';


const Stack = createStackNavigator();
export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SearchPage" component={SearchPage}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Path" component={Path} />
        <Stack.Screen name="NavigationPage" component={NavigationPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}