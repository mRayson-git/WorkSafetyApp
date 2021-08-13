/**
 * @file
 * @author Michael Rayson, Shipa
 * @description This file contains the code needed for the component that displays the Registration page
 */

/**
 * @description All the imports needed for this component
 */
import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications";
import Header from '../shared/components/Header';

/**
 * @description This is the function component for the registration page that takes as parameter the navigation context.
 * @param {navigation context} navigation
 * @returns a rendered view of the registration page
 */
export default function RegistrationPage({navigation}) {
    const [userEmail, setUserEmail] = useState('');
    const [userPass, setUserPass] = useState('');
    const [userConfirmPass, setUserConfirmPass] = useState('');
    const [creationError, setCreationError] = useState('');
    const [creationSuccess, setCreationSuccess] = useState('');
    const [validating, setValidating] = useState('');
    const toast = useToast();
    const firstUpdate = useRef(true);

    /**
     * @description This function hooks into the backend registration endpoint to create a user. It also updates the state of the page to trigger
     * the toast messages on successful and unsuccessful registration attempts.
     */
    const register = async () => {
        if (userEmail != '' && userPass != '' && userPass == userConfirmPass) {
            // TODO: Hash password

            let results = await fetch('http://localhost:3000/user/register', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({userEmail, userPass})
            });
            let json = await results.json();
            if (json.success) {
                console.log(json);
                setCreationSuccess('User created');
                setValidating(true);
            } else {
                setCreationError(json.payload);
                setValidating(true);
            }
        } else if (userPass !== userConfirmPass) {
            setCreationError('Passwords do not match');
            setValidating(true);
        } else {
            setCreationError('Missing fields');
            setValidating(true);
        }
    }

    /**
     * @description This function is a React-Native state hook. It is triggered anytime the state of the page changes (e.g user types in information)
     * and is used for displaying the toast message when there is some form of registration error.
     */
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else if (validating && creationError !== '') {
            console.log('Creation error exists');
            toast.show(creationError, {type: 'danger'});
            setValidating(false);
            setCreationError('');
        } else if (validating && creationSuccess !== '') {
            toast.show(creationSuccess, {type: 'success'});
            setValidating(false);
            navigation.navigate('LoginPage');
        }
    });

    /**
     * @description This function stores the user data with the AsyncStorage package for React-Native. This stores the information on the client device.
     * @param {*} userUID 
     * @param {*} isAdmin 
     */
    let _storeData = async(userUID, isAdmin) => {
        try {
            console.log('Setting userdata in memory');
            await AsyncStorage.setItem('UserUID', userUID);
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
     * @param {*} userPass 
     * @returns the updated state
     */
    const onPassChange = (userPass) => setUserPass(userPass);

    /**
     * These variables store functions that trigger 'on text change' within the text fields keeping the React-Native applications state up to date with
     * current information.
     * @param {*} userConfirmPass 
     * @returns the updated state
     */
    const onConfirmPassChange = (userConfirmPass) => setUserConfirmPass(userConfirmPass);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} backUrl="LoginPage" back={true}/>
            <Text style={styles.title}>Register</Text>
            <TextInput placeholder='Email...' style={styles.textInput} onChangeText={onEmailChange} />
            <TextInput placeholder='Password' style={styles.textInput} onChangeText={onPassChange} secureTextEntry={true} />
            <TextInput placeholder='Confirm Password' style={styles.textInput} onChangeText={onConfirmPassChange} secureTextEntry={true} />
            <br></br>
            <TouchableOpacity style={styles.btn} onPress={register}>
                <Text style={styles.btnText}>Register</Text>
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
    }
});
