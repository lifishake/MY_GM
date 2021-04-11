// ==UserScript==
// @name         douban250
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://movie.douban.com/top250
// @match        https://movie.douban.com/top250?*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// ==/UserScript==

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.id = "clippp";

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

(function() {
    'use strict';
    //debugger;
    var dm = document.domain.replace(".douban.com",'');
    var gll = document.getElementsByClassName("grid_view");
    var the25 = gll[0].children
    var outstr = "";
    for (var i=0; i< gll[0].childElementCount; ++i) {
        var str = the25[i].innerText;
        var stra = str.split("/")[0].trim();
        stra = stra.replace(/(\r\n|\n|\r)/gm,"\t");
        outstr += stra+ "\r\n";
    }

    var box = document.createElement( "div" );
    box.id = "myAlertBox";
    box.textContent = "";
    box.innerHTML = outstr;
    box.style.background = 'white';
    box.style.border = '1px solid #636569';
    box.style.padding = '4px';
    box.style.position = 'fixed';
    box.style.top = '30px';
    box.style.left = '8px';
    box.style.maxWidth = '400px';
    box.style.zIndex = '5';
    document.body.insertBefore(box, document.body.firstChild);

    var closeButton = document.createElement( "div" );
    closeButton.className = 'myCloseButton';
    closeButton.textContent = 'X';
    closeButton.background = '#aaa';
    closeButton.style.border = '1px solid #777';
    closeButton.style.padding = '1px';
    closeButton.style.marginLeft = '8px';
    closeButton.style.float = 'right';
    closeButton.style.cursor = 'pointer';

    box.insertBefore( closeButton, box.firstChild );

    closeButton.addEventListener( 'click', function () {
        box.parentNode.removeChild( box );
        copyTextToClipboard(outstr);
    }, true );
})();