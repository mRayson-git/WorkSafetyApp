# WorkSafetyApplication

## Project Description
The WorkSafetApp project has the aim of connecting construction workers who needs access to SDS information quickly and simply. The targeted audience is for maximum accessibility as contruction workers of all ages and technological skill levels would be interacting with this device. On top of that the environment in which the application is in use could vary immensly from indoor to outdoors under the sun. For this reason the client-side application has the full width, large buttons for easy access, along with high contrasting colours to easily direct the users eyesight.

This project contains 2 different components:
* Server-side
  * Built with [Node.js](https://nodejs.org/en/)
  * Handles connection with the google firebase authentication
  * Hanldes the different CRUD requests for users, sds sheets, and worksites
* Client-side
  * Built using [React-Native](https://reactnative.dev/) & [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
  * Handles user interaction
  * Communicates with the server-side using [fetch](https://reactnative.dev/docs/network)

## Project File Layout
Following the description of this project, the layout is split into 2 separate locations:
* WorkSafetyServer
  * Contains the node.js server code
    * [Routes](./WorkSafetyServer/route)
    * [UnitTests](./WorkSafetyServer/spec)
    * Certain data (SDS sheets & worksites)
* WorkSafetyApp
  * Contains the React-Native code
    * [App.js](./WorkSafetyApp/App.js) (root component)
    * Pages are stored in the [pages folder](./WorkSafetyApp/pages)

## Getting Started
1. Clone this repo (make sure you're cloning the development branch)
2. Run ```npm install``` in the 'WorkSafetyServer' (will install necessary node modules for Node.js server)
3. Run ```npm install``` in the 'WorkSafetyApp' directory (will install necessary node modules for React-Native application)
4. Run ```npm install -g expo-cli``` to install the expo-cli tools globally for use with the client-side of this project

## Instructions for Implementation
:warning: This is a prototype project and not meant for production environment. Some functionality may be missing. :warning:

As of the development of this prototype all the code assumes the server is running on the same machine as the client (all addresses called are for http://localhost ). This means that if you attempt to run this on an external machine (like a phone) without modifying the fetch calls within the different pages the application will crash. Our current method of testing and demonstrating the code is as follows:
1. ```cd WorkSafetyServer``` to get into the server-side directory.
2. Start the server in development mode (sets the server listening on port 3000) using the command ```npm dev```
3. Test server functionality using the command ```npm test``` or ```npm testLinux``` if using / for directory traversal
4. ```cd ..\WorkSafetyApp``` to get into the client-side directory.
5. Start the client side in development mode using the command ```expo start --web``` :warning: This will automatically open your browser to the client-side interface
6. At this point it is recommended to open up the web development tools on your browser and toggle the mobile view
7. Refresh the page and you're ready to go.

In order to run this on a mobile device it is recommended that a new branch is created from the development branch and the fetch calls be altered to the public ip of wherever your server is running. At that point start the server in '--web' mode where you will see a QR code generated. You can then use [Expo Go(ios)](https://apps.apple.com/ca/app/expo-go/id982107779) or [Expo Go(android)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_CA&gl=US) to connect to the running application and display the client-side.

## Instructions for Production Environment
While at the moment we do not have ways to properly test the production environment capabilities of this application, the changes should not be too large (excluding the swap from the web-scraping approach for open source SDS to an API call for proprietary SDS).
1. Alter the port the server-side application is running on to whichever you need. This can be done through the [.env file](./WorkSafetyServer/.env)
2. Theres no production configuration setup for the server side so you could then just run it using ```npm dev``` from inside the server-side directory.
3. Alter the fetch calls within the client-side application to reflect the new public ip the server-side application is running on.
4. Build the mobile application using ```expo build:android -t apk``` for android or ```expo build:ios``` for apple devices. Further information on this subject can be found in the [Expo Documentation](https://docs.expo.dev/distribution/building-standalone-apps/)