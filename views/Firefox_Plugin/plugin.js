﻿chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
       function (tabs) {
           $('input[name=title]').val(tabs[0].title);
           $('input[name=url]').val(tabs[0].url);
       }
    );

var tags = [];
$.get("http://localhost:3001/bookmarks", function (response) {
    var tagsA = _.pluck(response, 'tags');
    for (var i = 0; i < tagsA.length; i++) {

        var a = tagsA[i];
        for (var j = 0; j < a.length; j++) {
            tags.push(a[j]);
        }
    }
    tags = _.uniq(tags);
    console.log(tags);
    $("input[name=tags]").autocomplete({
        lookup: tags,
        delimiter: ",",
        maxHeight: 80
    });
});
$(".form-actions").on("click", "a", function(e){
    e.preventDefault();
    e.stopPropagation();
    chrome.tabs.create({'url': $(this).attr("href")});
});
$("body").on("click", ".save", function (e) {
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
       function (tabs) {
           var tags = ($('input[name=tags]').val()).split(",");
           for(var i = 0; i < tags.length; i++){
               tags[i] = tags[i].replace(/^\s*|\s*$/g, "");
           }
           var obj = {
                title: $('input[name=title]').val(),
                description: $('textarea[name=description]').val(),
                url: $('input[name=url]').val(),
                tags: tags,
                lock: false,
                favicon: tabs[0].favIconUrl
            }

            $.post("http://localhost:3001/bookmarks", obj, function () {});
            setTimeout(function () { window.close(); }, 300);
       }
    );
});
$("body").on("click", ".cancel", function(){window.close();});