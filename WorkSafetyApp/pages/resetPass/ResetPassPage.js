/**
 * @file
 * @author Michael Rayson, Shipa
 * @description This file contains the code needed for the component that displays the reset password page
 */

/**
 * @description All the imports needed for this component
 */
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import Header from '../shared/components/Header';

/**
 * @description This is the function component for the registration page that takes as parameter the navigation context.
 * @param {navigation context} navigation
 * @returns a rendered view of the registration page
 */
export default function ResetPassPage({navigation}) {
    const [userEmail, setUserEmail] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const [validating, setValidating] = useState('');
    const toast = useToast();
    const firstUpdate = useRef(true);

    /**
     * @description This function hooks into the backend password reset endpoint to send a password reset request. It also updates the state of the page to trigger
     * the toast messages on successful and unsuccessful attempts.
     */
    const forgotPass = async () => {
        if (userEmail !== '') {
            let results = await fetch ('http://localhost:3000/user/resetPassword', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({userEmail})
            });
            let json = await results.json();
            if (json.success) {
                setResetSuccess('Password reset email sent!');
                setValidating(true);
            } else {
                setResetError(json.payload);
                setValidating(true);
            }
        } else {
            setResetError('Email must not be blank');
            setValidating(true);
        }
    }

    /**
     * @description This function is a React-Native state hook. It is triggered anytime the state of the page changes (e.g user types in information)
     * and is used for displaying the toast message when there is some form of error.
     */
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else if (validating && resetError !== '') {
            console.log('Creation error exists');
            toast.show(resetError, {type: 'danger'});
            setValidating(false);
            setResetError('');
        } else if (validating && resetSuccess !== '') {
            console.log('Success message');
            toast.show(resetSuccess, {type: 'success'});
            setValidating(false);
            navigation.navigate('LoginPage');
        }
    });

    /**
     * These variables store functions that trigger 'on text change' within the text fields keeping the React-Native applications state up to date with
     * current information.
     * @param {*} userEmail 
     * @returns the updated state
     */
    const onEmailChange = (userEmail) => setUserEmail(userEmail);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} backUrl="LoginPage" back={true}/>
            <Text style={styles.title}>Password Reset</Text>
            <TextInput placeholder='Email...' style={styles.textInput} onChangeText={onEmailChange} />
            <TouchableOpacity style={styles.btn} onPress={forgotPass}>
                    <Text style={styles.btnText}>Send Link</Text>
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
});
