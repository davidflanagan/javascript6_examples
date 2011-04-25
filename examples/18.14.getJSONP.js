// Make a JSONP request to the specified URL and pass the parsed response
// data to the specified callback. Add a query parameter named "jsonp" to
// the URL to specify the name of the callback function for the request.
function getJSONP(url, callback) {
    // Create a unique callback name just for this request
    var cbnum = "cb" + getJSONP.counter++; // Increment counter each time
    var cbname = "getJSONP." + cbnum;      // As a property of this function
    
    // Add the callback name to the url query string using form-encoding
    // We use the parameter name "jsonp".  Some JSONP-enabled services 
    // may require a different parameter name, such as "callback".
    if (url.indexOf("?") === -1)   // URL doesn't already have a query section
        url += "?jsonp=" + cbname; // add parameter as the query section
    else                           // Otherwise, 
        url += "&jsonp=" + cbname; // add it as a new parameter.

    // Create the script element that will send this request
    var script = document.createElement("script");

    // Define the callback function that will be invoked by the script
    getJSONP[cbnum] = function(response) {
        try {
            callback(response); // Handle the response data
        }
        finally {               // Even if callback or response threw an error
            delete getJSONP[cbnum];                // Delete this function
            script.parentNode.removeChild(script); // Remove script
        }
    };

    // Now trigger the HTTP request
    script.src = url;                  // Set script url
    document.body.appendChild(script); // Add it to the document
}

getJSONP.counter = 0;  // A counter we use to create unique callback names
