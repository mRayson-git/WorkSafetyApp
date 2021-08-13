/**
 * @file
 * @author Michael Rayson
 * @description This file contains the unit testing code for the user endpoint. It will check creation/logging in/logging out/deletion.
 */

/**
 * @description Import for the bent module used for testing the endpoints
 */
const bent = require('bent');

/**
 * @author Michael Rayson
 * @description This method tests the creation of the user
 */
describe("User creation:", function() {
    it('Unsuccessful user creation, missing body', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user creation, missing userEmail in body', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', { userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user creation, missing userPass in body', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', {userEmail: 'test@gmail.com'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user creation, userEmail is blank', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', {userEmail: '', userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user creation, userPass is blank', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', {userEmail: 'test@gmail.com', userPass: ''});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user creation, userEmail poorly formatted', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', {userEmail: 'testgmail.com', userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Successful user creation send back email', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', {userEmail: 'test@gmail.com', userPass: 'Apple123'});
        expect(response.success).toBe(1);
    });
    it('Unsuccessful user creation, userEmail already in use', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/register', {userEmail: 'testgmail.com', userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
});

/**
 * @author Michael Rayson
 * @description This method tests authentication of the user
 */
describe("User authentication:", () => {
    it('Successful user login', async () => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userEmail: 'test@gmail.com', userPass: 'Apple123'});
        expect(response.success).toBe(1);
    });
    it('Unsuccessful user login, no userEmail', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userEmail: '', userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user login, no userPass', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userEmail: 'test@gmail.com', userPass: ''});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user login, wrong password', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userEmail: 'test@gmail.com', userPass: 'Apple12'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user login, missing body', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user login, missing userPass in body', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userEmail: 'test@gmail.com'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user login, missing userEmail in body', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userPass: 'Apple12'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user login, poorly formatted userEmail', async() => {
        const post = bent('http://localhost:3000/', 'POST', 'json', 200);
        const response = await post('user/login', {userEmail: 'testgmail.com', userPass: 'Apple12'});
        expect(response.success).toBe(0);
    });
});

/**
 * @author Michael Rayson
 * @description This tests the deletion of users
 */
describe("User deletion:", () => {
    it('Unsuccessful user deletion, missing userEmail', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userEmail: '', userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user deletion, missing userPass', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userEmail: 'test@gmail.com', userPass: ''});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user deletion, missing userEmail in body', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user deletion, missing userPass in body', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userEmail: 'test@gmail.com'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user deletion, missing body', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser');
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user deletion, poorly formatted email', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userEmail: 'testgmail.com', userPass: 'Apple123'});
        expect(response.success).toBe(0);
    });
    it('Unsuccessful user deletion, wrong password', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userEmail: 'testgmail.com', userPass: 'Apple23'});
        expect(response.success).toBe(0);
    });
    it('Successful user deletion', async () => {
        const post = bent('http://localhost:3000/', 'DELETE', 'json', 200);
        const response = await post('user/deluser', {userEmail: 'test@gmail.com', userPass: 'Apple123'});
        expect(response.success).toBe(1);
    });
});
/**
 * @author Michael Rayson
 * @description This tests the passwordReset endpoint
 */
// describe("Password reset", () => {
//     it('Successful password reset', async() => {
//         const post = bent('http://localhost:3000/', 'POST', 'json', 200);
//         const response = await post('user/resetPassword', {userEmail: 'mrayson5129@gmail.com'});
//         expect(response.success).toBe(1);
//     });
//     it('Unsuccessful password reset, missing body', async() => {
//         const post = bent('http://localhost:3000/', 'POST', 'json', 200);
//         const response = await post('user/resetPassword');
//         expect(response.success).toBe(0);
//     });
//     it('Unsuccessful password reset, empty email', async() => {
//         const post = bent('http://localhost:3000/', 'POST', 'json', 200);
//         const response = await post('user/resetPassword', {userEmail: ''});
//         expect(response.success).toBe(0);
//     });
//     it('Unsuccessful password reset, invalid email', async() => {
//         const post = bent('http://localhost:3000/', 'POST', 'json', 200);
//         const response = await post('user/resetPassword', {userEmail: 'mrayson5129gmail.com'});
//         expect(response.success).toBe(0);
//     });
//     it('Unsuccessful password reset, invalid user', async() => {
//         const post = bent('http://localhost:3000/', 'POST', 'json', 200);
//         const response = await post('user/resetPassword', {userEmail: 'thisuserdoesnotexist@gmail.com'});
//         expect(response.success).toBe(0);
//     });
// });

