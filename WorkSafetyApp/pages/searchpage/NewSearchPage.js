/**
 * @file
 * @author Michael Rayson, Dhruvkumar Patel, Kefen, Shipa
 * @description This file contains the code needed for the component that displays the Registration page
 */

/**
 * @description imports for packages needed for this components
 */
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import Header from '../shared/components/Header';
import SearchBtn from './components/SearchButton';
import ListItem from './components/ListItem';

/**
 * @description This is the function component for the registration page that takes as parameter the navigation context.
 * @param {navigation context} navigation
 * @returns a rendered view of the registration page
 */
export default function SearchPage({navigation}) {
    /**
    * @description react 'state' values used to ensure persistance
    */
    const [products, setItems] = useState([]);
    const [searching, setSearching] = useState('');
    const [displaying, setDisplaying] = useState('');
    const [displayingMessage, setDisplayingMessage] = useState('');

    const toast = useToast();
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else if (searching) {
            console.log('Searching for results');
            toast.show('Searching for results, please wait', {type: 'success'});
            setSearching(false);
        }
    });

    /**
     * @description This function is a React-Native state hook. It is triggered anytime the state of the page changes (e.g user types in information)
     * and is used for displaying the toast message when there is some form of error.
     */
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else if (displaying) {
            console.log('Displaying results');
            if (displayingMessage.charAt(0) === 'F') {
                toast.show(displayingMessage, {type: 'success'});
            } else if (displayingMessage.charAt(0) === 'N') {
                toast.show(displayingMessage, {type: 'danger'});
            } else {
                toast.show(displayingMessage, {type: 'success'});
            }
            setDisplaying(false);
            setDisplayingMessage('');
        }
    });

    /**
    * @description function used for sending a request to the backend enpoint to search the open-source SDS database.
    * @param {string} searchText 
    */
    const searchMethod = async (searchText) => {
        setItems([]);
        if (searchText != '') {
            searchText = searchText.replace(/([^a-z0-9]+)/gi, '-');
            setSearching(true);
            let results = await fetch(`http://localhost:3000/sds/${searchText}`);
            let json = await results.json();
            if (json.success === 1) {
                setDisplayingMessage('Found results');
                setDisplaying(true);
                for (let product of json.payload) {
                    addItem(product);
                }
            } else {
                setDisplayingMessage('No results found');
                setDisplaying(true);
            }
        } else {
            setDisplayingMessage('No search term given');
            setDisplaying(true);
        }
    }

    /**
     * Method used for navigating to the SDS view page, passing along the product information
     * @param {*} product 
     */
    const showSDSMethod = async (product) => {
        let base64 = null;
        let imageWidth = null;
        let imageHeight = null;
        setDisplayingMessage('Retreiving SDS sheet');
        setDisplaying(true);
        const getSDS = async (product) => {
            let results = await fetch('http://localhost:3000/sds/', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(product)
            });
            let json = await results.json();
            base64 = `data:image/png;base64,${json.payload}`;
            Image.getSize(base64, (width, height) => {
                imageWidth = width;
                imageHeight = height;
                navigation.navigate('SDSPage', {base64: base64, imageWidth, imageHeight});
            });
        }
        await getSDS(product);
    }

    /**
    * @description function used for adding the product to the flatlist for rendering
    * @param {{name: string, manufacturer: string, url: string}} product 
    */
     const addItem = (product) => {
        setItems(prevItems => {
        return [{name: product.name, manufacturer: product.manufacturer, url: product.url}, ...prevItems];
        });
    }

    return (
        <View>
            <Header navigation={navigation} backUrl="UserLandingPage" back={true}/>
            <View style={styles.container}>
                <SearchBtn searchMethod={searchMethod}/>
                {/* <ActivityIndicator hidesWhenStopped={true} animating={animating} color="#f2403d" size="large"/> */}
                <FlatList style={styles.list} data={products} renderItem={({item: product, index}) => (
                    <ListItem product={product} index={index} showSDSMethod={showSDSMethod} />
                )} />
            </View>
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
    list: {
        margin: 8
    }
});
