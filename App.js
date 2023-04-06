/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {useState} from 'react';
import type {Node} from 'react';
import PicUp from 'react-native-picup';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SettingsScreen from './src/screens/settingsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegistrationScreen from './src/screens/registerScreen';
// import {useFirebaseListener} from './src/helper/useFirebaseListener';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [appStatus, setAppStatus] = useState('loading');
  const [permissions, setPermissionsStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  // useFirebaseListener();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  AsyncStorage.getItem('registered').then(res => {
    console.log('registered: ', res);
    console.log('appStatus: ', appStatus);
    console.log('permissions: ', permissions);
    if (res === 'registered' && appStatus !== 'settings' && !permissions) {
      SetPermissons();
      setLoading(true);
      AsyncStorage.getItem('user').then(userString => {
        const user = JSON.parse(userString);
        PicUp.PicUpRegister(user.name, user.phone, user.code, user.secure)
          .then(value => {
            AsyncStorage.setItem('registered', 'registered').then(() => {
              // SetPermissons();
              setAppStatus('settings');
            });
            // if(value.ALREADY_REGISTERED === true){
            //     alert('You already registered');
            // }
            console.log('PicUpRegister:');
            console.log(value);
            setLoading(false);
          })
          .catch(reason => {
            alert(reason.message);

            setLoading(false);
            console.log('Catch');
            console.log(reason);
          });
      });
    } else if (appStatus === 'loading') {
      setAppStatus('registration');
    }
  });

  const SetPermissons = function () {
    setPermissionsStatus(true);
    console.log('start SetPermissons');
    const PermissionsJson = {
      'opt-in': {
        enable: true,
      },
      CallScreening: {
        enable: true,
        name: 'CallScreening',
      },
      otherPermissions: [
        {enable: true, name: 'ReadPhoneState'},
        {enable: true, name: 'ReadCallLogs'},
        {enable: true, name: 'WriteContacts'},
      ],
      drawPermission: {
        enable: true,
        name: 'DrawOverlays',
        askOrder: 'Last',
        explanation: {
          message: '',
          enable: true,
        },
      },
    };

    PicUp.setPermissions(JSON.stringify(PermissionsJson))
      .then(value => {
        console.log('setPermissions:', value);
        console.log('setPermissions:', value.Permissions_set_success);
        if (!value.Permissions_set_success) {
          // SetPermissons();
        }
        console.log(value);
      })
      .catch(reason => {
        console.log('catch', reason);
        // SetPermissons();
      });

    // RNDrawOverlay.askForDispalayOverOtherAppsPermission()
    //     .then(res => {
    //         // res will be true if permission was granted
    //     })
    //     .catch(e => {
    //         // permission was declined
    //     });
    // PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,PermissionsAndroid.PERMISSIONS.CALL_PHONE]);
  };

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    },
  });
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        {loading && <Text style={styles.text}>Loading ...</Text>}
        {!loading &&
          ((appStatus === 'settings' && (
            <SettingsScreen setAppStatus={setAppStatus} />
          )) ||
            (appStatus === 'registration' && (
              <RegistrationScreen
                setAppStatus={setAppStatus}
                SetPermissons={SetPermissons}
              />
            )))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
