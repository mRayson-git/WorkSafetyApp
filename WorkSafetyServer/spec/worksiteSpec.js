/**
 * @file
 * @author Michael Rayson, Masoumeh Mirzaeepour
 * @description 
 */

/**
 * @description Import for the bent module used for testing the endpoints
 */
const bent = require('bent');

/**
 * @author Michael Rayson, Masoumeh Mirzaeepour
 * @description This method tests the creation of a worksite
 */
describe("Create worksite :", function () {
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });
    it('Unsuccessful create worksite, missing body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, missing worksiteName in body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteAddr": "123TestStreet",
            "worksiteProc": "Wear gloves",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, missing worksiteAddr in body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteProc": "Wear gloves",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, missing worksiteProc in body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteAddr": "123TestStreet",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, missing worksiteSDS in body', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteAddr": "123TestStreet",
            "worksiteProc": "Wear gloves",
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, worksiteName blank', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "",
            "worksiteAddr": "123TestStreet",
            "worksiteProc": "Wear gloves",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, worksiteSDS blank', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteAddr": "123TestStreet",
            "worksiteProc": "Wear gloves",
            "worksiteSDS" : []
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, worksiteAddr blank', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteAddr": "",
            "worksiteProc": "Wear gloves",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful create worksite, worksiteProc blank', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteAddr": "123TestStreet",
            "worksiteProc": "",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(0);
    });
    it('Successful create worksite', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('worksite', {
            "worksiteName": "UnitTestSite",
            "worksiteAddr": "123TestStreet",
            "worksiteProc": "Wear gloves",
            "worksiteSDS" : [
                {
                    "name": "Bleach",
                    "manufacturer": "Valtech Corporation",
                    "url": "https://www.chemicalsafety.com/sds1/sdsviewer.php?id=30599427&name=Bleach"
                }
            ]
        });
        expect(response.success).toBe(1);
    });
});

/**
 * @author Michael Rayson, Masoumeh Mirzaeepour
 * @description This method tests the addition of users to a worksite
 */
describe("Add user to worksite :", function () {
    it('Successfully add user to worksite', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "worksiteName": "UnitTestSite",
            "userEmail": "mrayson5129@gmail.com"
        });
        expect(response.success).toBe(1);
    });
    it('Unsuccessful add user to worksite, missing body ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful add user to worksite, email blank ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "worksiteName": "UnitTestSite",
            "userEmail": ""
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful add user to worksite, email poorly formatted ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "worksiteName": "UnitTestSite",
            "userEmail": "mrayson5129gmail.com"
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful add user to worksite, worksite name blank ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "worksiteName": "",
            "userEmail": "mrayson5129gmail.com"
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful add user to worksite, userEmail missing from body ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "worksiteName": "UnitTestSite"
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful add user to worksite, worksiteName missing from body ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "userEmail": "mrayson5129gmail.com"
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful add user to worksite, user already in worksite ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('addUser', {
            "userEmail": "mrayson5129gmail.com"
        });
        expect(response.success).toBe(0);
    });
   
});

/**
 * @author Michael Rayson, Masoumeh Mirzaeepour
 * @description This method tests the removal of users from a worksite
 */
describe("Remove user from worksite :", function () {
    it('Unsuccessful remove user from worksite, missing body ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful remove user from worksite, missing worksiteName from json ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser', {
            "userEmail": "mrayson5129@gmail.com"
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful remove user from worksite, missing userEmail from json ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser', {
            "worksiteName": "UnitTestSite",
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful remove user from worksite, userEmail blank ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser', {
            "worksiteName": "UnitTestSite",
            "userEmail": ""
        });
        expect(response.success).toBe(0);
    });
    it('Unsuccessful remove user from worksite, worksiteName blank ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser', {
            "worksiteName": "",
            "userEmail": "mrayson5129@gmail.com"
        });
        expect(response.success).toBe(0);
    });
    it('Successfully remove user from worksite', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser', {
            "worksiteName": "UnitTestSite",
            "userEmail": "mrayson5129@gmail.com"
        });
        expect(response.success).toBe(1);
    });
    it('Unsuccessful remove user from worksite, user not in worksite ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('removeUser', {
            "worksiteName": "UnitTestSite",
            "userEmail": "mrayson5129@gmail.com"
        });
        expect(response.success).toBe(0);
    });
    
});

/**
 * @author Michael Rayson, Masoumeh Mirzaeepour
 * @description This method tests the retreival of worksite data
 */
describe("Get worksite data :", function () {
    it('Successful get worksite data', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('getData', {"worksiteName": "UnitTestSite"});
        expect(response.success).toBe(1);
    });
    it('Unsuccessful get worksite data, body missing ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('getData');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful get worksite data, worksite name blanks ', async () => {
        const post = bent('http://localhost:3000/worksite/', 'POST', 'json', 200);
        const response = await post('getData', {"worksiteName": ""});
        expect(response.success).toBe(0);
    });
});

/**
 * @author Michael Rayson, Masoumeh Mirzaeepour
 * @description This method tests the deletion of a worksite
 */
 describe("Delete worksite :", function () {
    it('Unsuccessful delete worksite, missing body', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful delete worksite, worksiteName blank', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('', {"worksiteName": ""});
        expect(response.success).toBe(0);
    });
    it('Successful delete worksite', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('', {"worksiteName": "UnitTestSite"});
        expect(response.success).toBe(1);
    });
    it('Unsuccessful delete worksite, worksite does not exist', async () => {
        const post = bent('http://localhost:3000/worksite/', 'DELETE', 'json', 200);
        const response = await post('', {"worksiteName": "UnitTestSite"});
        expect(response.success).toBe(0);
    });
});
