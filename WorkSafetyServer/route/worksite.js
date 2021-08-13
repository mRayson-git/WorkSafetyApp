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
 * @description Filesystem package needed for creating directory / writing files
 */
 const fs = require('fs');
 /**
 * @description Creation of an express Router which can be exported for use by the server when dealing with requests.
 */
const router = express.Router();
/**
 * @description The puppeteer package is used for manipulating the web-scraping process for collecting the SDS
 * information.
 */
 const puppeteer = require('puppeteer');

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
 * @description This route is used for creating worksites. Expects a json body of
 * {"worksiteName": "string", "worksiteAddr": "string", "worksiteProc": "string", "worksiteUsers": ["string"], "worksiteSDS": [{name: string, manufacturer: string, url: string}]}
 */
router.post('/', async (req, res) => {
    try {
        let worksiteName = req.body.worksiteName;
        let worksiteAddr = req.body.worksiteAddr;
        let worksiteProc = req.body.worksiteProc;
        let worksiteUsers = []
        let worksiteSDS = []
        for (let SDS of req.body.worksiteSDS) {
            worksiteSDS.push(SDS);
        }
        if (worksiteName == undefined || worksiteName.length == 0 ||
            worksiteAddr == undefined || worksiteAddr.length == 0 ||
            worksiteProc == undefined || worksiteProc.length == 0 ||
            worksiteSDS == undefined || worksiteSDS.length == 0) {
                res.json({success: 0, message: "Could not create worksite, missing values"});
        } else {
            const worksiteDir = `SavedSheets/worksites/${worksiteName}`;
            const worksiteSDSDir = `SavedSheets/worksites/${worksiteName}/sheets`;
            // Create the directories
            fs.mkdirSync(worksiteDir);
            fs.mkdirSync(worksiteSDSDir);
            // Create worksite obj
            let worksite = {
                worksiteName: worksiteName,
                worksiteAddr: worksiteAddr,
                worksiteProc: worksiteProc,
                worksiteUsers: worksiteUsers,
                worksiteSDS: worksiteSDS
            }
            // Write worksite obj
            fs.writeFileSync(`${worksiteDir}/${worksite.worksiteName}-worksite.json`, JSON.stringify(worksite));
            
            // Get the SDS sheets in the directory
            let dir = fs.readdirSync(worksiteSDSDir);
            // Add SDS sheets to the worksite folder
            for (let sds of worksiteSDS){
                sds.name = sds.name.split(' ').join('_');
                sds.name = sds.name.replace(/([^a-z0-9]+)/gi, '-');
                sds.manufacturer = sds.manufacturer.split(' ').join('_');
                sds.manufacturer = sds.manufacturer.replace(/([^a-z0-9]+)/gi, '-');

                const fileName = `${sds.name}_${sds.manufacturer}.png`;
                let savedLocally = false;
                // Check if they exist already
                for (let file of dir){
                    if (file === fileName) {
                        savedLocally = true;
                    }
                }
                // Find and retreive
                if (!savedLocally) {
                    try {
                        const browser = await puppeteer.launch({ headless: true });
                        const page = await browser.newPage();
                        console.debug(`Going to simple SDS sheet view at ${sds.url}`);
                        await page.goto(sds.url, { waitUntil: "networkidle0" });
                        await page.emulateMediaType('screen');
                        console.debug('Capturing simple SDS sheet as png');
                        // Saving image locally for this sprint
                        await page.screenshot({path: `${worksiteSDSDir}/${fileName}`, fullPage: true});
                        browser.close();
                    } catch (err) {
                        console.debug(err);
                    }
                }
            }
            res.json({success: 1, message: 'Worksite created!', payload: JSON.stringify(worksite)});
        }
    } catch (err) {
        res.json({success: 0, message: 'Could not create worksite', payload: err.message});
    }
});

/**
 * @description This route deletes a given worksite. Expects a json body of
 * {"worksiteName": "string"}
 */
router.delete('/', (req, res) => {
    // get the worksite name
    let worksiteName = req.body.worksiteName;
    const worksiteDir = `SavedSheets/worksites/${worksiteName}`;
    if (worksiteName == undefined || worksiteName.length == 0){
        res.json({success: 0, message: "missing worksite name"});
    } else if(!fs.existsSync(worksiteDir)) {
        res.json({success: 0, message: "worksite does not exist"});
    } else {
        try {
            fs.rmdirSync(worksiteDir, {recursive: true});
            res.json({success: 1, message: 'Worksite removed'});
        } catch (err) {
            res.json({success: 0, message: 'Could not remove worksite', payload: err.message});
        }
    }
});

