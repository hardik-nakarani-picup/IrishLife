import React from "react";
import { useState } from "react";
import { Button, Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PicUp from "react-native-picup";
import { Input } from "react-native-elements";


let user_loaded = false;


export default function RegistrationScreen(props) {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = StyleSheet.create({
        text: {
            color: isDarkMode ? Colors.lighter : Colors.darker,
            borderBottomColor: '#f00'
        },
    });
    const { setAppStatus, SetPermissons } = props;
    const [user, setUser] = useState({
        name: '',
        phone: '',
        code: '',
        secure: ''
    }
    );
    if (!user_loaded) {
        user_loaded = true;
        AsyncStorage.getItem('user').then((userParsed) => {
            if (userParsed !== null && userParsed.length) {
                console.log("userParsed: ", userParsed);
                console.log("userParsed: ", JSON.parse(userParsed));
                setUser(JSON.parse(userParsed));
            }
        });
    }
    const [loading, setLoading] = useState(false);
    const [validation_name, setValidationName] = useState(true);
    const [validation_code, setValidationCode] = useState(true);
    const [validation_phone, setValidationPhone] = useState(true);
    const [validation_secure, setValidationSecure] = useState(true);

    async function RegisterUser() {
        // console.log(user);
        // let user = {
        //     name: 'Test',
        //     phone: '+3890639724448',
        //     code: '602',
        //     secure: 'hkRD4DZZ'
        // }
        AsyncStorage.setItem('user', JSON.stringify(user));
        if (validate()) {
            if (Platform.OS === 'ios') { SetPermissons(); }
            setLoading(true);
            PicUp.PicUpRegister(user.name, user.phone, user.code, user.secure).then(value => {
                // alert(JSON.stringify(user))
                AsyncStorage.setItem('registered', 'registered').then(
                    () => {
                        if (Platform.OS === 'android') { SetPermissons(); }
                        setAppStatus('settings');
                        if (Platform.OS === 'android') {
                            PicUp.setPermissionExternalMode();
                        }
                    }
                );
                console.log('PicUpRegister:');
                console.log(value);
                setLoading(false);
            }).catch(reason => {
                alert(reason.message);

                setLoading(false);
                console.log("Catch");
                console.log(reason);
            });
        }
    }

    function validate() {
        let valid = true;
        if (user.name.length === 0) {
            valid = false;
            setValidationName(false);
        } else {
            setValidationName(true);
        }
        if (user.phone.length === 0) {
            valid = false;
            setValidationPhone(false);
        } else {
            setValidationPhone(true);
        }
        if (user.code.length === 0) {
            valid = false;
            setValidationCode(false);
        } else {
            setValidationCode(true);
        }
        if (user.secure.length === 0) {
            valid = false;
            setValidationSecure(false);
        } else {
            setValidationSecure(true);
        }
        return valid;
    }
    console.log(loading);
    console.log(styles);
    console.log(user);

    return (
        <View style={{ width: '100%', paddingHorizontal: 10 }}>
            {loading && (<Text style={styles.text}>Loading ...</Text>)}
            {!loading && (
                <>
                    <Input style={styles.text} placeholder={'Name'} defaultValue={user.name}
                        onChangeText={text => user.name = text} />
                    {validation_name === false &&
                        <Text style={{ color: '#f00', fontSize: 14, paddingHorizontal: 10, marginTop: -15 }}>Field Name is
                            require</Text>}
                    <Input style={styles.text} placeholder={'Phone'} defaultValue={user.phone}
                        onChangeText={text => user.phone = text} />
                    {validation_phone === false &&
                        <Text style={{ color: '#f00', fontSize: 14, paddingHorizontal: 10, marginTop: -15 }}>Field Phone is
                            require</Text>}
                    <Input style={styles.text} placeholder={'Code'} defaultValue={user.code}
                        onChangeText={text => user.code = text} />
                    {validation_code === false &&
                        <Text style={{ color: '#f00', fontSize: 14, paddingHorizontal: 10, marginTop: -15 }}>Field Code is
                            require</Text>}
                    <Input style={styles.text} placeholder={'Secure'} defaultValue={user.secure}
                        onChangeText={text => user.secure = text} />
                    {validation_secure === false &&
                        <Text style={{ color: '#f00', fontSize: 14, paddingHorizontal: 10, marginTop: -15, marginBottom: 15 }}>Field
                            Secure is require</Text>}
                    <Button title="Register now" onPress={RegisterUser} />
                </>
            )}
        </View>
    );
}
