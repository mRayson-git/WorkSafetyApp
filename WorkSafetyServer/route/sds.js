/**
 * @file
 * @author Michael Rayson
 * @description This file serves as a router for the backend. It handles the '/sds/' route from from server
 * and is used for returning either a list of results from the SDS database or a png file of the SDS needed.
 */

/**
 * @description Express package is mandatory for providing the router.
 */
const express = require('express');

/**
 * @description The fs package is required for reading the directory and image details when theyre saved locally.
 */
const fs = require('fs');

/**
 * @description The puppeteer package is used for manipulating the web-scraping process for collecting the SDS
 * information.
 */
const puppeteer = require('puppeteer');

/**
 * @description Creation of an express Router which can be exported for use by the server when dealing with requests.
 */
const router = express.Router();

/**
 * @author Michael Rayson
 * @description This method takes the route /sds/:productIdentifier (be it a string for the product name or an int for the
 * CAS value), and searches through the SDS database located https://chemicalsafety.com/sds-search/. It sends a JSON object
 * back to the client with a form {success: int, message: string, payload: arr}. 
 * A success value of 1 means it worked, a value of 0 means it did not.
 * The message value is just for debugging purposes.
 * The payload will be an array of search results (product name & manufacturer) or will be empty if no results exist.
 */
router.get('/:productIdentifier', async (req, res) => {
    let resultsSent = false;
    if (!req.params.productIdentifier) {
        res.json({success: 0, message: "No search criteria given"});
    } else {
        try {
            let productIdentifier = req.params.productIdentifier;
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            console.debug('Heading to sds search site...');
            await page.goto('https://chemicalsafety.com/sds-search/', { waitUntil: "networkidle0" });
            // check if productidentifier is number or not
            if (isNaN(productIdentifier)) {
                console.debug(`Searching using product name '${productIdentifier}'...`);
                await page.type('input[name=cs_txtSubstance]', productIdentifier);
            } else {
                console.debug(`Searching using product CAS code '${productIdentifier}'...`);
                await page.type('input[name=cs_txtCas', productIdentifier);
            }
            await page.click(['input[type=submit']);
            console.debug('Getting results...');
            // Check if there are any results
            try {
                await page.waitForXPath('//*[@id="cs_divResults"]/table/tbody/tr[1]/td[1]/a', {timeout: 3000});
                // Assuming there are results
                let options = []
                for (i = 1; i > 0; i ++) {
                    try {
                        // Check if exists
                        await page.waitForXPath(`//*[@id="cs_divResults"]/table/tbody/tr[${i}]/td[1]`, {timeout: 500});
                        // Get productName
                        let [elements] = await page.$x(`//*[@id="cs_divResults"]/table/tbody/tr[${i}]/td[1]`);
                        let productName = await page.evaluate(element => element.textContent, elements);
                        // Get productManufacturer 
                        [elements] = await page.$x(`//*[@id="cs_divResults"]/table/tbody/tr[${i}]/td[2]`);
                        let productManufacturer = await page.evaluate(element => element.textContent, elements);
                        // Get productUrl
                        [elements] = await page.$x(`//*[@id="cs_divResults"]/table/tbody/tr[${i}]/td[1]/a`);
                        let productUrl = await (await elements.getProperty('href'))._remoteObject.value;
                        options.push({name: productName, manufacturer: productManufacturer, url: productUrl});   
                    } catch (err) {
                        // No more elements
                        if (options.length > 0) {
                            console.error('Sending results');
                            res.json({success: 1, message: 'Retrieved products', payload: options});
                            browser.close();
                            return;
                        } else {
                            console.error('Sending no results found');
                            res.json({success: 0, message: 'No results were found :('});
                            browser.close();
                            return;
                        }
                    }   
                }  
            } catch (err) {
                res.json({success: 0, message: 'No results were found :('});
                browser.close();
                return;
            }
        } catch (err) { 
            console.log(err);
        }
    }
    
});

/**
 * @author Michael Rayson, Masoumeh Mirzaeepourgelvarzkh
 * @description This method deals with post requests to the '/sds/:productName' route. It expects the body of the post request
 * to contain a product object ({name: string, manufacturer: string, url: string}) so that it can either check to see if the 
 * sds sheet is cached locally, or retrieve it from the opensource database and send it to the client.
 */
router.post('/', async(req, res) => {
    let savedLocally = false;
    const product = req.body;

    if (product.name == undefined || product.name == '' || product.manufacturer == undefined || product.manufacturer == ''|| product.url == undefined|| product.url == '') {
        res.json({success: 0, message: 'Missing parameters'});
    }else {
        // Clean the product name and manufacturer for file destination
        product.name = product.name.split(' ').join('_');
        product.name = product.name.replace(/([^a-z0-9]+)/gi, '-');
        product.manufacturer = product.manufacturer.split(' ').join('_');
        product.manufacturer = product.manufacturer.replace(/([^a-z0-9]+)/gi, '-');

        const fileName = `${product.name}_${product.manufacturer}.png`;
        // Check if file is hosted locally
        let dir = fs.readdirSync('SavedSheets/tmp');
        console.log(dir);
        for (file of dir) {
            if (file == fileName) {
                console.log('Setting savedLocally = true');
                savedLocally = true;
                // read the file
                fs.readFile(`SavedSheets/tmp/${fileName}`, (err, data) => {
                    if (err) throw err;
                    const base64 = data.toString('base64');
                    res.json({success: 1, message: 'Image saved locally', payload: base64});
                });
            }
        }
        if (!savedLocally) {
            console.log('Not savedLocally')
            try {
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                console.debug(`Going to simple SDS sheet view at ${product.url}`);
                await page.goto(product.url, { waitUntil: "networkidle0" });
                await page.emulateMediaType('screen');
                console.debug('Capturing simple SDS sheet as png');
                // Saving image locally for this sprint
                await page.screenshot({path: `SavedSheets/tmp/${fileName}`, fullPage: true});
                fs.readFile(`SavedSheets/tmp/${fileName}`, (err, data) => {
                    if (err) throw err;
                    const base64 = data.toString('base64');
                    res.json({success: 1, message: 'Image saved locally', payload: base64});
                });
                browser.close();
            } catch (err) {
                console.debug(err);
                res.json({success: 0, message: 'Was not able to save sds sheet to server'});
            }
        }
    }
});

/**
 * @description Exporting the router to be used by the server for dealing with requests.
 */
module.exports = router;