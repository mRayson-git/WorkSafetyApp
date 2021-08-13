/**
 * @file
 * @author Michael Rayson
 * @description This file contains the code needed to pull information from the .env file and export it
 * to anywhere that needs it.
 */

/**
 * @description The dotenv package is used for reading the .env file we created in the root directory
 * of the application.
 */
const dotenv = require('dotenv');
/**
 * @description The assert import is used for guarenteeing that some of the values do exist.
 */
const assert = require('assert');

/**
 * @description This function loads the .env config information into the process.env
 */
dotenv.config();

/**
 * @description Setting the values needed in the process.env variable.
 */
const {
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
} = process.env;

/**
 * @description Make sure that the port is specified.
 */
assert(PORT, 'PORT is required');
/**
 * @description Make sure that the host is specified.
 */
assert(HOST, 'HOST is required');

/**
 * @description Export all the information required from this file:
 * port, host, url, firebaseconfig
 */
module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
    }
}