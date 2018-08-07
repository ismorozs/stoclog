'use strict';

(function () {

  var GLOBAL_NAME = 'Stoclog';
  var SPECIAL_HEADER_NAME = 'x-operation-with-serverside-logs';
  var NATIVE_METHODS = Object.keys(console);
  var DEFAULT_NUMBER_TO_FETCH = 5;

  window[GLOBAL_NAME] = makeRequest;

  makeRequest.get = function (pointerName) {
    makeRequest(null, pointerName, 'getstate');
  }

  makeRequest.defaultFetchNumber = function (number) {
    DEFAULT_NUMBER_TO_FETCH = number;
  }

  makeRequest.renameTo = function (newGlogalName) {
    window[newGlogalName] = makeRequest;
    delete window[GLOBAL_NAME];
    GLOBAL_NAME = newGlogalName;
  }

  makeRequest.remove = function () {
    makeRequest(null, null, 'remove');
  }

  decorate(NATIVE_METHODS);

  makeRequest.$ = {};

  makeRequest(null, null, 'connect');

  function makeRequest (number, type, operation) {
    operation = operation || 'get';
    type = type || 'all';
    number = number || DEFAULT_NUMBER_TO_FETCH;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/', true);

    xhr.setRequestHeader(SPECIAL_HEADER_NAME, [operation, type, number].join(','));

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          return console.error(
            'Error occured while fetching server logs.\nCode: %s\n%s',
            xhr.status,
            xhr.responseText
          );
        }

        var response = JSON.parse(xhr.response);

        switch (operation) {
          case 'get':
            log(response);
            break;

          case 'getstate':
            makeRequest.$[type] = response;
            console.log(response);
            break;

          case 'remove':
            console.warn(type + ' logs were removed');
            break;

          case 'connect':
            decorate(response);
            break;
        }
      }
    };

    xhr.send();
  }

  function decorate (methodNames) {
    methodNames.forEach((methodName) => {
      makeRequest[methodName] = function (number) {
        makeRequest(number, methodName, 'get');
      }
      makeRequest[methodName].remove = function () {
        makeRequest(null, methodName, 'remove');
      }
    });
  }

  function log (logs) {
    logs.forEach((log) => {
      var method = isNativeMethod(log.method) ? log.method : 'log';
      console[method].apply(console, log.args)
    });
  }

  function isNativeMethod (method) {
    return !!~NATIVE_METHODS.indexOf(method);
  }
  
})();
