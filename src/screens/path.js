import React from "react";
import { Colors } from 'react-native/Libraries/NewAppScreen';

import {
    SafeAreaView,
    StyleSheet,
    View,
    StatusBar,
    Button,
    Image,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";


const ngrokUrl = 'bbcf-14-139-234-179.in';

export default function Path() {
    const navigation = useNavigation();

function navigateToNavigationPage(){
    navigation.navigate("NavigationPage")
}
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeAreaView}>
                <Image
                    source={{
                        uri:
                            'https://' + ngrokUrl + '.ngrok.io/static/FloorMapUpdated.png' +
                            '?time' +
                            String(new Date().getTime()),
                    }}
                    style={styles.image}
                />
                <View style={styles.body}>
                    <View style={styles.scanButton}>

                        <Button
                            title={'Start'}
                            onPress={() => {
                                navigateToNavigationPage();
                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    body: {
        backgroundColor: Colors.white,
    },
    scanButton: {
        margin: 10,
    },
    noPeripherals: {
        flex: 1,
        margin: 20,
    },
    noPeripheralsText: {
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
        marginTop: 70,
    },
    footerButton: {
        alignSelf: 'stretch',
        padding: 10,
        backgroundColor: 'grey',
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
});