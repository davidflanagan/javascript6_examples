// GET the contents of the url as a Blob and pass it to the specified callback.
// This code is untested: no browsers supported this API when it was written.
function getBlob(url, callback) {
    var xhr = new XMLHttpRequest();  // Create new XHR object
    xhr.open("GET", url);            // Specify URL to fetch
    xhr.responseType = "blob"        // We'd like a Blob, please
    xhr.onload = function() {        // onload is easier than onreadystatechange
        callback(xhr.response);      // Pass the blob to our callback
    }                                // Note .response, not .responseText
    xhr.send(null);                  // Send the request now
}
