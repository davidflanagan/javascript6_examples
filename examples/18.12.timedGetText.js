// Issue an HTTP GET request for the contents of the specified URL.
// If the response arrives successfully, pass responseText to the callback.
// If the response does not arrive in less than timeout ms, abort the request.
// Browsers may fire "readystatechange" after abort(), and if a partial 
// request has been received, the status property may even be set, so 
// we need to set a flag so that we don't invoke the callback for a partial,
// timed-out response. This problem does not arise if we use the load event.
function timedGetText(url, timeout, callback) {
    var request = new XMLHttpRequest();         // Create new request.
    var timedout = false;                       // Whether we timed out or not.
    // Start a timer that will abort the request after timeout ms.
    var timer = setTimeout(function() {         // Start a timer. If triggered,
                               timedout = true; // set a flag and then
                               request.abort(); // abort the request.
                           },
                           timeout);            // How long before we do this
    request.open("GET", url);                   // Specify URL to fetch
    request.onreadystatechange = function() {   // Define event listener.
        if (request.readyState !== 4) return;   // Ignore incomplete requests.
        if (timedout) return;                   // Ignore aborted requests.
        clearTimeout(timer);                    // Cancel pending timeout.
        if (request.status === 200)             // If request was successful
            callback(request.responseText);     // pass response to callback.
    };
    request.send(null);                         // Send the request now
}
