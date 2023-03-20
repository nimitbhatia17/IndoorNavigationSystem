import 'react-native-gesture-handler';
import React from 'react';


import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import Home from 'C:/Projects/App development/IndoorNavigationSystem/src/screens/home.js';
import Path from 'C:/Projects/App development/IndoorNavigationSystem/src/screens/path';
import NavigationPage from 'C:/Projects/App development/IndoorNavigationSystem/src/screens/navigationPage';
import SearchPage from './src/screens/searchPage';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';


const Stack = createStackNavigator();
// import LocationEnabler from 'react-native-location-enabler';


// const {
//   PRIORITIES: { HIGH_ACCURACY },
//   useLocationSettings,
// } = LocationEnabler


const App = () => {
  // const [enabled, requestResolution] = useLocationSettings(
  //   {
  //     priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
  //     alwaysShow: true, // default false
  //     needBle: true, // default false
  //   },
  //   false /* optional: default undefined */,
  // )
  // const {
  //   PRIORITIES: { HIGH_ACCURACY },
  //   addListener,
  //   checkSettings,
  //   requestResolutionSettings
  // } = LocationEnabler

  // const listener = addListener(({ locationEnabled }) =>
  //   console.log(`Location are ${locationEnabled ? 'enabled' : 'disabled'}`)
  // );

  // // Define configuration
  // const config = {
  //   priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
  //   alwaysShow: true, // default false
  //   needBle: false, // default false
  // };

  function componentDidMount() {

    // checkSettings(config);
    // requestResolutionSettings(config);
    // listener.remove();
    BluetoothStateManager.getState().then((bluetoothState) => {
      switch (bluetoothState) {
        case 'Unknown':
        case 'Resetting':
        case 'Unsupported':
        case 'Unauthorized':
        case 'PoweredOff':
          {
            BluetoothStateManager.enable();
            break;
          }
        case 'PoweredOn':
          {
            console.log("Powered ON");
            break;
          }
        default:
          break;
      }
    });
  }
  return (
    <>
      {componentDidMount()}
      {/* <View>
        {!enabled && (
          <Button
            onPress={requestResolution}
            title="Request Resolution Location Settings"
          />
        )}
      </View> */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SearchPage" component={SearchPage} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Path" component={Path} />
          <Stack.Screen name="NavigationPage" component={NavigationPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
export default App;