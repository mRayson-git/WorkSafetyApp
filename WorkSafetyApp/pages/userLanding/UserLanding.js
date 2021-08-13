/**
 * @file
 * @author Michael Rayson, Dhruvkumar Patel, Kefen Yan
 * @description This file contains the code needed for the component that displays the user landing page
 */

/**
 * @description All the imports needed for this component
 */
 import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../shared/components/Header';

/**
 * @description This is the function component for the landing page that takes as parameter the navigation context and the route data (user details).
 * @param {navigation context} navigation
 * @returns a rendered view of the landing page page
 */
export default function UserLandingPage({ route, navigation }) {
    let userEmail = '';
    let isAdmin = false;
    const toast = useToast();
    const firstUpdate = useRef(true);
    const [logoutSuccess, setLogoutSuccess] = useState('');
    const [logoutError, setLogoutError] = useState('');
    const [validating, setValidating] = useState('');

    /**
     * @description function used for retrieving the user data (if it exists) which redirects the user to the login page if they're not logged in.
     */
    async function getData() {
        try {
            userEmail = await AsyncStorage.getItem('UserEmail');
            if (userEmail == null) {
                navigation.navigate('LoginPage');
            }
        }catch (err){
            console.error(err);
        }
    }
    getData();

    /**
     * @description Small statement used to determine instantaneously if the user is an admin or not (used for rendering page)
     */
    if (route.params !== undefined){
        userEmail = route.params.userEmail;
        isAdmin = route.params.isAdmin;
    }
    
    /**
     * @description Function used for logging out the user. Sends a logout request to the backend and removes the userdata from local storage.
     */
    let logout = async() => {
        let results = await fetch(`http://localhost:3000/user/logout`);
        let json = await results.json();
        if (json.success == 1) {
            await AsyncStorage.removeItem('UserEmail');
            await AsyncStorage.removeItem('IsAdmin');
            setLogoutSuccess('Logged out');
            setValidating(true);
        } else {
            setLogoutError('Error logging out');
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
        } else if (validating && logoutError !== '') {
            console.log('Creation error exists');
            toast.show(logoutError, {type: 'danger'});
            setValidating(false);
            setLogoutError('');
        } else if (validating && logoutSuccess !== '') {
            console.log('Creation error exists');
            toast.show(logoutSuccess, {type: 'success'});
            setValidating(false);
            navigation.navigate('SplashPage');
        }
    });

    /**
     * @description This component displays a button that will either allow direct manipulation of a worksite, or creation of suggestions
     * for a worksite (WIP)
     * @returns renderd view of a button
     */
    function WorksiteOption() {
        if (isAdmin) {
            return (
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SearchPage')}>
                    <Text style={styles.btnText}>Worksite Mangement</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SearchPage')}>
                    <Text style={styles.btnText}>Worksite Suggestion</Text>
                </TouchableOpacity>
            );
        }
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation}/>
            <Text style={styles.title}>Landing Page</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('MyWorksitesPage', {userEmail})}>
                <Text style={styles.btnText}>My Worksites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SearchPage')}>
                <Text style={styles.btnText}>QuickSearch</Text>
            </TouchableOpacity>
            <WorksiteOption />
            <TouchableOpacity style={styles.btn} onPress={logout}>
                <Text style={styles.btnText}>Logout</Text>
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
