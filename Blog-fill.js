// ==UserScript==
// @name     Wordpress类blog自动填表
// @version  2
// @downloadURL https://github.com/lifishake/MY_GM/blob/main/
// @updateURL https://github.com/lifishake/MY_GM/blob/main/
// @grant    none
// ==/UserScript==
 (function(){
   var myname = '大致';
   var myemail = 'lifishake@outlook.com';
   var myurl = 'https://pewae.com';
   var name_ids = ["author","slname","name","inpName","comment_writer","s_uid","tc_name_0"];
   var email_ids = ["email","slmail","inpEmail","comment_email","s_uemail","tc_url_0"];
   var url_ids = ["url","slurl","inpHomePage","comment_homepage","s_ublog","tc_url_0"];
   var name_names = ["comname","nick","author","wc_name"];
   var email_names = ["commail","mail","email","wc_email"];
   var url_names = ["comurl","link","website","wc_website"];
   
   //wordpress等根据ID  
   for(i=0;i<name_ids.length;i++) {
     if(document.getElementById(name_ids[i]))
    		document.getElementById(name_ids[i]).value=myname;
   }
   for(i=0;i<email_ids.length;i++) {
     if(document.getElementById(email_ids[i]))
    		document.getElementById(email_ids[i]).value=myemail;
   }
   for(i=0;i<url_ids.length;i++) {
     if(document.getElementById(url_ids[i]))
    		document.getElementById(url_ids[i]).value=myurl;
   }
   
   //emlog等根据name
   for(i=0;i<name_names.length;i++) {
     var ctrls = document.getElementsByName(name_names[i]);
     for(j=0;j<ctrls.length;++j) {
       if (ctrls[j].type == "text") {
         ctrls[j].value = myname;
         break;
       }
     }
   }
   for(i=0;i<name_names.length;i++) {
     var ctrls = document.getElementsByName(email_names[i]);
     for(j=0;j<ctrls.length;++j) {
       if (ctrls[j].type == "text" || ctrls[j].type =="email") {
         ctrls[j].value = myemail;
         break;
       }
     }
   }
   for(i=0;i<name_names.length;i++) {
     var ctrls = document.getElementsByName(url_names[i]);
     for(j=0;j<ctrls.length;++j) {
       if (ctrls[j].type == "text") {
         ctrls[j].value = myurl;
         break;
       }
     }
   }
    
  })();
 