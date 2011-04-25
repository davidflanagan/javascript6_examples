/**
 * linkdetails.js
 *
 * This unobtrusive JavaScript module finds all <a> elements that have an href
 * attribute but no title attribute and adds an onmouseover event handler to 
 * them. The event handler makes an XMLHttpRequest HEAD request to fetch 
 * details about the linked resource, and then sets those details in the title
 * attribute of the link so that they will be displayed as a tooltip.
 */
whenReady(function() { 
    // Is there any chance that cross-origin requests will succeed?
    var supportsCORS = (new XMLHttpRequest()).withCredentials !== undefined;

    // Loop through all links in the document
    var links = document.getElementsByTagName('a');
    for(var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link.href) continue; // Skip anchors that are not hyperlinks
        if (link.title) continue; // Skip links that already have tooltips

        // If this is a cross-origin link
        if (link.host !== location.host || link.protocol !== location.protocol)
        {
            link.title = "Off-site link";  // Assume we can't get any more info 
            if (!supportsCORS) continue;   // Quit now if no CORS support
            // Otherwise, we might be able to learn more about the link
            // So go ahead and register the event handlers so we can try.
        }

        // Register event handler to download link details on mouse over
        if (link.addEventListener)
            link.addEventListener("mouseover", mouseoverHandler, false);
        else
            link.attachEvent("onmouseover", mouseoverHandler);
    }

    function mouseoverHandler(e) {
        var link = e.target || e.srcElement;      // The <a> element
        var url = link.href;                      // The link URL

        var req = new XMLHttpRequest();           // New request
        req.open("HEAD", url);                    // Ask for just the headers
        req.onreadystatechange = function() {     // Event handler
            if (req.readyState !== 4) return;     // Ignore incomplete requests
            if (req.status === 200) {             // If successful
                var type = req.getResponseHeader("Content-Type");   // Get
                var size = req.getResponseHeader("Content-Length"); // link
                var date = req.getResponseHeader("Last-Modified");  // details
                // Display the details in a tooltip. 
                link.title = "Type: " + type + "   \n" +  
                    "Size: " + size + "   \n" + "Date: " + date;
            }
            else {
                // If request failed, and the link doesn't already have an
                // "Off-site link" tooltip, then display the error.
                if (!link.title)
                    link.title = "Couldn't fetch details: \n" +
                        req.status + " " + req.statusText;
            }
        };
        req.send(null);
        
        // Remove handler: we only want to fetch these headers once.
        if (link.removeEventListener)
            link.removeEventListener("mouseover", mouseoverHandler, false);
        else
            link.detachEvent("onmouseover", mouseoverHandler);
    }
});
