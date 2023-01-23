/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
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
  FlatList,
  TouchableHighlight,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import {Colors} from 'react-native/Libraries/NewAppScreen';

// import and setup react-native-ble-manager
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

// import stringToBytes from convert-string package.
// this func is useful for making string-to-bytes conversion easier
import {stringToBytes} from 'convert-string';

// import Buffer function.
// this func is useful for making bytes-to-string conversion easier
const Buffer = require('buffer/').Buffer;
var globalImageMode = 0;
var globalShelfChoice = 0;
var globalBookChoice = 0;

const bookShelfArray = [1, 2, 3, 4, 5, 6, 7, 8];

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState([]);
  const peripherals = new Map();
  const [testMode, setTestMode] = useState('read');

  const [imgMode, setImgMode] = useState('0');

  const [bookOpen, setBookOpen] = useState(false);
  const [bookValue, setBookValue] = useState(null);
  const [bookItems, setBookItems] = useState([
    {label: 'Book 1', value: 1},
    {label: 'Book 2', value: 2},
    {label: 'Book 3', value: 3},
    {label: 'Book 4', value: 4},
    {label: 'Book 5', value: 5},
    {label: 'Book 6', value: 6},
    {label: 'Book 7', value: 7},
    {label: 'Book 8', value: 8},
  ]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'WARD 1', value: 1},
    {label: 'WARD 2', value: 2},
    {label: 'WARD 3', value: 3},
    {label: 'WARD 4', value: 4},
    {label: 'WARD 5', value: 5},
    {label: 'WARD 6', value: 6},
    {label: 'WARD 7', value: 7},
    {label: 'WARD 8', value: 8},
  ]);

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
    BleManager.scan([], 10, true)
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
  const handleStopScan = () => {
    console.log('Scan is stopped');
    const discoveredPeripherals = Object.fromEntries(peripherals);

    console.log(discoveredPeripherals);
    console.log(globalImageMode);
    if (globalImageMode === 1) {
      fetch('https://6d8f-203-115-91-38.in.ngrok.io/getLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': 'token-value',
        },
        body: JSON.stringify(discoveredPeripherals),
      })
        .then(resp => resp.json())
        .then(peripheralList => console.log(peripheralList));
    } else if (globalImageMode === 2) {
      fetch('https://6d8f-203-115-91-38.in.ngrok.io/getPath', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': 'token-value',
        },
        body: JSON.stringify({
          ...discoveredPeripherals,
          ChoiceValue: globalShelfChoice,
        }),
      })
        .then(resp => resp.json())
        .then(peripheralList => console.log(peripheralList));
    }
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

  // retrieve connected peripherals.
  // not currenly used
  const retrieveConnectedPeripheral = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      peripherals.clear();
      setList(Array.from(peripherals.values()));

      if (results.length === 0) {
        console.log('No connected peripherals');
      }

      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  // update stored peripherals
  const updatePeripheral = (peripheral, callback) => {
    let p = peripherals.get(peripheral.id);
    if (!p) {
      return;
    }

    p = callback(p);
    peripherals.set(peripheral.id, p);
    setList(Array.from(peripherals.values()));
  };

  // get advertised peripheral local name (if exists). default to peripheral name
  const getPeripheralName = item => {
    if (item.advertising) {
      if (item.advertising.localName) {
        return item.advertising.localName;
      }
    }

    return item.name;
  };

  // connect to peripheral then test the communication
  const connectAndTestPeripheral = peripheral => {
    if (!peripheral) {
      return;
    }

    if (peripheral.connected) {
      BleManager.disconnect(peripheral.id);
      return;
    }

    // connect to selected peripheral
    BleManager.connect(peripheral.id)
      .then(() => {
        //console.log('Connected to ' + peripheral.id, peripheral);
        console.log('Here Here!');
        // update connected attribute
        updatePeripheral(peripheral, p => {
          p.connected = true;
          return p;
        });

        // retrieve peripheral services info
        BleManager.retrieveServices(peripheral.id).then(peripheralInfo => {
          console.log('Retrieved peripheral services', peripheralInfo);

          // test read current peripheral RSSI value
          BleManager.readRSSI(peripheral.id).then(rssi => {
            console.log('Retrieved actual RSSI value', rssi);

            // update rssi value
            updatePeripheral(peripheral, p => {
              p.rssi = rssi;
              return p;
            });
          });

          // test read and write data to peripheral
          // 000ffc0-0451-4000-b000-000000000000
          const serviceUUID = '10000000-0000-0000-0000-000000000001';
          const characteristicUUID = '20000000-0000-0000-0000-000000000001';

          // console.log('peripheral id:', peripheral.id);
          // console.log('service:', serviceUUID);
          // console.log('characteristic:', characteristicUUID);

          switch (testMode) {
            case 'write':
              // ===== test write data
              const payload = 'pizza';
              const payloadBytes = stringToBytes(payload);
              console.log('payload:', payload);

              BleManager.write(
                peripheral.id,
                serviceUUID,
                characteristicUUID,
                payloadBytes,
              )
                .then(res => {
                  console.log('write response', res);
                  alert(
                    `your "${payload}" is stored to the food bank. Thank you!`,
                  );
                })
                .catch(error => {
                  console.log('write err', error);
                });
              break;

            case 'read':
              // ===== test read data
              BleManager.read(peripheral.id, serviceUUID, characteristicUUID)
                .then(res => {
                  console.log('read response', res);
                  if (res) {
                    const buffer = Buffer.from(res);
                    const data = buffer.toString();
                    console.log('data', data);
                    alert(`you have stored food "${data}"`);
                  }
                })
                .catch(error => {
                  console.log('read err', error);
                  alert(error);
                });
              break;

            case 'notify':
              // ===== test subscribe notification
              BleManager.startNotification(
                peripheral.id,
                serviceUUID,
                characteristicUUID,
              ).then(res => {
                console.log('start notification response', res);
              });
              break;

            default:
              break;
          }
        });
      })
      .catch(error => {
        console.log('Connection error', error);
      });
  };

  function handleChoiceChange(e) {
    globalShelfChoice = e;
  }

  function handleBookChoiceChange(e) {
    globalBookChoice = e;
    globalShelfChoice = bookShelfArray[e - 1];
    setValue(globalShelfChoice);
    console.log(globalShelfChoice);
  }

  // mount and onmount event handler
  useEffect(() => {
    console.log('Mount');

    // initialize BLE modules
    BleManager.start({showAlert: false});

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

  // render list of devices
  const renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => connectAndTestPeripheral(item)}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {getPeripheralName(item)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {item.id}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaView}>
        {/* header */}
        <View style={styles.body}>
          <View style={styles.scanButton}>
            <Button
              title={'Find Your Location'}
              onPress={() => {
                globalImageMode = 1;
                startScan();
                setImgMode(globalImageMode);
              }}
            />
          </View>

          {list.length === 0 && (
            <View style={styles.noPeripherals}>
              <Text style={styles.noPeripheralsText}>No peripherals</Text>
            </View>
          )}
        </View>

        {/* ble devices */}
        {/* <FlatList
          data={list}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id}
        /> */}

        <Image
          source={{
            uri:
              imgMode === '0'
                ? 'https://6d8f-203-115-91-38.in.ngrok.io/static/BLEAppMap.png' +
                  '?time' +
                  String(new Date().getTime())
                : 'https://6d8f-203-115-91-38.in.ngrok.io/static/BLEAppMapUpdated.png' +
                  '?time' +
                  String(new Date().getTime()),
          }}
          style={styles.image}
        />

        {/* <DropDownPicker
          placeholder="Which book to find?"
          open={bookOpen}
          value={bookValue}
          items={bookItems}
          setOpen={setBookOpen}
          setValue={setBookValue}
          setItems={setBookItems}
          zIndex={1000}
          onChangeValue={handleBookChoiceChange}
        /> */}

        <DropDownPicker
          placeholder="Where do you want to go?"
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          zIndex={1000}
          onChangeValue={handleChoiceChange}
        />

        <View style={styles.body}>
          <View style={styles.scanButton}>
            <Button
              title={'Get Path'}
              onPress={() => {
                globalImageMode = 2;
                startScan();
                setImgMode(globalImageMode);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
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

export default App;
