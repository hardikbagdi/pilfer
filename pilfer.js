chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
                                    if (buttonIndex == 0) {
                                        chrome.notifications.clear(notificationId);
                                    }
                                    if (buttonIndex == 1)
                                    {
                                        chrome.notifications.clear(notificationId);
                                        chrome.tabs.create({
                                            url: "http://photos.google.com"
                                        });
                                    }

                                });
                                chrome.notifications.onClicked.addListener(function(notificationId) {
                                    chrome.notifications.clear(notificationId);
                                    chrome.tabs.create({
                                        url: "http://photos.google.com"
                                    });
                                });
chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({
        url: "http://getPilfer.com"
    });
    var title = "Pilfer it";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": ["all"],
        "id": "image"
    });
    chrome.identity.getAuthToken({
        'interactive': true
    }, function(token) {});

    console.log("initialization successful");
});

chrome.runtime.onStartup.addListener(function() {
    var title = "Pilfer it";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": ["all"],
        "id": "image"
    });
    chrome.identity.getAuthToken({
            'interactive': true
        },
        function(token) {
            // console.log(token);
        }
    );
    console.log("initialization successful");
});

function onClickHandler(info, tab) {
    var targetImage;
    var imageflag = false;
    var startnotificationId;
    var idflag = false;
    var accesstoken;
    var auth;
    var image;
    var myArr;
    if (info.srcUrl === null) {
        chrome.tabs.query({
                active: true,
                currentWindow: true
            },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    greeting: "hello"
                }, function(response) {

                    if (response.lastclick == "none") {
                        var opt1 = {
                            type: "basic",
                            title: "Pilfer",
                            message: "No image found. :(",
                            iconUrl: "pilfer128.png"
                        }
                        chrome.notifications.create(opt1, function(notificatID) {
                            setTimeout(function() {
                                chrome.notifications.clear(notificatID);
                            }, 3000);
                        });
                        return;
                    }
                    //info.srcUrl=response.lastclick;
                    image = response.lastclick;
                });
            });

    }
console.log("getToken ends")
    var my_image = new Image();
    my_image.setAttribute('crossOrigin', 'anonymous');
    if (info.srcUrl != null) {
        image = info.srcUrl;
    }
    my_image.src = info.srcUrl;
    my_image.onload = notify_complete;
    function notify_complete() {
        imageflag = true;
    };
    getToken();
  
    function getToken() {
console.log("getToken starts")
        chrome.identity.getAuthToken({
            'interactive': true
        }, function(token) {
            accesstoken = token;
            auth = "Bearer " + String(accesstoken);
            
            var xmlhttp = new XMLHttpRequest();
            var url = "";
            xmlhttp.onload = function() {

                myArr = JSON.parse(xmlhttp.responseText);
                idflag = true;


                if (typeof image == 'undefined') {
                    var opt1 = {
                        type: "basic",
                        title: "Pilfer",
                        message: "No image found :(",
                        iconUrl: "pilfer128.png"
                    }

                    chrome.notifications.create(opt1, function(notificatID) {
                        startnotificationId = notificatID;
                        setTimeout(function() {
                            chrome.notifications.clear(notificatID);
                        }, 3000);
                    });
                    return;
                }
                if (typeof image != 'undefined') {
                    var opt1 = {
                        type: "basic",
                        title: "Pilfer",
                        message: "Your image is being processed. :)",
                        iconUrl: "pilfer128.png"
                    }

                    chrome.notifications.create(opt1, function(notificatID) {
                        startnotificationId = notificatID;
                        setTimeout(function() {
                            chrome.notifications.clear(notificatID);
                        }, 3000);
                    });
                }
                var name = image.split('/').pop();
                var nameParts = name.split(".");
                var contentType = '';
                switch (nameParts[1]) {
                    case 'png':
                        contentType = 'image/png';
                        break;
                    case 'gif':
                        contentType = 'image/gif';
                        break;
                    case 'bmp':
                        contentType = 'image/bmp';
                        break;
                    default:
                        contentType = 'image/jpeg';
                        break;
                }
                targetImage = {
                    path: image,
                    name: name,
                    contentType: contentType
                }


                var xhr = new XMLHttpRequest();
                xhr.open('GET', targetImage.path, true);
                xhr.responseType = 'arraybuffer';

                xhr.onload = function(e) {
                    if (this.status == 200) {

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', "https://picasaweb.google.com/data/feed/api/user/" + myArr.id + '/albumid/default', true);
                        xhr.setRequestHeader("Content-Type", targetImage.contentType);
                        xhr.setRequestHeader("Authorization", auth);
                        xhr.onload = function(e) {
                            chrome.notifications.clear(startnotificationId, finalnotification);
                            function finalnotification() {
                                var opt = {
                                    type: "image",
                                    eventTime: Date.now(),
                                    title: "Pilfer",
                                    message: "Your Image has been saved to Google Photos. :)",
                                    iconUrl: "pilfer128.png",
                                    imageUrl: image,
                                    buttons: [{
                                        title: "Dismiss"
                                    }, {
                                        title: "Open in Google Photos"
                                    }],

                                }

                                
                                chrome.notifications.create(opt, function(nId) {
                                    setTimeout(function() {
                                        chrome.notifications.clear(nId);
                                    }, 3000);
                                });
                            }
                        };
                        xhr.send(this.response);
                    } else {}
                };
                xhr.send();
            }
            xmlhttp.open("GET", "https://www.googleapis.com/plus/v1/people/me", true);
            xmlhttp.setRequestHeader('Authorization', auth);
            xmlhttp.send();
        });
    }
};