/*
 * CookieStorage.js
 * This class implements the Storage API that localStorage and sessionStorage
 * do, but implements it on top of HTTP Cookies.
 */
function CookieStorage(maxage, path) {  // Arguments specify lifetime and scope

    // Get an object that holds all cookies
    var cookies = (function() { // The getCookies() function shown earlier
        var cookies = {};           // The object we will return
        var all = document.cookie;  // Get all cookies in one big string
        if (all === "")             // If the property is the empty string
            return cookies;         // return an empty object
        var list = all.split("; "); // Split into individual name=value pairs
        for(var i = 0; i < list.length; i++) {  // For each cookie
            var cookie = list[i];
            var p = cookie.indexOf("=");        // Find the first = sign
            var name = cookie.substring(0,p);   // Get cookie name
            var value = cookie.substring(p+1);  // Get cookie value
            value = decodeURIComponent(value);  // Decode the value
            cookies[name] = value;              // Store name and value
        }
        return cookies;
    }());

    // Collect the cookie names in an array
    var keys = [];
    for(var key in cookies) keys.push(key);

    // Now define the public properties and methods of the Storage API

    // The number of stored cookies
    this.length = keys.length;

    // Return the name of the nth cookie, or null if n is out of range
    this.key = function(n) {
        if (n < 0 || n >= keys.length) return null;
        return keys[n];
    };

    // Return the value of the named cookie, or null.
    this.getItem = function(name) { return cookies[name] || null; };

    // Store a value
    this.setItem = function(key, value) {
        if (!(key in cookies)) { // If no existing cookie with this name
            keys.push(key);      // Add key to the array of keys
            this.length++;       // And increment the length
        }

        // Store this name/value pair in the set of cookies.
        cookies[key] = value;

        // Now actually set the cookie.
        // First encode value and create a name=encoded-value string
        var cookie = key + "=" + encodeURIComponent(value);

        // Add cookie attributes to that string
        if (maxage) cookie += "; max-age=" + maxage;
        if (path) cookie += "; path=" + path;

        // Set the cookie through the magic document.cookie property
        document.cookie = cookie;
    };

    // Remove the specified cookie
    this.removeItem = function(key) {
        if (!(key in cookies)) return;  // If it doesn't exist, do nothing

        // Delete the cookie from our internal set of cookies
        delete cookies[key];

        // And remove the key from the array of names, too.
        // This would be easier with the ES5 array indexOf() method.
        for(var i = 0; i < keys.length; i++) {  // Loop through all keys
            if (keys[i] === key) {              // When we find the one we want
                keys.splice(i,1);               // Remove it from the array.
                break;
            }
        }
        this.length--;                          // Decrement cookie length

        // Finally actually delete the cookie by giving it an empty value
        // and an immediate expiration date.
        document.cookie = key + "=; max-age=0";
    };

    // Remove all cookies
    this.clear = function() {
        // Loop through the keys, removing the cookies
        for(var i = 0; i < keys.length; i++)
            document.cookie = keys[i] + "=; max-age=0";
        // Reset our internal state
        cookies = {};
        keys = [];
        this.length = 0;
    };
}
