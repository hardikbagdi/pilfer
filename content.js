var firstHref = $("a[href^='http']").eq(0).attr("href");

//console.log("firstHref");
//console.log(firstHref);
var savedclick;

$(document).mousedown(function(event) {
    switch (event.which) {
        case 1:
        //    alert('Left Mouse button pressed.');
            break;
        case 2:
    //        alert('Middle Mouse button pressed.');
            break;
        case 3:
       // console.log("hello worldddddddd");
       savedclick=event.target;
        console.log(event.target);

    //        alert('Risdvdsdvght Mouse button pressed.');
            break;
        default:
            alert('You have a strange Mouse!');
    }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log("Content script message received");
  	var imgtag= $(savedclick).find("img");

  	console.log(imgtag);
  //	console.log(imgtag.src);
  	//console.log(imgtag.currentSrc);
  	var len = imgtag.length; // check if they exist
    if( len > 0 ){

        var attrID = imgtag.first().attr("src"); // get id of first image

    	console.log("foudn image");

    	console.log(attrID);
        // images found, get id
    	console.log(imgtag.first().attr("height"));
    } else {
    	console.log("no image found");
    	attrID="none";
        // images not found
    }
   // console.log(sender.tab ? "from a content script:" + sender.tab.url :
     //           "from the extension");
   
    if (request.greeting == "hello")
    {

      sendResponse({"farewell": "goodbye", "lastclick":attrID});
		    	
    }
  });
