import { Button, StyleSheet, Text, useColorScheme, View, Platform, Clipboard, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useEffect } from "react";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import PicUp from 'react-native-picup';
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Input } from "react-native-elements";

export default function SettingsScreen(props) {
    const isDarkMode = useColorScheme() === 'dark';
    const [firstLoad, setFirstLoad] = useState(true);
    const [token, setToken] = useState('');
    const [publicKey, setPublicKey] = useState(PicUp.getImageSigningPublicKey());
    const styles = StyleSheet.create({
        text: {
            color: isDarkMode ? Colors.lighter : Colors.darker,
            textAlign: 'center',
            marginHorizontal: 15,
        },
        textInput: {
            color: isDarkMode ? Colors.lighter : Colors.darker,
            borderBottomColor: '#f00'
        },
    });
    const { setAppStatus } = props;

    const [serviceStatus, setServiceStatus] = useState(PicUp.isServiceEnabled());
    const [permissionMode, setPermissionMode] = useState(PicUp.getPermissionMode());
    const [externalPhoneStateOption, setExternalPhoneStateOption] = useState(PicUp.isExternalPhoneStateEnabled());

    const switchServiiceStatus = function () {
        if (PicUp.isServiceEnabled() === true) {
            PicUp.disableService().then(() => {
                setServiceStatus(PicUp.isServiceEnabled());
            });
        } else {
            PicUp.enableService().then(() => {
                setServiceStatus(PicUp.isServiceEnabled());
            });
        }
    }

    const switchPermiossionMode = function () {
        if (PicUp.getPermissionMode() === 'Internal') {
            PicUp.setPermissionExternalMode().then(() => {
                setPermissionMode(PicUp.getPermissionMode());
            });
        } else {
            PicUp.setPermissionInternalMode().then(() => {
                setPermissionMode(PicUp.getPermissionMode());
            });
        }
    }

    const switchExternalPhoneStateOption = function () {
        PicUp.setExternalPhoneStateOption(!externalPhoneStateOption).then(() => {
            setExternalPhoneStateOption(PicUp.isExternalPhoneStateEnabled());
        });
    }

    const clearData = function () {
        PicUp.clearData();
        AsyncStorage.removeItem('registered');
        AsyncStorage.removeItem('user');
        setAppStatus('registration');
    }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.requestPermissions();
            PushNotificationIOS.addEventListener('register', (token) => {
                console.log("token ====>", token);
                setToken(token);
            });
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {Platform.OS === 'ios' &&
                        <Text style={styles.text}>Push Token:
                            <Text style={styles.text} onPress={() => Clipboard.setString(token)}>{token}</Text>
                        </Text>
                    }
                    <View style={{ height: 10 }} />
                    {serviceStatus === true && (
                        <>
                            <Text style={styles.text}>Service status: enabled</Text>
                            <View style={{ height: 10 }} />
                            <Button title="disable Service" onPress={switchServiiceStatus} />
                        </>
                    )}
                    {serviceStatus === false && (
                        <>
                            <Text style={styles.text}>Service status: disabled</Text>
                            <View style={{ height: 10 }} />
                            <Button title="enable Service" onPress={switchServiiceStatus} />
                        </>
                    )}
                    <View style={{ height: 10 }} />
                    {Platform.OS === 'android' &&
                        <Button title={(externalPhoneStateOption === true ? 'Disable' : 'Enable') + " External Phone Mode"} onPress={switchExternalPhoneStateOption} />
                    }
                    <View style={{ height: 10 }} />
                    <Text style={styles.text}>Service permission mode: {permissionMode}</Text>
                    <View style={{ height: 10 }} />
                    <Button title={"Set Permission " + (permissionMode === 'Internal' ? 'External' : 'Internal') + " Mode"} onPress={switchPermiossionMode} />
                    <View style={{ height: 10 }} />
                    <Button title={"Clear data"} onPress={clearData} />
                    <View style={{ height: 10 }} />
                    {/*<Button  title="Unregister" onPress={() => {*/}
                    {/*    AsyncStorage.setItem('registered', 'unregistered').then(*/}
                    {/*        () => {*/}
                    {/*            setAppStatus('registration');*/}
                    {/*        }*/}
                    {/*    );;*/}
                    {/*}}/>*/}

                    <View style={{ height: 10 }} />
                    <Button title={"saveWindowPosition"} onPress={() => PicUp.saveWindowPosition(true)} />
                    <View style={{ height: 10 }} />
                    <Button title={"setDebugMode"} onPress={() => PicUp.setDebugMode(true)} />
                    <View style={{ height: 10 }} />
                    <Button title={"setExternalPhoneStateOption"} onPress={() => PicUp.setExternalPhoneStateOption(true)} />
                    <View style={{ height: 10 }} />
                    <Button title={"setOptoutOption"} onPress={() => PicUp.setOptoutOption(true)} />
                    <View style={{ height: 10 }} />
                    <Button title={"disablePullRequestOption"} onPress={() => PicUp.disablePullRequestOption(true)} />
                    <View style={{ height: 10 }} />
                    <Button title={"disableCampaignCheck"} onPress={() => PicUp.disableCampaignCheck(true)} />
                    <View style={{ height: 10 }} />
                    <Button title={"setInternalIncomingNumbersList"} onPress={() => PicUp.setInternalIncomingNumbersList('PicUp')} />
                    <View style={{ height: 10 }} />
                    <Button title={"clearInternalIncomingNumbersList"} onPress={() => PicUp.clearInternalIncomingNumbersList()} />
                    <View style={{ height: 10 }} />
                    <Button title={"FcmOnNewToken"} onPress={() => PicUp.FcmOnNewToken()} />
                    <View style={{ height: 10 }} />
                    <Button title={"MessageReceived"} onPress={() => PicUp.MessageReceived({}, 'Message')} />
                    <View style={{ height: 10 }} />
                    <Button title={"setInternalCampaignsJson"} onPress={() => PicUp.setInternalCampaignsJson('PicUp')} />
                    <View style={{ height: 10 }} />
                    <Button title={"clearInternalCampaignsJson"} onPress={() => PicUp.clearInternalCampaignsJson()} />
                    <View style={{ height: 10 }} />
                    <Button title={"setPostCallNotificationOption"} onPress={() => PicUp.setPostCallNotificationOption(true)} />
                    <View style={{ paddingVertical: 20 }}>
                        <Input multiline style={styles.textInput} placeholder={'Public Key'} value={publicKey}
                            onChangeText={setPublicKey} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }} >
                            <Button title={"Add"} onPress={() => PicUp.setImageSigningPublicKey(publicKey)} />
                            <View style={{ paddingLeft: 10 }}>
                                <Button title={"Remove"} onPress={() => { PicUp.setImageSigningPublicKey(''); setPublicKey('') }} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
