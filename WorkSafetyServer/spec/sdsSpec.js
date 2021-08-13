/**
 * @file
 * @author Michael Rayson, Masoumeh Mirzaeepourgelvarzkh
 * @description This file contains the unit testing code for the SDS endpoint.
 */

/**
 * @description Import for the bent module used for testing the endpoints
 */
const bent = require('bent');



/**
* @author Michael Rayson and Masoumeh Mirzaeepourgelvarzkh
* @description This method tests the creation of the user
*/
describe("Saving SDS:", function () {
    it('Successful save an sds sheet', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { name: 'Bleach', manufacturer: 'Valtech Corporation', url: 'https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach' });
        expect(response.success).toBe(1);
    });
    it('Unsuccessful save an sds sheet, missing name', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { name: '', manufacturer: 'Valtech Corporation', url: 'https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach' });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful save an sds sheet, missing manufacturer', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { name: 'Bleach', manufacturer: '', url: 'https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach' });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful save an sds sheet, missing url', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { name: 'Bleach', manufacturer: 'Valtech Corporation', url: '' });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful save an sds sheet, missing json body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful save an sds sheet, missing name in json body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { manufacturer: 'Valtech Corporation', url: 'https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach' });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful save an sds sheet, missing manufacturer in json body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { name: 'Bleach', url: 'https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach' });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful save an sds sheet, missing url in json body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('sds', { name: 'Bleach', manufacturer: 'Valtech Corporation' });
        expect(response.success).toBe(0);
    });
});

/**
 * @author Michael Rayson and Masoumeh Mirzaeepourgelvarzkh
 * @description This method tests the testing searching endpoint SDS sheet of the user
 */
describe("testing searching endpoint SDS sheet:", function () {
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });
    it('Successful SDS search', async () => {
        const get = bent('http://localhost:3000/', 'json');
        const response = await get('sds/bleach');
        expect(response.success).toBe(1);
    });
    it('unsuccessful SDS search, result does not exist', async () => {
        const get = bent('http://localhost:3000/', 'json');
        const response = await get('sds/alskdjlkasjdlkasjd');
        expect(response.success).toBe(0);
    });
    it('unsuccessful SDS search, missing search criteria', async () => {
        const get = bent('http://localhost:3000/', 'json');
        // This request should return a 404 page since there is no endpoint for a get request at /sds/
        try {
            const response = await get('sds/');
            // if it gets a response tthe endpoint is behaving poorly
            expect(false)
        } catch (err) {
            // if it throws an error (404 page sent back) it is behaving as expected
            expect(true);
        }
    });
});
