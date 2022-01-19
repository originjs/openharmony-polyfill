# Demo Usage
## Autobahn
### 1. Set up WAMP router
First choose the folder to install the router
Install WAMP router with(require access to github):
```
npm install --save git+https://github.com/christian-raedel/nightlife-rabbit
```
To install without github, unrar [node_modules.rar](examples/resources) to the folder to install server

Then create a autobahn_router.js file and copy the following to it:
```js
var http       = require('http')
    , CLogger  = require('node-clogger');

var nightlife  = require('nightlife-rabbit')
    , autobahn = require('autobahn');

// Create a new router with given options. In this example, the options are the
// default values.
var router = nightlife.createRouter({
    httpServer: http.createServer(),                    // Nodes http or https server can be used.
                                                        // httpServer.listen() will be called from
                                                        // within router constructor.

    port: 3000,                                         // The url for client connections will be:
    path: '/nightlife',                                 // ws://localhost:3000/nightlife.

    autoCreateRealms: true,                             // If set to false, an exception will be thrown
                                                        // on connecting to a non-existent realm.

    logger: new CLogger({name: 'nightlife-router'})     // Must be an instance of 'node-clogger'.
                                                        // See http://github.com/christian-raedel/node-clogger
                                                        // for reference...
});
```
The default listening port is 3000, you can adjust it to your server settings. (The path shall not be changed as the demo is using it)
Finally, run the following to start the router:
```
node autobahn_router.js
```
Your router is all set to listen!

### 2. How the demo works
Input the url of your server and press connect to router.
The demo will execute four function on clicking the button:
* Subscribe a topic 'harmonyos.hello')
* Publish "Hello, this is harmonyOS!" onto the topic 'harmonyos.hello'
* Register a function for calling. The function's name is add2 and will add two numbers given by caller and return the result
* Call the function add2 with 2 and 3 as input