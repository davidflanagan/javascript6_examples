// Issue an HTTP GET request for the contents of the specified URL.
// When the response arrives successfully, verify that it is plain text
// and if so, pass it to the specified callback function
function getText(url, callback) {
    var request = new XMLHttpRequest();         // Create new request
    request.open("GET", url);                   // Specify URL to fetch
    request.onreadystatechange = function() {   // Define event listener
        // If the request is compete and was successful
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader("Content-Type");
            if (type.match(/^text/))            // Make sure response is text
                callback(request.responseText); // Pass it to callback
        }
    };
    request.send(null);                         // Send the request now
}
