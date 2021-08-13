/**
 * @file
 * @author Michael Rayson, Masoumeh Mirzaeepourgelvarzkh
 * @description This file acts as the 'main' file running the server instance. It contains the code needed for 
 * instantiating the middlewares and routing traffic to the appropriate routers.
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/config');

/**
 * @author Michael Rayson
 * @description Variable used to store the express server. Allows for control over various middlewares and routes.
 */
const server = express();

/**
 * @author Michael Rayson
 * @description Instantiation of the 'cors' middleware that allows cross-origin requests 
 * meaning that our backend will allow requests from external sources (like the react-native application).
 */
server.use(cors());

/**
 * @author Michael Rayson
 * @description Instantiation of the 'express.json()' middleware that allows the server to parse JSON objects from
 * request bodies.
 */
server.use(express.json());

/**
 * @author Masoumeh Mirzaeepourgelvarzkh
 * @description Sanity check for the server running.
 */
server.get('/', (req, res) => {
    res.send('Sample root page');
});

/**
 * @author Michael Rayson
 * @description Initialization of the /sds route which tells the server to use the router exported in the
 * ./route/sds file for any requests on the /sds route.
 */
server.use('/sds', require('./route/sds'));

server.use('/user', require('./route/user'));

server.use('/worksite', require('./route/worksite'));

/**
 * @author Michael Rayson
 * @description Setting the server to listen on a given port and providing an output to the console to ensure 
 * visibility that it is running.
 */
server.listen(config.port, () => {
    console.debug(`Server is listening on http://localhost:${config.port}`);
});
