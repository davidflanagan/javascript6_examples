// Encode what, where, and radius in an XML document and post them to the 
// specified url, invoking callback when the response is received
function postQuery(url, what, where, radius, callback) {
    var request = new XMLHttpRequest();            
    request.open("POST", url);                  // POST to the specified url
    request.onreadystatechange = function() {   // Simple event handler
        if (request.readyState === 4 && callback) callback(request);
    };

    // Create an XML document with root element <query>
    var doc = document.implementation.createDocument("", "query", null);
    var query = doc.documentElement;            // The <query> element
    var find = doc.createElement("find");       // Create a <find> element
    query.appendChild(find);                    // And add it to the <query>
    find.setAttribute("zipcode", where);        // Set attributes on <find>
    find.setAttribute("radius", radius);
    find.appendChild(doc.createTextNode(what)); // And set content of <find>

    // Now send the XML-encoded data to the server.
    // Note that the Content-Type will be automatically set.
    request.send(doc); 
}
