# Stoclog
Developer tool allowing for sending server-side console logs to the client.

# Why?
Because there are times when you want to figure out what is the value or state that some variable contains, but some data structures are just too big to be read in the terminal, so you have to scroll them up and down trying to understand what is where. It can be awfully irritable.  
And that's where ```Stoclog``` runs to help.  
```Stoclog``` stands for **s**erver **to** **c**lient **log**

# How to use
Call global ```Stoclog()``` function in the browser console and get server logs.
```Stoclog()``` called without arguments will return last server ```console.log```.  
To offload multiple logs, call ```Stoclog({ get: numberToFetch })```, where ```numberToFetch``` is a number of logs that you want to output to your browser console.
To remove all stored ```console.logs``` on the server-side, call ```Stoclog({ remove: true })```.  

---

If you don't like having ```Stoclog``` global function on your ```window``` object, rename it to the name you like with ```Stoclog.renameTo(newName)```.


# How to install
First of all, load package
```js
npm install stoclog
```
which will also load additional package ```stoclog-middleware``` for setting up server-side.  
### Setting up client

```js
import 'stoclog';
```

or

```js
require('stoclog');
```
if you use bundler or include script onto the html page through ```script``` tag.  
This is all you need to do to set up the client part.

### Setting up the server
```stoclog-middleware``` is for server-side, and it's a function. And it must be called to set up server-side connection.  
```stoclog-middleware``` requires at least one argument, which should be a ```http.Server``` instance for the middleware to attach to.  
Like that
```js
const http = require('http');
const server = http.createServer(...);
require('stoclog-middleware')(server);
```
If you use ```express``` and didn't initialize ```http.Server``` yourself, ```express``` returns ```http.Server``` instance on ```.listen()``` method call.
```js
const server = expressApp.listen(...);
require('stoclog-middleware')(server);
```
Same goes for ```koa```
```js
const server = koaApp.listen(...);
require('stoclog-middleware')(server);
```
```hapi``` holds ```http.Server``` instance within itself after initialization as ```.listener``` property.
```js
const hapiServer = Hapi.server(...);
require('stoclog-middleware')(hapiServer.listener);
```
If you use some other framework, just find where it holds ```http.Server``` instance and get it.  
And that is all that is required to set up the server part.

The second argument to ```stoclog-middleware()``` is an optional options object, that may help customize some of the middleware behavior.
Option keys are:
* ```maxLoggerCapacity``` - a number of logs that middleware will contain within itself for fetching. After the number of stored logs exceeds this limit, old logs will get truncated. (default value: ```20```)
* ```saveLogFuncName``` - name of function to save logs in internal middleware storage. (initially, middleware just hooks up to ```console.log```) The new function will be attached to ```console``` global object, and ```console.log``` itself will remain unmodified. 

Example of using ```saveLogFuncName``` option:
```js
require('stoclog-middleware')(httpServerInstance, { saveLogFuncName: 'toClient' });
// ....
console.toClient(dataForClient)
// function will save dataForClient within middleware storage for fetching, but doesn't output anything
// in the terminal
console.log('asdf');
// => 'asdf'
// just outputs string, doesn't save anything in the storage
```
