/**
 * @file
 * @author Michael Rayson, Dhruvkumar Patel, Shipa
 * @description This file contains the code needed for the component that displays the splash page
 */

/**
 * @description All the imports needed for this component
 */
import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../shared/components/Header';
import logo from '../splash/logo.svg';


/**
 * @description This is the function component for the splash page that takes as parameter the navigation context.
 * @param {navigation context} navigation
 * @returns a rendered view of the login page
 */
export default function SplashPage({ navigation }) {
    /**
     * @description function used for retrieving the user data (if it exists) which redirects the user to their landing page if their
     * still 'logged in'.
     */
    let getData = async() => {
        try {
            const userEmail = await AsyncStorage.getItem('UserEmail');
            const isAdmin = await AsyncStorage.getItem('IsAdmin');
            if (userEmail !== null) {
                console.log('User already logged in');
                console.log('User:', userEmail);
                navigation.navigate('UserLandingPage', {userEmail: userEmail, isAdmin: isAdmin});
            } else {
                console.log('User not logged in');
            }
        }catch (err){
            console.error(err);
        }
    }
    getData()

    return (
        <View style={styles.container}>
            <Header/> 
            <img src={logo} alt="Logo" ></img>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('LoginPage')}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SearchPage')}>
                <Text style={styles.btnText}>QuickSearch</Text>
            </TouchableOpacity>            
        </View>
    );
}

/**
 * @description CSS styles to be used for this page
 */
const styles = StyleSheet.create({
    container: {
        flex: 1
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
