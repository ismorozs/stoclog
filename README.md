# Stoclog
Developer tool allowing for sending server-side console logs to the client.

# Why?
Because there are times when you want to figure out what is the value or state that some variable contains, but some data structures are just too big to be read in the terminal, so you have to scroll them up and down trying to understand what is where. It can be awfully irritable.  
And that's where ```Stoclog``` runs to help.  
```Stoclog``` stands for **s**erver **to** **c**lient **log**

---

Possible advantages over the native solution:
* Loads logs of the desired type on demand onto the console in the browser tab, meaning you don't need to watch and rummage in a waterfall of logs in a detached console
* Types of logs can be user-defined
* Works in any browser (of popular ones at least)
* Easily allows to set up as many client-server connections as many running servers and open tabs you have
* Allows to name server-side variables and check their state in the browser console by referencing them by name


# How to use
## On the client
Logs are fetched on the call of ```Stoclog``` and its sub-specificators.
#### Stoclog ()
Returns predefined (```5```) number of last server logs.
#### Stoclog (Number n)
Returns ```n``` last logs.
#### Stoclog.remove()
Removes all stored logs on the server.
#### Stoclog.get(String variableName)
Returns ```console.saveState()```ed variable from the server, and saves it in ```Stoclog.$``` object, for playing and fiddling if needed.
```js
// server-side
console.saveState('myAwesomeState', { x: 1 });

// client-size
Stoclog.get('myAwesomeState');
Stoclog.$.myAwesomeState
=> { x: 1 }
```

To get particular type of logs, call ```Stoclog[type]()```.
```js
Stoclog.warn()
=> last 5 warning logs
```
Particular number of logs of particular type:
```js
Stoclog.error(2)
=> last 2 error logs
```
Remove particular type of logs
```js
Stoclog.info.remove();
// all logs of 'info' category are removed now
```

If you defined custom logs on the server, you call ```Stoclog[customLogName]``` to get them.

To redefine the default number for fetching logs call ```Stoclog.defaultFetchNumber(num)```, with ```num``` to be the number of logs to load when the number isn't specified.

---

If you don't like having ```Stoclog``` global function on your ```window``` object, rename it to the name you like with ```Stoclog.renameTo(newName)```.

## On the server
Just use the family of ```console``` methods, or if you defined your own log types, call them on the ```console``` object as well.
```js
console.myTypeOfLog('Foo Bar');
```

To save the value of some variable for the client to pick it up later, call ```console.saveState(uniqueId, value)``` (example is described a little above)


# How to install
First of all, load package
```js
npm install stoclog
```
which will also load additional package ```stoclog-middleware``` for setting up server-side.  
## Setting up client

```js
import 'stoclog';
```

or

```js
require('stoclog');
```
if you use bundler or include script onto the html page through ```script``` tag.
This is all you need to do to set up the client part.

## Setting up server
```stoclog-middleware``` is for server-side, it's a function. And it must be called to set up server-side connection.  
```stoclog-middleware``` requires at least one argument, which should be a ```http.Server``` instance for the middleware to attach to.  
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
That is all that is required to set up the server part.

The second argument to ```stoclog-middleware()``` is an optional options object, that may help customize some of the middleware behavior.
Option keys are:
* ```maxLoggerCapacity``` - a number of logs that middleware will contain within itself for fetching. After the number of stored logs exceeds this limit, old logs will get truncated. (default value: ```50```)
* ```userLogs``` - the array of log types that will be attached to ```console``` and use ```console.log()``` behavior, but you will be able to fetch logs with given particular names. 

```js
// server-side
require('stoclog-middleware')(httpServerInstance, { userLogs: ['db', 'somethingImportant'] });
console.db('connection established')
console.somethingImportant('IT HAPPENS!');

// client-side
Stoclog.db();
=> 'connection established'
Stoclog.somethingImportant();
=> 'IT HAPPENS'
```
