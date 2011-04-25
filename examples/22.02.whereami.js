// Determine my location asynchronously and display it in the specified element.
function whereami(elt) {
    // Pass this object as the 3rd argument to getCurrentPosition()
    var options = {
        // Set to true to get a higher accuracy reading (from GPS, for example)
        // if available. Note, however that this can affect battery life.
        enableHighAccuracy: false, // Approximate is okay: this is the default

        // Set this property if a cached location is good enough.
        // The default is 0, which forces location to be checked anew.
        maximumAge: 300000,        // A fix from the last 5 minutes is okay

        // How long are you willing to wait to get the location?
        // The default is Infinity and getCurrentPosition() never times out
        timeout: 15000             // Don't take more than 15 seconds
    };

    if (navigator.geolocation) // Request position, if supported
        navigator.geolocation.getCurrentPosition(success, error, options); 
    else 
        elt.innerHTMl = "Geolocation not supported in this browser";

    // This function will be invoked if geolocation fails
    function error(e) {
        // The error object has a numeric code and a text message. Code values:
        // 1: the user did not give permission to share his or her location
        // 2: the browser was unable to determine the position
        // 3: a timeout occurred
        elt.innerHTML = "Geolocation error " + e.code + ": " + e.message;
    }

    // This function will be invoked if geolocation succeeds
    function success(pos) {
        // These are the fields that we always get. Note that the timestamp
        // is in the outer object, not the inner, coords object.
        var msg = "At " +
            new Date(pos.timestamp).toLocaleString() + " you were within " + 
            pos.coords.accuracy + " meters of latitude " +
            pos.coords.latitude + " longitude " + 
            pos.coords.longitude + ".";

        // If our device returns altitude, add that information.
        if (pos.coords.altitude) {
            msg += " You are " + pos.coords.altitude + " ± " +
                pos.coords.altitudeAccuracy + "meters above sea level.";
        }
        
        // if our device returns speed and heading, add that, too.
        if (pos.coords.speed) {
            msg += " You are travelling at " + 
                pos.coords.speed + "m/s on heading " +
                pos.coords.heading + ".";
        }

        elt.innerHTML = msg;  // Display all the position information
    }
}
