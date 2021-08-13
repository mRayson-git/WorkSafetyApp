/**
 * @file
 * @author Michael Rayson, Shipa
 * @description This file contains the code needed for the 'header' component 
 */

/**
 * @description Imports needed for the component from the react & react-native packages
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


/**
 * @description function to render the header with the specified properties
 * @param {string} props 
 * @returns a rendered view of the header
 */
const Header = (props) => {
  
  function HasBack() {
    if (props.back !== undefined) {
      return (
        <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate(props.backUrl)}>
          <Text style={styles.text}><Ionicons name="arrow-back" size={20} /></Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  return (
    <View style={styles.header}>
      <View style={styles.hContainer}>
        <HasBack />
        <Text style={styles.text}>{props.title}</Text>
      </View>
    </View>
  );
};

Header.defaultProps = {
  title: "Workplace Safety App"
}

/**
 * @description CSS styles needed for this component
 */
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#003300',
    minHeight: 'fit-content',
    padding: 15,
    marginBottom: 8
  },
  hContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  text: {
    color: 'white',
    fontSize: 28,
    textAlign: 'left'
  },
  btn: {
    marginRight: 8
  }
});

/**
 * @description Exporting the component to be used by the root application
 */
export default Header;
