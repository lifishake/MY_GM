// ==UserScript==
// @name     dou-apip
// @version  2
// @match    https://movie.douban.com/*
// @match    https://music.douban.com/*
// @match    https://book.douban.com/*
// @match    https://www.douban.com/doulist/*
// @grant    none
// ==/UserScript==
function sprintf(format, ...args) {
    let i = 0;
    return format.replace(/%s/g, () => args[i++]);
}

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

function getCurrentSrcRecursively(obj) {
  if (typeof(obj.firstElementChild) !== 'undefined') {
    var fo = obj.firstElementChild;
    if (typeof(fo.currentSrc) !== 'undefined') {
      return fo.currentSrc;
    }
    else if (typeof(fo.firstElementChild) !== 'undefined') {
      return getCurrentSrcRecursively(fo);
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
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

function getFirstItems(text) {
  var arr_it = text.split("/");
  var str_ret = "";
  for (var i in arr_it) {
    var tmp_str = arr_it[i].trim();
    if ("" != str_ret) {
      str_ret += ",";
    }
    str_ret += tmp_str;
    if (i == 7){
      break;
    }
  }
  return str_ret;
}

function absInnerMovie(strInner, str_douscore){
  var arr_abs = strInner.split("\n");
  var str_abs = "";
  for (var a in arr_abs)
  {
    var tmp_a = arr_abs[a].trim();
    var tmp_arr_abs = tmp_a.split(":");

    if (tmp_arr_abs.length < 2) {
      continue;
    }
    var tmp_lbl = tmp_arr_abs[0].trim();
    var tmp_val = tmp_arr_abs[1].trim();
    if (tmp_lbl == "导演" || tmp_lbl == "主演" || tmp_lbl == "类型" || tmp_lbl == "上映日期" || tmp_lbl == "制片国家/地区") {
      tmp_val = getFirstItems(tmp_val);
      if (tmp_lbl == "主演") {
				tmp_lbl = "演员";
      }
      else if (tmp_lbl == "上映日期") {
        tmp_lbl = "年份";
        tmp_val = tmp_val.substr(0,4);
      }
      else if (tmp_lbl == "制片国家/地区") {
        tmp_lbl = "地区";
      }
      str_abs += sprintf("%s:%s;", tmp_lbl, tmp_val);
    }
  }
  str_abs += str_douscore;
  str_abs += "nipple:";
  return str_abs;
}

function absInnerBook(strInner, str_douscore){
  var arr_abs = strInner.split("\n");
  var str_abs = "";
  for (var a in arr_abs)
  {
    var tmp_a = arr_abs[a].trim();
    var tmp_arr_abs = tmp_a.split(":");

    if (tmp_arr_abs.length < 2) {
      continue;
    }
    var tmp_lbl = tmp_arr_abs[0].trim();
    var tmp_val = tmp_arr_abs[1].trim();
    if (tmp_lbl == "作者" || tmp_lbl == "出版社" || tmp_lbl == "出版年" || tmp_lbl == "译者" ) {
      tmp_val = getFirstItems(tmp_val);
      if (tmp_lbl == "作者") {
				tmp_val = tmp_val.replaceAll("[", "【");
        tmp_val = tmp_val.replaceAll("]", "】");
      }
      else if (tmp_lbl == "出版年") {
        tmp_lbl = "出版时间";
        tmp_val = tmp_val.substr(0,4);
      }
      str_abs += sprintf("%s:%s;", tmp_lbl, tmp_val);
    }
  }
  str_abs += str_douscore;
  return str_abs;
}

function absInnerMusic(strInner, str_douscore){
  var arr_abs = strInner.split("\n");
  var str_abs = "";
  for (var a in arr_abs)
  {
    var tmp_a = arr_abs[a].trim();
    var tmp_arr_abs = tmp_a.split(":");

    if (tmp_arr_abs.length < 2) {
      continue;
    }
    var tmp_lbl = tmp_arr_abs[0].trim();
    var tmp_val = tmp_arr_abs[1].trim();
    if (tmp_lbl == "表演者" || tmp_lbl == "出版者" || tmp_lbl == "流派" || tmp_lbl == "发行时间") {
      tmp_val = getFirstItems(tmp_val);
      if (tmp_lbl == "发行时间") {
        tmp_val = tmp_val.substr(0,4);
      }
      str_abs += sprintf("%s:%s;", tmp_lbl, tmp_val);
    }
  }
  str_abs += str_douscore;
  return str_abs;
}

(function(){
  var dm = document.domain.replace(".douban.com",'');

  //title
  var str_title = document.title.replace("(豆瓣)",'').trim();

  //link
  var str_link = document.URL;
  if (!str_link.includes("subject")&&!str_link.includes("series")&&!str_link.includes("doulist")) {
    return;
  }

  var str_disp = "";
  if (str_link.includes("doulist")) {
		var sitems = document.getElementsByClassName("title");
    Array.prototype.forEach.call(sitems, function(sitem, index) {
        var strstr = sitem.innerText;
        if (!strstr.includes("播放全片")) {
            str_disp += strstr;
            str_disp += "\n";
        }
    });
    //str_disp = str_disp.replaceAll("播放全片","");
  }
  else if (!str_link.includes("series")) {
    var arr_id = str_link.match(/(\d+)/);
    var str_id = arr_id[0];
    str_link = "https://"+ dm + ".douban.com/subject/" + str_id;

    str_link = str_link.replace(/\/+$/,'');

    //img
    var str_img = getCurrentSrcRecursively(document.getElementById("mainpic"));
    str_img = str_img.replace(/.webp/,'.jpg');

    //score
    var o_num = document.getElementsByClassName("rating_num");
    var str_douscore = "douscore:;";
    if (o_num.length) {
      str_douscore = "douscore:"+document.getElementsByClassName("rating_num")[0].innerText+";";
    }


    //abs

    var str_inner = document.getElementById("info").innerText;
    var str_abs = "";
    if ("movie"==dm) {
      str_abs = absInnerMovie(str_inner, str_douscore);
    }
    else if ("book"==dm) {
      str_abs = absInnerBook(str_inner, str_douscore);
    }
    else if ("music"==dm) {
      str_abs = absInnerMusic(str_inner, str_douscore);
    }

    str_disp = sprintf(
      '[myfv id="" type="%s" title="%s" img="%s" link="%s" score="99" abs="%s" series="0"/]',
      dm,
      str_title,
      str_img,
      str_link,
      str_abs
    );
  }
  else {
    var arr_id1 = str_link.match(/(\d+)/);
    var str_id1 = arr_id1[0];
    str_link = "https://book.douban.com/series/" + str_id1;
    var str_text = document.getElementsByClassName("pl2")[0].textContent;
    str_text = str_text.replaceAll("\n","");
    var str_abs1 = str_text.replaceAll(" ","");
    str_abs1 = str_abs1.replace("册数:",";册数:")+";";
    var sitems1 = document.getElementsByClassName("subject-item");
    var str_img1 = "";
    Array.prototype.forEach.call(sitems1, function(sitem, index) {
      if ("" != str_img1) {
        str_img1 += ",";
      }
      str_img1 += getCurrentSrcRecursively(sitem);

    });
    str_disp = sprintf(
      '[myfv id="" type="book" title="%s" img="%s" link="%s" score="99" abs="%s" series="1"/]',
      str_title,
      str_img1,
      str_link,
      str_abs1
    );
  }



  var box = document.createElement( "div" );
  box.id = "myAlertBox";
  box.textContent = "";
  box.innerHTML = str_disp;
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
    copyTextToClipboard(str_disp);
  }, true );


 })();