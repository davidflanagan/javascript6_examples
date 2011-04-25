// This file of JS code inserts the Twitter Search Gadget into the document
// and adds an event handler to all links in the document so that when the
// use moves the mouse over them, the gadget searches for the link's URL.
// This allows the user to see what people are tweeting about the link
// destination before clicking on it.
window.addEventListener("load", function() {       // Won't work in IE < 9
    var origin = "http://davidflanagan.com";       // Gadget origin
    var gadget = "/demos/TwitterSearch.html";      // Gadget path
    var iframe = document.createElement("iframe"); // Create the iframe
    iframe.src = origin + gadget;                  // Set its URL
    iframe.width = "250";                          // 250 pixels wide
    iframe.height = "100%";                        // Full document height
    iframe.style.cssFloat = "right";               // Flush right

    // Insert the iframe at the start of the document
    document.body.insertBefore(iframe, document.body.firstChild);
    
    // Now find all links and hook them up to the gadget
    var links = document.getElementsByTagName("a");
    for(var i = 0; i < links.length; i++) {
        // addEventListener doesn't work in IE8 and before
        links[i].addEventListener("mouseover", function() {
            // Send the url as the search term, and only deliver it if the
            // iframe is still displaying a document from davidflanagan.com
            iframe.contentWindow.postMessage(this.href, origin);
        }, false);
    }
}, false);
