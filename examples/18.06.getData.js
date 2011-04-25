function getData(url, data, callback) {
    var request = new XMLHttpRequest(); 
    request.open("GET", url +                     // GET the specified url
                 "?" + encodeFormData(data));     // with encoded data added
    request.onreadystatechange = function() {     // Simple event handler
        if (request.readyState === 4 && callback) callback(request);
    };
    request.send(null);                           // Send the request
}
