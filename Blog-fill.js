// ==UserScript==
// @name     Wordpress类blog自动填表
// @version  1
// @grant    none
// ==/UserScript==
 (function(){
   //wordpress+typecho
   if(document.getElementById('author'))
    document.getElementById('author').value='大致';
   if(document.getElementById('email'))//wordpress
    document.getElementById('email').value='lifishake@yandex.com';
   if(document.getElementById('mail'))//typecho
    document.getElementById('mail').value='lifishake@yandex.com';
   if(document.getElementById('url'))
    document.getElementById('url').value='https://pewae.com';
   //emlog
   if(document.getElementById('slname'))
     document.getElementById('slname').value='大致';
   if(document.getElementById('slmail'))
    document.getElementById('slmail').value='lifishake@yandex.com';
   if(document.getElementById('slurl'))
    document.getElementById('slurl').value='https://pewae.com';
   //Disqus
   if(document.getElementById('name'))
     document.getElementById('name').value='大致';
   //？？？胡说胡记
   if(document.getElementById('inpName'))
     document.getElementById('inpName').value='大致';
   if(document.getElementById('inpEmail'))
    document.getElementById('inpEmail').value='lifishake@yandex.com';
   if(document.getElementById('inpHomePage'))
    document.getElementById('inpHomePage').value='https://pewae.com';
   //？？？依云
   if(document.getElementById('comment_writer'))
     document.getElementById('comment_writer').value='大致';
   if(document.getElementById('comment_email'))
    document.getElementById('comment_email').value='lifishake@yandex.com';
   if(document.getElementById('comment_homepage'))
    document.getElementById('comment_homepage').value='https://pewae.com';
  })();
 