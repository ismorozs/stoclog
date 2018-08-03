'use strict';

(function () {

  var GLOBAL_NAME = 'Stoclog';
  var SPECIAL_HEADER_NAME = 'x-operation-with-serverside-logs';
  var DEFAULT_NUMBER_TO_FETCH = 1;

  window[GLOBAL_NAME] = makeRequest;

  makeRequest.setDefaultFetchNumber = function (number) {
    DEFAULT_NUMBER_TO_FETCH = number;
  }

  makeRequest.renameTo = function (newGlogalName) {
    window[newGlogalName] = makeRequest;
    delete window[GLOBAL_NAME];
    GLOBAL_NAME = newGlogalName;
  }

  function makeRequest (requestDetails) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/', true);

    var key = 'get';
    var value = DEFAULT_NUMBER_TO_FETCH;

    if (requestDetails) {
      key = Object.keys(requestDetails);
      value = requestDetails[key];
    }

    xhr.setRequestHeader(SPECIAL_HEADER_NAME, key + ',' + value);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        switch (xhr.status) {

          case 200:
            var logs = JSON.parse(xhr.response);
            logs.forEach((log) => console.log(log));
            break;

          case 204:
            console.log('server logs removed');
            break;

          default:
            console.error(
              'Error occured while fetching server logs.\nCode: %s\n%s',
              xhr.status,
              xhr.responseText
            );
            break;
        }
      }
    };

    xhr.send();
    /* function has to return something to the console */
    return '*********************** LOGS FROM SERVER ***********************';
  }
  
})();
