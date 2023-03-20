import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Lottie from 'lottie-react-native';
export default function AppLoader() {
    return (
            <View style={Styles.container}>
            {/* <Image
              style ={{width: "100%", height:"80%"}}
              source={{ uri : "https://giphy.com/embed/3o7bu3XilJ5BOiSGic"}}
        
            /> */}
            <Lottie source={require('C:/Projects/App development/IndoorNavigationSystem/Assets/loader.json')} autoPlay loop />
          </View>

    )
}

const Styles = StyleSheet.create({
    container :{
        alignContent:'center',
        margin:25,
        zIndex:10000
    }
})