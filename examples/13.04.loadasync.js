// Asynchronously load and execute a script from a specified URL
function loadasync(url) { 
    var head = document.getElementsByTagName("head")[0]; // Find document <head>
    var s = document.createElement("script");  // Create a <script> element
    s.src = url;                               // Set its src attribute 
    head.appendChild(s);                       // Insert the <script> into head
}
