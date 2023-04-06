import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PicUp from 'react-native-picup';
import {Platform, ToastAndroid} from 'react-native';

export const useFirebaseListener = () => {
  useEffect(() => {
    const unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the frontend!', remoteMessage);
      ToastAndroid.showWithGravity(
        'demo app service fcm received a message',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      if (Platform.OS === 'android') {
        const {data, from} = remoteMessage;
        if (data?.sender === 'PicUpMobile') {
          PicUp?.MessageReceived(data, from);
        }
      }
    });

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      console.log('onTokenRefresh frontend!', token);
      if (Platform.OS === 'android') {
        PicUp?.FcmOnNewToken();
      }
    });

    (async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('fcmToken frontend!', fcmToken);
      }
    })();

    return () => {
      unsubscribeMessaging();
      unsubscribeTokenRefresh();
    };
  }, []);
};
