/**
 * @file
 * @author Michael Rayson
 * @description This file contains the code needed for the component that displays the users worksites
 */

/**
 * @description All the imports needed for this component
 */
 import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import Header from '../shared/components/Header';
import ListItem from './components/ListItem';

/**
 * @description This is the function component for the landing page that takes as parameter the navigation context and the route data (user details).
 * @param {navigation context} navigation
 * @returns a rendered view of the landing page page
 */
export default function MyWorksitesPage({ route, navigation }) {
    let userEmail = route.params.userEmail;
    const toast = useToast();
    const [worksites, setWorksites] = useState([]);
    const [worksiteMsg, setWorksiteMsg] = useState('');
    const [worksiteErrorMsg, setWorksiteErrorMsg] = useState('');
    const [displaying, setDisplaying] = useState('');

    const firstUpdate = useRef(true);

    /**
     * @description This function hooks into the backend worksites endpoint and retrieves the worksites associated with his username
     */
    const getWorksites = async () => {
        let results = await fetch('http://localhost:3000/worksite/getWorksites', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({userEmail})
        });
        let json = await results.json();
        console.log(json);
        if (json.success == 1) {
            for (let worksite of json.payload) {
                setWorksites(prevItems => {
                    return [worksite, ...prevItems];
                });
            }
            setWorksiteMsg('Retrieved Worksites');
            setDisplaying(true);
        } else {
            setWorksiteErrorMsg('Could not find any worksites');
            setDisplaying(true);
        }
    }

    /**
     * @description Method used for getting the users worksites on the first instantiation of the page and showing toast messages on page reload
     */
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            getWorksites();
            return;
        } else if (displaying && worksiteErrorMsg !== '') {
            toast.show(worksiteErrorMsg, {type: 'danger'});
            setDisplaying(false);
            setWorksiteErrorMsg('');
        } else if (displaying && worksiteMsg !== '') {
            toast.show(worksiteMsg, {type: 'success'});
            setDisplaying(false);
        }
    });

    /**
     * Method used for navigating to the worksite view page, passing along the worksite information
     * @param {*} worksite 
     */
     const showWorksiteMethod = async (worksite) => {
        const getWorksite = async (worksite) => {
            let results = await fetch('http://localhost:3000/worksite/getData', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({worksiteName: worksite})
            });
            let json = await results.json();
            if (json.success == 1) {
                navigation.navigate('WorksiteViewPage', {worksite: json.payload});
            }
        }
        await getWorksite(worksite);
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} backUrl="UserLandingPage" back={true}/>
            <Text style={styles.title}>My Worksites</Text>
            <FlatList style={styles.list} data={worksites} renderItem={({item: worksite, index}) => (
                <ListItem worksite={worksite} index={index} showWorksiteMethod={showWorksiteMethod} />
            )} />
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