/**
 * @description This route is used for updating worksites. Expects a json body of
 * {"worksiteName": "string", "worksiteAddr": "string", "worksiteProc": "string", "worksiteUsers": ["string"], "worksiteSDS": [{name: string, manufacturer: string, url: string}]}
 */
router.put('/', async (req, res) => {
    try {
        let worksiteName = req.body.worksiteName;
        let worksiteAddr = req.body.worksiteAddr;
        let worksiteProc = req.body.worksiteProc;
        let worksiteUsers = []
        let worksiteSDS = []
        for (let SDS of req.body.worksiteSDS) {
            worksiteSDS.push(SDS);
        }
        if (worksiteName == undefined || worksiteName.length == 0 ||
            worksiteAddr == undefined || worksiteAddr.length == 0 ||
            worksiteProc == undefined || worksiteProc.length == 0 ||
            worksiteSDS == undefined || worksiteSDS.length == 0) {
                res.json({success: 0, message: "Could not create worksite, missing values"});
        } else {
            // Directory to write data
            const worksiteDir = `SavedSheets/worksites/${worksiteName}`;
            const worksiteSDSDir = `SavedSheets/worksites/${worksiteName}/sheets`;
            // Create updated worksite
            let worksite = {
                worksiteName: worksiteName,
                worksiteAddr: worksiteAddr,
                worksiteProc: worksiteProc,
                worksiteUsers: worksiteUsers,
                worksiteSDS: worksiteSDS
            }
            // Write worksite obj
            fs.writeFileSync(`${worksiteDir}/${worksite.worksiteName}-worksite.json`, JSON.stringify(worksite));
            // Get the SDS sheets in the directory
            let dir = fs.readdirSync(worksiteSDSDir);
            // Add SDS sheets to the worksite folder
            for (let sds of worksiteSDS){
                sds.name = sds.name.split(' ').join('_');
                sds.name = sds.name.replace(/([^a-z0-9]+)/gi, '-');
                sds.manufacturer = sds.manufacturer.split(' ').join('_');
                sds.manufacturer = sds.manufacturer.replace(/([^a-z0-9]+)/gi, '-');

                const fileName = `${sds.name}_${sds.manufacturer}.png`;
                let savedLocally = false;
                // Check if they exist already
                for (let file of dir){
                    if (file === fileName) {
                        savedLocally = true;
                    }
                }
                // Find and retreive
                if (!savedLocally) {
                    try {
                        const browser = await puppeteer.launch({ headless: true });
                        const page = await browser.newPage();
                        console.debug(`Going to simple SDS sheet view at ${sds.url}`);
                        await page.goto(sds.url, { waitUntil: "networkidle0" });
                        await page.emulateMediaType('screen');
                        console.debug('Capturing simple SDS sheet as png');
                        // Saving image locally for this sprint
                        await page.screenshot({path: `${worksiteSDSDir}/${fileName}`, fullPage: true});
                        browser.close();
                    } catch (err) {
                        console.debug(err);
                    }
                }
            }
            res.json({success: 1, message: `${worksite.worksiteName} updated`, payload: JSON.stringify(worksite)});
        }
    } catch (err) {
        res.json({success: 0, message: `Would not update ${worksite.worksiteName}`, payload: err.message});
    }
});

/**
 * @description This route is used for reading worksites. Expects a json body of
 * {"worksiteName": "string"}
 */
router.post('/getData', (req, res) => {
    let worksiteName = req.body.worksiteName;
    const worksitePath = `SavedSheets/worksites/${worksiteName}/${worksiteName}-worksite.json`;
    try {
        let worksite = JSON.parse(fs.readFileSync(worksitePath));
        res.json({success: 1, message: `Retrieved information for ${worksiteName}`, payload: worksite});
    } catch (err) {
        res.json({success: 0, message: `Could not retrieve data for ${worksiteName}`, payload: err.message});
    }
});

/**
 * @description This route is used for adding a user to a worksite. Expects a json body of
 * {"worksiteName": "string", "userEmail": "string"}
 */
