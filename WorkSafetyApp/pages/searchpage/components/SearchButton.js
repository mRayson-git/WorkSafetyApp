/**
 * @file
 * @author Michael Rayson, Dhruvkumar Patel, Kefen, Shipa
 * @description This component contains the search bar and button. It is used for hooking into the backend.
 */

/**
 * @description Components from the react and react-native packages needed for this component
 */
import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * @description This function renders the searchbar and searchbutton
 * @param {function} param0 
 * @returns a rendered view of the searchbar and search button
 */
const SearchBtn = ({searchMethod}) => {
    const [text, setText] = useState('');

    const onChange = (text) => setText(text);

    return (
    <View>
        <TextInput placeholder='Search for product...' style={styles.input} onChangeText={onChange} />
        <TouchableOpacity style={styles.btn} onPress={() => searchMethod(text)}>
            <Text style={styles.btnText}><Ionicons name='search' size={20} />Search</Text>
        </TouchableOpacity>
    </View>
    );
};

/**
 * @description CSS styles needed for this component
 */
const styles = StyleSheet.create({
    input: {
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

/**
 * @description Exporting the component to be used by the root application.
 */
export default SearchBtn;