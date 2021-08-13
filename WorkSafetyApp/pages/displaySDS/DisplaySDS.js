/**
 * @file
 * @author Michael Rayson
 * @description This file contains the code needed for the component that displays the SDS sheets to the client
 */

/**
 * @description All the imports needed for this component
 */
 import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import { useToast } from "react-native-toast-notifications";
import Header from '../shared/components/Header';

/**
 * @description variable needed for properly styling the image for display to the user
 */
const win = Dimensions.get('window');

/**
 * @description This is the function component for the SDS page that takes in the route and navigation context..
 * @param {route, navigation}
 * @returns a rendered view of the SDS component
 */
export default function SDSPage({route, navigation}) {
    const [displayErr, setDisplayErr] = useState('');
    const base64 = route.params.base64;
    const imageWidth = route.params.imageWidth;
    const imageHeight = route.params.imageHeight;
    const ratio = win.width/imageWidth;

    const toast = useToast();
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            if (imageHeight > imageWidth) {
                setDisplayErr(true);
            } else {
                return;
            }
        } else if (displayErr) {
            console.log('displayErr for results');
            toast.show('Image may not be scaled right', {type: 'warning'});
            setdisplayErr(false);
        }
    });
    
    return (
        <View>
            <Header navigation={navigation} backUrl="SearchPage" back={true}/>
            <View>
                <Image style={{width: win.width, height: imageHeight * ratio}} source={{uri: base64}}/>
            </View>
        </View>
    );
}

