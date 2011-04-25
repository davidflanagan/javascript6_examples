function UserDataStorage(maxage)  {
    // Create a document element and install the special userData 
    // behavior on it so it gets save() and load() methods.
    var memory = document.createElement("div");         // Create an element
    memory.style.display = "none";                      // Never display it
    memory.style.behavior = "url('#default#userData')"; // Attach magic behavior
    document.body.appendChild(memory);                  // Add to the document

    // If maxage is specified, expire the userData in maxage seconds
    if (maxage) {
        var now = new Date().getTime();     // The current time
        var expires = now + maxage * 1000;  // maxage seconds from now
        memory.expires = new Date(expires).toUTCString();
    }

    // Initialize memory by loading saved values.
    // The argument is arbitrary, but must also be passed to save()
    memory.load("UserDataStorage");                     // Load any stored data

    this.getItem = function(key) {     // Retrieve saved values from attributes
        return memory.getAttribute(key) || null;
    };
    this.setItem = function(key, value) {
        memory.setAttribute(key,value); // Store values as attributes
        memory.save("UserDataStorage"); // Save state after any change
    };
    this.removeItem = function(key) {
        memory.removeAttribute(key);    // Remove stored value attribute
        memory.save("UserDataStorage"); // Save new state
    };
}