router.post('/addUser', (req, res) => {
    // get worksite name
    let worksiteName = req.body.worksiteName;
    // get user
    let userEmail = req.body.userEmail;
    // Worksite dir and path
    const worksiteDir = `SavedSheets/worksites/${worksiteName}`;
    const worksitePath = `SavedSheets/worksites/${worksiteName}/${worksiteName}-worksite.json`;
    // Check for missing values
    if (worksiteName == undefined || worksiteName.length == 0 || userEmail == undefined || userEmail.length == 0) {
        res.json({success: 0, message: "missing parameters"});
    } else if (!validateEmail(userEmail)){
        res.json({success: 0, message: "poorly formatted user email"});
    } else {
        try{
            // Read the worksite into memory
            let worksite = JSON.parse(fs.readFileSync(worksitePath));
            // Check if user already in worksite
            let inWorksite = false;
            worksite.worksiteUsers.forEach(user => {
                if (user == userEmail){
                    inWorksite = true;
                }
            });
            if (!inWorksite){
                worksite.worksiteUsers.push(userEmail);
                fs.writeFileSync(`${worksiteDir}/${worksite.worksiteName}-worksite.json`, JSON.stringify(worksite));
                res.json({success: 1, message: `Added ${userEmail} to the ${worksiteName}`});
            } else {
                res.json({success: 0, message: `${userEmail} already in ${worksiteName}`});
            }
        } catch (err) {
            res.json({success: 0, message: `Could not add ${userEmail} to ${worksiteName}`, payload: err.message});
        } 
    }
});

/**
 * @description This route is used for removing users from worksites. Expects a json body of
 * {"worksiteName": "string", "userEmail": "string"}
 */
router.delete('/removeUser', (req, res) => {
    // get worksite name
    let worksiteName = req.body.worksiteName;
    // get user
    let userEmail = req.body.userEmail;
    // Worksite dir and path
    const worksiteDir = `SavedSheets/worksites/${worksiteName}`;
    const worksitePath = `SavedSheets/worksites/${worksiteName}/${worksiteName}-worksite.json`;
    try{
        // Read the worksite into memory
        let worksite = JSON.parse(fs.readFileSync(worksitePath));
        // Remove user
        const index = worksite.worksiteUsers.indexOf(userEmail);
        if (index > -1) {
            worksite.worksiteUsers.splice(index, 1);
        } else {
            res.json({success: 0, message: `${userEmail} was not a user in ${worksiteName}`});
            return;
        }
        fs.writeFileSync(`${worksiteDir}/${worksite.worksiteName}-worksite.json`, JSON.stringify(worksite));
        res.json({success: 1, message: `Removed ${userEmail} to the ${worksiteName}`});
    } catch (err) {
        res.json({success: 0, message: `Could not remove ${userEmail} to ${worksiteName}`, payload: err.message});
    }
});

/**
 * @description This route is used for getting the worksites a user is a part of. Expects a json body of
 * {"userEmail": "string"}
 */
router.post('/getWorksites', (req, res) => {
    let userSites = [];
    // get username
    let userEmail = req.body.userEmail;
    const worksiteDir = `SavedSheets/worksites/`;
    let worksites = fs.readdirSync(worksiteDir);
    for (let worksite of worksites) {
        // Get worksite information
        let worksiteObj = JSON.parse(fs.readFileSync(worksiteDir + `${worksite}/${worksite}-worksite.json`));
        const index = worksiteObj.worksiteUsers.indexOf(userEmail);
        if (index > -1) {
            userSites.push(worksite);
        }
    }
    if (userSites.length > 0) {
        res.json({success: 1, message: `${userEmail} has worksites`, payload: userSites});
    } else {
        res.json({success: 1, message: `${userEmail} has no worksites`, payload: userSites});
    }
});

/**
 * @description This route returns the SDS sheet from a given worksite. Expects a json body of
 * {"worksiteName": "string", "sds": {name: string, manufacturer: string, url: string}}
 */
router.post('/sds', (req, res) => {
    let worksiteName = req.body.worksiteName;
    let sds = req.body.sds;

    sds.name = sds.name.split(' ').join('_');
    sds.name = sds.name.replace(/([^a-z0-9]+)/gi, '-');
    sds.manufacturer = sds.manufacturer.split(' ').join('_');
    sds.manufacturer = sds.manufacturer.replace(/([^a-z0-9]+)/gi, '-');

    const fileName = `${sds.name}_${sds.manufacturer}.png`;
    const worksiteSDSDir = `SavedSheets/worksites/${worksiteName}/sheets`;
    try {
        let sheet = fs.readFileSync(`${worksiteSDSDir}/${fileName}`);
        res.json({success: 1, message: `Retrieved ${fileName}`, payload: sheet.toString('base64')});
    } catch (err) {
        res.json({success: 0, message: `Could not get ${fileName}`, payload: err.message});
    }
});


/**
 * @description Exporting the router to be used by the server for dealing with requests.
 */
 module.exports = router;