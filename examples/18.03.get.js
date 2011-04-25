// Issue an HTTP GET request for the contents of the specified URL.
// When the response arrives, pass it to the callback function as a 
// parsed XML Document object, a JSON-parsed object, or a string.
function get(url, callback) {
    var request = new XMLHttpRequest();         // Create new request
    request.open("GET", url);                   // Specify URL to fetch
    request.onreadystatechange = function() {   // Define event listener
        // If the request is compete and was successful
        if (request.readyState === 4 && request.status === 200) {
            // Get the type of the response
            var type = request.getResponseHeader("Content-Type");
            // Check type so we don't get HTML documents in the future
            if (type.indexOf("xml") !== -1 && request.responseXML) 
                callback(request.responseXML);              // Document response
            else if (type === "application/json")
                callback(JSON.parse(request.responseText)); // JSON response
            else 
                callback(request.responseText);             // String response
        }
    };
    request.send(null);                         // Send the request now
}
