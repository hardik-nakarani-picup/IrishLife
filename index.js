/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PicUp from 'react-native-picup';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (Platform.OS === 'android') {
    const {data, from} = remoteMessage;
    if (data?.sender === 'PicUpMobile') {
      PicUp?.MessageReceived(data, from);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
