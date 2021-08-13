/**
 * @file
 * @author Michael, Shipa, Kefen, Dhruv
 * @description This file contains the 'root' of the application
 */

/**
 * @description imports from the react & react-native packages needed for different components
 */
import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
/**
 * @description Pulled from https://github.com/arnnis/react-native-toast-notifications
 */
import { ToastProvider } from 'react-native-toast-notifications'
import 'react-native-gesture-handler';
import { NavigationContainer, StackActions, StackRouter } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashPage from './pages/splash/splashpage';
import LoginPage from './pages/login/LoginPage';
import SearchPage from './pages/searchpage/NewSearchPage';
import UserLandingPage from './pages/userLanding/UserLanding';
import RegistrationPage from './pages/registration/RegistrationPage';
import ResetPassPage from './pages/resetPass/ResetPassPage';
import SDSPage from './pages/displaySDS/DisplaySDS';
import MyWorksitesPage from './pages/myworksites/MyWorksitesPage';

const Stack = createStackNavigator();

/**
 * @description This function contains the state of the application and the methods needed for the application to run
 * @returns a rendering of the application
 */
export default function App() {
  return (
    <ToastProvider
    animationType="slide-in"
    duration={2000}
    textStyle={{fontSize: 24}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashPage" component={SplashPage}/>
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
          <Stack.Screen name="ResetPassPage" component={ResetPassPage} />
          <Stack.Screen name="SearchPage" component={SearchPage} />
          <Stack.Screen name = "SDSPage" component={SDSPage} />
          <Stack.Screen name="UserLandingPage" component={UserLandingPage} />
          <Stack.Screen name="MyWorksitesPage" component={MyWorksitesPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

/**
 * @description CSS styles to be used for this page
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
