/**
 * @file
 * @author Michael Rayson
 * @description This file contains the code needed for the component that displays the login page
 */

/**
 * @description All the imports needed for this component
 */
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../shared/components/Header';

/**
 * @description This is the function component for the login page that takes as parameter the navigation context.
 * @param {navigation context} navigation
 * @returns a rendered view of the login page
 */
export default function LoginPage({navigation}) {
    const [userEmail, setUserEmail] = useState('');
    const [userPass, setUserPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [validating, setValidating] = useState('');
    const toast = useToast();
    const firstUpdate = useRef(true);

    /**
     * @description This function hooks into the backend login endpoint to log in the current user, storing their information on the client's device.
     */
    const login = async () => {
        if (userEmail != '' && userPass != '') {
            // TODO: Hash password
            let results = await fetch('http://localhost:3000/user/login', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({userEmail, userPass})
            });
            let json = await results.json();
            console.log(json);
            if (json.success) {
                // Saving user email and isAdmin value
                _storeData(json.payload, true);
                setLoginSuccess('Logged in!');
                setValidating(true);
                navigation.navigate('UserLandingPage', {userEmail: json.payload, isAdmin: true});
            } else {
                setLoginError(json.payload);
                setValidating(true);
            }
        } else {
            setLoginError('Missing fields');
            setValidating(true);
        }
    }

    /**
     * @description This function is a React-Native state hook. It is triggered anytime the state of the page changes (e.g user types in information)
     * and is used for displaying the toast message when there is some form of login error.
     */
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else if (validating && loginError !== '') {
            console.log('Creation error exists');
            toast.show(loginError, {type: 'danger'});
            setValidating(false);
            setLoginError('');
        } else if (validating && loginSuccess !== '') {
            console.log('Creation error exists');
            toast.show(loginSuccess, {type: 'success'});
            setValidating(false);
        }
    });

    /**
     * @description This function stores the user data with the AsyncStorage package for React-Native. This stores the information on the client device.
     * @param {*} userEmail 
     * @param {*} isAdmin 
     */
    let _storeData = async(userEmail, isAdmin) => {
        try {
            console.log('Setting userdata in memory');
            await AsyncStorage.setItem('UserEmail', userEmail);
            await AsyncStorage.setItem('IsAdmin', isAdmin);
        } catch(err){
            console.error(err);
        }
    }

    /**
     * These variables store functions that trigger 'on text change' within the text fields keeping the React-Native applications state up to date with
     * current information.
     * @param {*} userEmail 
     * @returns the updated state
     */
    const onEmailChange = (userEmail) => setUserEmail(userEmail);

    /**
     * These variables store functions that trigger 'on text change' within the text fields keeping the React-Native applications state up to date with
     * current information.
     * @param {*} userEmail 
     * @returns the updated state
     */
    const onPassChange = (userPass) => setUserPass(userPass);

    return (
        <View style={styles.container}>
            <Header back={true} backUrl="SplashPage" navigation={navigation}/>
            <Text style={styles.title}>Login</Text>
            <TextInput placeholder="Username..." style={styles.textInput} onChangeText={onEmailChange}/>
            <TextInput placeholder="Password..." style={styles.textInput} secureTextEntry={true} onChangeText={onPassChange}/>
            <br></br>
            <TouchableOpacity style={styles.btn} onPress={login}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('RegistrationPage')}>
                <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
            <br></br>
            <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ResetPassPage')}>
                <Text style={styles.forgotBtnText}>Forgot Password</Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * @description CSS styles to be used for this page
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 8
    },
    textInput: {
        margin: 8,
        height: 40,
        borderWidth: 4,
        borderColor: '#111a00',
        borderRadius: 5,
        fontSize: 24,
    },
    btn: {
        backgroundColor: '#003300',
        padding: 10,
        margin: 8,
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#111a00',
        borderRadius: 5,
    },
    btnText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center'
    },
    forgotBtn: {
        backgroundColor: '#ECD44F',
        padding: 10,
        margin: 8,
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '#C4A808',
        borderRadius: 5,
    },
    forgotBtnText: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center'
    },
});
