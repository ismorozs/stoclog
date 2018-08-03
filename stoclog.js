(function () {

  var HEADER_NAME = 'x-operation-with-serverside-logs';

  var mainButtonHeight = 30;
  var mainButtonBorderWidth = 5;

  var backgroundColor = '#f7fff4';
  var borderColor = 'rgb(143, 224, 230)';

  var numberToFetch = 7

  /*******************************************************************************

    LOAD BUTTON

  ********************************************************************************/

  var button = Object.assign( document.createElement('div'), {
    title: 'Offload server logs',
    oncontextmenu: function (e) {
      if (e.target === this) {
        e.preventDefault();
        optionsMenu.style.display = (optionsMenu.style.display === 'none') ? 'block' : 'none';
      }
    },
    onclick: function (e) {
      if (e.target === this) {
        makeRequest();
      }
    },

  });

  Object.assign( button.style, {
    display: 'inline-block',
    position: 'fixed',
    boxSizing: 'border-box',
    top: '0',
    right: '0',
    border: mainButtonBorderWidth + 'px solid ' + borderColor,
    backgroundColor: backgroundColor,
    backgroundImage: " url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbgAAAG4CAMAAAAAFAKBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzkwMDMwMDQ5NzQxMTFFOEE4Qjg4OEY3RENBQ0I0MDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzkwMDMwMDU5NzQxMTFFOEE4Qjg4OEY3RENBQ0I0MDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOTAwMzAwMjk3NDExMUU4QThCODg4RjdEQ0FDQjQwMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOTAwMzAwMzk3NDExMUU4QThCODg4RjdEQ0FDQjQwMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq68xoQAAALQUExURfT09AEBAf39/QICAgYGBvv7+/f39/b29gUFBfj4+AgICPz8/Pr6+t7e3gsLCwQEBEpKSvn5+RMTEyQkJA0NDQ4ODgMDA729vcvLyzMzM+jo6C8vL+zs7OPj4ysrKygoKBAQEBQUFBsbGwkJCeHh4c3NzVtbW4iIiNvb27m5uS0tLTQ0NOnp6eLi4lBQUPDw8IGBgSMjIxUVFdXV1RYWFmFhYevr69zc3MLCwrq6urS0tLCwsNPT0+3t7ebm5u7u7qCgoBISEmhoaNnZ2d/f36urq25ubgoKCpycnFVVVfHx8RERETg4OEVFRSEhIdjY2AwMDDIyMtLS0ri4uEBAQKioqCkpKTU1NeTk5KampvLy8sfHx76+vqenp7a2tjc3NycnJ66urpaWljk5OcrKypKSklpaWo6OjmRkZHV1dWVlZZ+fn3JyclZWVpubm1dXV42NjS4uLkNDQ3Z2dl5eXj8/Pzw8PCAgIBcXFzY2NgcHBzo6OiIiIiYmJmlpaR8fHz09PZWVlRgYGD4+PtHR0fX19U9PT4SEhB4eHtTU1Hx8fERERJGRkfPz839/f4uLi2NjY3h4eFRUVBkZGX19fWtra3p6elNTU3Nzc7W1tX5+fiUlJZOTk4+Pj8jIyGdnZ93d3be3t8bGxrGxsampqeXl5Ts7O29vb4eHh6SkpL+/v7u7u5mZmeDg4IKCgrKysnt7e5iYmHR0dKKiourq6q+vr11dXR0dHV9fX8PDw2pqaq2trWJiYqGhoYODg5SUlFxcXHBwcJeXlw8PDyoqKsXFxXl5ecHBwbOzs8TExG1tbVFRUe/v7xoaGkJCQjExMYWFhaqqqkdHR9DQ0KOjoywsLEhISMDAwOfn587Ozp6enqysrElJSdfX17y8vIaGhoqKipCQkGxsbDAwMM/Pz0ZGRszMzExMTJqamsnJyXd3d1hYWE1NTYmJiQAAAP///2pWcgkAAADwdFJOU///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AJShaEcAAAnwSURBVHja7N0FfxVXHofx5N7GQwQLBEIoSZBCgMCS4lDcHYoUirsuViiFonV3d3d3l9123d3d8nsLu912t4VGrsyZOWfmed5B/t/Pzb0zc86cDFlVg73ZNShlAAcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABBxxwwAEHHHDAAQcccMABB5zXcDkZprMYLsOHcszA1b7fQEZbcLcJuDMrMxmt2drvNgG3uz2TNVvm8p5GPnEL+MSZrUu1me+4ik7M1mSdak39qvzp2UzXXLMrzF3H9dnDfE01rcLkBXj9V5mwmfZUmL1zUl/CjE00r1Zm4fR8X6bsfZdVyzScyrcxZ6/78RN+3GQu38Wkve2f4/x5OlC+nll72Tda+fVYp8+rTNu7JqfiluLzuOffYd5e9Y+U3FJ9kNp5AxP3pu6puaX8BHzUjczci3Y9IX/hNOVKpp5+g2rlN5wyvsvc0+31hUEsFsq7Ks7o02r9yGBWeRVcfhrDT6MxfQJbnne4iPGn3A0jAlxXOakrACk2YUqgC2JHfwWClNqc5uTTXsm8qBsIyZf5bHbgS9Dv34tDshX/vdCCvQO/uA2J5Kr6sMCKTR8vdMEimYoujVmyW2foDjQSr92tHrh5tM2q12w8Eq1rf5v2x5WxVDbBpr5p18bGwdMwSaTWv7FtR+qSB1FpudP/Zd9W4poLcWnRbbuNe8CH7+YxTwtuv5ONcJr5bbY+Nut2u+yEU6vpxfA0/btkZcxWOFWU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')",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '7px 4px',
    backgroundSize: '19px 22px',
    width: '42px',
    height: mainButtonHeight + (mainButtonBorderWidth * 2) + 'px',
    cursor: 'pointer',
    zIndex: '9999',
    textAlign: 'center',
    fontSize: '15px',
    fontFamily: 'sans-serif',
  });

  /*******************************************************************************

    OPTIONS MENU

  ********************************************************************************/

  var optionsMenu = document.createElement('ul');

  Object.assign( optionsMenu.style, {
    margin: '0',
    padding: '0',
    listStyle: 'none',
    position: 'absolute',
    boxSizing: 'border-box',
    top: mainButtonHeight + mainButtonBorderWidth + 'px',
    right: -mainButtonBorderWidth + 'px',
    width: '115px',
    display: 'none',
    backgroundColor: backgroundColor,
  });
  


  /*******************************************************************************

    OPTIONS ITEMS

  ********************************************************************************/

  var numberToFetchItem = generateOptionItem('Get last ', 'How many logs to fetch');

  var numberToFetchInput = Object.assign( document.createElement('input'), {
    type: 'number',
    value: numberToFetch,
    onchange: function (e) {
      numberToFetch = e.target.value
    }
  });
  numberToFetchInput.style.width = '40px';
  numberToFetchItem.appendChild(numberToFetchInput);

  var cleanLogItem = generateOptionItem('Clean log', 'Clean log', () => makeRequest('remove'));


  function generateOptionItem (text, title, onclick) {
    var item = Object.assign( document.createElement('li'), {
      title,
      onclick,
      innerHTML: text,
    });

    Object.assign ( item.style, {
      border: '2px solid ' + borderColor,
      padding: '5px',
    });

    return item;
  }

  /**************************************************************************************************/

  function makeRequest (option) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/', true);

    var headerData = option || 'get,' + numberToFetch;

    xhr.setRequestHeader(HEADER_NAME, headerData);

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

    xhr.send(option);
  }

  button.appendChild(optionsMenu);
  optionsMenu.appendChild(numberToFetchItem);
  optionsMenu.appendChild(cleanLogItem);
  document.body.append(button);
  
})()