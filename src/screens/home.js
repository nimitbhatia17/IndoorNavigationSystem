import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Button,
    Platform,
    PermissionsAndroid,
    Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import DropDownPicker from 'react-native-dropdown-picker';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppLoader from '../../components/AppLoader.js';

// import and setup react-native-ble-manager
import BleManager from 'react-native-ble-manager';

// import { NGROK_URL } from "react-native-dotenv";
import { NGROK_URL } from '../../key.js';

const ngrokUrl = NGROK_URL;


const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);


// import Buffer function.
// this func is useful for making bytes-to-string conversion easier
const Buffer = require('buffer/').Buffer;
var globalImgMode = 0;
var globalShelfChoice = 0;

const Home = ({ route }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [list, setList] = useState([]);
    const peripherals = new Map();

    const [imgMode, setImgMode] = useState('0');
    const [showLoader, setShowLoader] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'WARD 1', value: 1 },
        { label: 'WARD 2', value: 2 },
        { label: 'WARD 3', value: 3 },
        { label: 'WARD 4', value: 4 },
        { label: 'WARD 5', value: 5 },
        { label: 'WARD 6', value: 6 },
        { label: 'WARD 7', value: 7 },
        { label: 'WARD 8', value: 8 },
    ]);
    const navigation = useNavigation();

    // start to scan peripherals
    const startScan = () => {
        console.log('In start Scan');
        // skip if scan process is currenly happening
        if (isScanning) {
            console.log('Already Scanning...');
            return;
        }
        // first, clear existing peripherals
        peripherals.clear();
        setList(Array.from(peripherals.values()));

        // then re-scan it
        BleManager.scan([], 15, true)
            .then(() => {
                console.log('Scanning...');
                setIsScanning(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    // handle discovered peripheral
    const handleDiscoverPeripheral = peripheral => {
        console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }

        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
    };

    // handle stop scan event
    const handleStopScan = async() => {
        setShowLoader(true);
        console.log('Scan is stopped');
        const discoveredPeripherals = Object.fromEntries(peripherals);
        console.log(discoveredPeripherals);
        if (globalImgMode === 1) {
            await fetch('https://' + ngrokUrl + '.ngrok.io/getLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': 'token-value',
                },
                body: JSON.stringify(discoveredPeripherals),
            })
                .then(resp => resp.json())
                .then(peripheralList => console.log(peripheralList));
        }
        else if (globalImgMode === 2) {
           await fetch('https://' + ngrokUrl + '.ngrok.io/getPath', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': 'token-value',
                },
                body: JSON.stringify({
                    ...discoveredPeripherals,
                    ChoiceValue: route.params.bookList.rack_number,
                }),
            })
                .then(resp => resp.json())
                .then(peripheralList => console.log(peripheralList));
        }
        console.log("setting show loader to false")
        setShowLoader(false);
        setIsScanning(false);
    };

    // handle disconnected peripheral
    const handleDisconnectedPeripheral = data => {
        console.log('Disconnected from ' + data.peripheral);

        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
    };

    // handle update value for characteristic
    const handleUpdateValueForCharacteristic = data => {
        console.log('In Update Value for characteristic');
        // console.log(
        //   'Received data from: ' + data.peripheral,
        //   'Characteristic: ' + data.characteristic,
        //   'Data: ' + data.value,
        // );
    };



    function handleChoiceChange(e) {
        globalShelfChoice = e;
    }
    function navigateToPath() {
        navigation.navigate("Path");

    }

    // mount and onmount event handler
    useEffect(() => {
        console.log('Mount');

        // initialize BLE modules
        BleManager.start({ showAlert: false });

        // add ble listeners on mount
        bleEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleDiscoverPeripheral,
        );
        bleEmitter.addListener('BleManagerStopScan', handleStopScan);
        bleEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            handleDisconnectedPeripheral,
        );
        bleEmitter.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            handleUpdateValueForCharacteristic,
        );

        // check location permission only for android device
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(r1 => {
                if (r1) {
                    console.log('Permission is OK');
                    return;
                }

                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ).then(r2 => {
                    if (r2) {
                        console.log('User accept');
                        return;
                    }

                    console.log('User refuse');
                });
            });
        }

        // remove ble listeners on unmount
        return () => {
            console.log('Unmount');

            bleEmitter.removeListener(
                'BleManagerDiscoverPeripheral',
                handleDiscoverPeripheral,
            );
            bleEmitter.removeListener('BleManagerStopScan', handleStopScan);
            bleEmitter.removeListener(
                'BleManagerDisconnectPeripheral',
                handleDisconnectedPeripheral,
            );
            bleEmitter.removeListener(
                'BleManagerDidUpdateValueForCharacteristic',
                handleUpdateValueForCharacteristic,
            );
        };
    }, []);


    return (
        showLoader ? (<AppLoader />) : <>

            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeAreaView}>
                {/* header */}
                <View style={styles.body}>
                    <View style={styles.scanButton}>
                        <Button
                            title={'Find Your Location'}
                            onPress={() => {
                                globalImgMode = 1;
                                setShowLoader(true);
                                startScan();
                                setImgMode(globalImgMode);
                            }}
                        />
                    </View>

                    {/* {list.length === 0 && (
                        <View style={styles.noPeripherals}>
                            <Text style={styles.noPeripheralsText}>No peripherals</Text>
                        </View>
                    )} */}
                </View>

                <Image
                    source={{
                        uri:
                            imgMode === '0'
                                ? 'https://' + ngrokUrl + '.ngrok.io/static/PULibraryMap.png' +
                                '?time' +
                                String(new Date().getTime())
                                : 'https://' + ngrokUrl + '.ngrok.io/static/PULibraryMapUpdated.png' +
                                '?time' +
                                String(new Date().getTime()),
                    }}
                    style={styles.image}
                />


                {/* <DropDownPicker
                    placeholder="Where do you want to go?"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    zIndex={1000}
                    onChangeValue={handleChoiceChange}
                /> */}
                <View style={styles.body}>

                    <View style={styles.scanButton}>

                        <Button
                            title={'Get Path'}
                            onPress={() => {
                                globalImgMode = 2
                                startScan();
                                setImgMode(globalImgMode);
                                navigateToPath()
                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>

            {/* </>} */}
        </>
    );
};

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

export default Home;
