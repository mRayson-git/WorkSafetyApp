/**
 * @file
 * @author Michael Rayson, Masoumeh Mirzaeepourgelvarzkh
 * @description This file contains the code needed to initialize the firebase application
 */

/**
 * @author Masoumeh Mirzaeepourgelvarzkh
 * @description The firebase package is used to creating the connection with our firebase application.
 */
const firebase = require('firebase');

/**
 * @author Michael Rayson
 * @description The config information is needed as it contains the firebase configuration information.
 */
const config = require('./config');

/**
 * @author Masoumeh Mirzaeepourgelvarzkh
 * @description The connection is made with the firebase application specified within the firebase
 * configuration data.
 */
const db = firebase.initializeApp(config.firebaseConfig);

/**
 * @description We export the firebase connection to any location that needs it.
 */
module.exports = db;