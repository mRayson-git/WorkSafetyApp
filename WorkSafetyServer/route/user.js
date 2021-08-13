/**
 * @file
 * @author Michael Rayson
 * @description This file serves as a router for the backend. It handles the '/user/' route from from server
 * and is used for handling logging in, registration, and logging out of firebase.
 */

/**
 * @description Express package is mandatory for providing the router.
 */
const express = require('express');

/**
 * @description Connection to firebase is pulled from the db.js file.
 */
const admin = require('../config/db');

/**
 * @description Creation of an express Router which can be exported for use by the server when dealing with requests.
 */
const router = express.Router();

/**
 * @author https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 * @description This function checks that the provided string matches the format of an email (eg. _@_._)
 * @param {string} email 
 * @returns true or false depending on if the string matches the regex expression
 */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * @author Michael Rayson
 * @description This method takes the user information stored within the request as a json object with the form
 * {userEmail: string, userPass: string} and passed it through Google Firebase's authentication client. If successful
 * it returns the UID of the user logged in, if not the error is sent back to the client.
 */
router.post('/login', async (req, res) => {
    console.debug('Login endpoint hit');
    try {
        userEmail = req.body.userEmail;
        userPass = req.body.userPass;
        if (userEmail == undefined || userPass == undefined) {
            res.json({success: 0, message: 'Missing fields'});
        } else if (!validateEmail(userEmail)){
            res.json({success: 0, message: 'Poorly formatted email'});
        } else {
            admin.auth().signInWithEmailAndPassword(userEmail, userPass).then((userCredential => {
                console.debug('Successfully logged in as uid:', userCredential.user.email);
                res.json({success: 1, message: 'Signed in', payload: userCredential.user.email });
            })).catch((error) => {
                console.error('Error creating new user: ', error);
                res.json({success: 0, message: 'Error signing in', payload: error.message });
            });
        }
    } catch (err) {
        res.json({success: 0, message: 'Could not log in', payload: err});
    }
    
});

/**
 * @author Michael Rayson
 * @description This method logs the currently signed in user out using the Firebase node.js API. Returns JSON back
 * to the client with a success value of 1 or 0, depending on if the action worked or not.
 */
router.get('/logout', async (req, res) => {
    console.debug('Logout endpoint hit');
    admin.auth().signOut().then(() => {
        console.debug('User signed out successfully');
        res.json({success: 1, message: 'Signed out'});
    }).catch((error) => {
        console.error(error);
        res.json({success: 0, message: 'Error while signing out', payload: error.message});
    })
});

/**
 * @author Michael Rayson
 * @description This method takes the user information stored within the request as a json object with the form
 * {userEmail: string, userPass: string} and passed it through Google Firebase's authentication client for account
 * creation. If it was successful it returns the UID of the created user within a JSON object with a success value of 1.
 * If not, then it returns a success value of 0 along with the error.
 */
router.post('/register', async(req, res) => {
    console.debug('Register endpoint hit');
    userEmail = req.body.userEmail;
    userPass = req.body.userPass;
    // If fields are missing send back error
    if (userEmail == undefined || userPass == undefined) {
        res.json({success: 0, message: 'Missing fields'});
    } else if (!validateEmail(userEmail)){
        res.json({success: 0, message: 'Poorly formatted email'});
    } else {
        admin.auth().createUserWithEmailAndPassword(userEmail, userPass).then((userCredential => {
            console.debug('Successfully created a new user with uid:', userCredential.user.email);
            res.json({success: 1, message: 'Created user', payload: userCredential.user.email });
        })).catch((error) => {
            console.error('Error creating new user: ', error);
            res.json({success: 0, message: 'Error creating user', payload: error.message });
        });
    }
});

/**
 * @author Michael Rayson
 * @description This method will delete the current user from the database. Expects a JSON body of {userEmail: string, userPass: string}
 */
router.delete('/deluser', async(req, res) => {
    console.debug('Delete endpoint hit');
    try {
        userEmail = req.body.userEmail;
        userPass = req.body.userPass;
        admin.auth().signInWithEmailAndPassword(userEmail, userPass).then((userCredential => {
            console.debug('Successfully logged in as uid:', userCredential.user.email);
            const currUser = admin.auth().currentUser;
            currUser.delete().then(() => {
                res.json({success: 1, message: 'User has been deleted'});
            }).catch((err) => {
                res.json({success: 0, message: err});
            });
        })).catch((error) => {
            console.error('Error confirming user: ', error);
            res.json({success: 0, message: error});
        });
    } catch (err){
        res.json({success: 0, message: "Could not delete user", payload: err});
    }
});

/**
 * @author Michael Rayson
 * @description This method will send a password reset email for a given user. Expects a JSON body like {userEmail: string}
 */
router.post('/resetPassword', async (req, res) => {
    console.log('Reset email hit');
    const userEmail = req.body.userEmail;
    if (userEmail == undefined || userEmail.length == 0) {
        res.json({success: 0, message: 'Missing user email'});
    } else if (!validateEmail(userEmail)){
        res.json({success: 0, message: 'Poorly formatted email'});
    } else {
        admin.auth().sendPasswordResetEmail(userEmail)
        .then(() => {
            res.json({success: 1, message: 'Password reset email has been sent'});
        })
        .catch((err) => {
            res.json({success: 0, message: err.message, payload: err.message});
        });
    }
});

/**
 * @description Exporting the router to be used by the server for dealing with requests.
 */
module.exports = router;