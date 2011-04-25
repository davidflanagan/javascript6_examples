// Wrap our code in a function so we can define variables in the function scope
(function() { 
     // Define objectId as a nonenumerable property inherited by all objects.
     // When this property is read, the getter function is invoked.
     // It has no setter, so it is read-only.
     // It is nonconfigurable, so it can't be deleted.
     Object.defineProperty(Object.prototype, "objectId", {
                               get: idGetter,       // Method to get value
                               enumerable: false,   // Nonenumerable
                               configurable: false  // Can't delete it
                           });

     // This is the getter function called when objectId is read
     function idGetter() {             // A getter function to return the id
         if (!(idprop in this)) {      // If object doesn't already have an id
             if (!Object.isExtensible(this)) // And if we can add a property
                 throw Error("Can't define id for nonextensible objects");
             Object.defineProperty(this, idprop, {         // Give it one now.
                                       value: nextid++,    // This is the value
                                       writable: false,    // Read-only
                                       enumerable: false,  // Nonenumerable
                                       configurable: false // Nondeletable
                                   });
         }
         return this[idprop];          // Now return the existing or new value
     };

     // These variables are used by idGetter() and are private to this function
     var idprop = "|**objectId**|";    // Assume this property isn't in use
     var nextid = 1;                   // Start assigning ids at this #

}()); // Invoke the wrapper function to run the code right away
