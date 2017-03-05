import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  Platform,
  PermissionsAndroid
} from 'react-native';
import BleManager from 'react-native-ble-manager';

class app extends Component {

    constructor(){
        super()

        this.state = {
            ble: null,
            scanning: false,
            devices: [],
        }
    }

    componentDidMount() {
        BleManager.start({ showAlert: true });
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);

        NativeAppEventEmitter
            .addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
          });
        }
    }

    handleScan() {
        BleManager.scan(['00001101-0000-1000-8000-00805F9B34FB'], 30, false)
            .then((results) => {console.log('Scanning...'); });
        setTimeout(() => {
          BleManager.getDiscoveredPeripherals([])
              .then((peripheralsArray) => {
                // Success code
                console.log('Discovered peripherals: ' + peripheralsArray.length);
                this.setState({
                  devices: peripheralsArray.map(thing => thing.id),
                });
              });
        }, 30000);
    }

    toggleScanning(bool){
        if (bool) {
            this.setState({scanning:true})
            this.scanning = setInterval( ()=> this.handleScan(), 3000);
        } else{
            this.setState({scanning: false, ble: null})
            clearInterval(this.scanning);
        }
    }

    handleDiscoverPeripheral(data){
        console.log('Got ble data', data);
        alert(JSON.stringify(data));
        var devices = this.state.devices;
        devices.push(data.id);
        this.setState({
          devices
        })
        if (data.name == 'HC-06') {
          this.setState({ ble: data })
        }
    }

    render() {

        const container = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        }

        const bleNotice = this.state.scanning
            ? <Text>Scanning {this.state.devices.join(',')}</Text>
            : <Text>Done Scanning {this.state.devices.join(',')}</Text>

        return (
            <View style={container}>
                <TouchableHighlight style={{padding:20, backgroundColor:'#ccc'}} disabled={this.state.scanning} onPress={() => this.toggleScanning(!this.state.scanning) }>
                  <Text>Scan</Text>
                </TouchableHighlight>

                {bleNotice}
            </View>
        );
    }
}
// HC-06

AppRegistry.registerComponent('app', () => app);
