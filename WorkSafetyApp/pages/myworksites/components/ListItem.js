// ALTERNATE LIST ITEM COLOURS FOR CONTRAST & LARGER
// Search text should have better padding to match search button

/**
 * @file
 * @author Michael Rayson
 * @description This component is used for rendering the items within the flatlist of the application
 */

/**
 * @description Imports from react and react-native needed for this component
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * @description function to render the list item
 * @param {worksiteName: string} param0 
 * @returns a rendered view of the list item
 */
const ListItem = (props) => {
  console.log(props);
  return (
    <TouchableOpacity style={ props.index % 2 == 0 ? styles.listItem : styles.listItemAlt} onPress={() => props.showWorksiteMethod(props.worksite)}>
        <View style={styles.listItemView}>
          <Text style={styles.listItemText}>{props.worksite}</Text>
          <Ionicons name='arrow-forward' size={20} />
        </View>
    </TouchableOpacity>
  );
};

/**
 * @description CSS stlyes needed for this component
 */
const styles = StyleSheet.create({
  listItem: {
    padding: 32,
    backgroundColor: '#c6ebc6',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  listItemAlt: {
    padding: 32,
    backgroundColor: '#8fd68f',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  listItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listItemText: {
    fontSize: 18,
  },
});

/**
 * @description Exporting the component to be used by the root application
 */
export default ListItem;
