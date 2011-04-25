/*
 * Define a properties() method in Object.prototype that returns an
 * object representing the named properties of the object on which it
 * is invoked (or representing all own properties of the object, if
 * invoked with no arguments).  The returned object defines four useful 
 * methods: toString(), descriptors(), hide(), and show().
 */
(function namespace() {  // Wrap everything in a private function scope

     // This is the function that becomes a method of all object
     function properties() {
         var names;  // An array of property names
         if (arguments.length == 0)  // All own properties of this
             names = Object.getOwnPropertyNames(this);
         else if (arguments.length == 1 && Array.isArray(arguments[0]))
             names = arguments[0];   // Or an array of names
         else                        // Or the names in the argument list
             names = Array.prototype.splice.call(arguments, 0);

         // Return a new Properties object representing the named properties
         return new Properties(this, names);
     }

     // Make it a new nonenumerable property of Object.prototype.
     // This is the only value exported from this private function scope.
     Object.defineProperty(Object.prototype, "properties", {
         value: properties,  
         enumerable: false, writable: true, configurable: true
     });

     // This constructor function is invoked by the properties() function above.
     // The Properties class represents a set of properties of an object.
     function Properties(o, names) {
         this.o = o;            // The object that the properties belong to
         this.names = names;    // The names of the properties
     }
     
     // Make the properties represented by this object nonenumerable
     Properties.prototype.hide = function() {
         var o = this.o, hidden = { enumerable: false };
         this.names.forEach(function(n) {
                                if (o.hasOwnProperty(n))
                                    Object.defineProperty(o, n, hidden);
                            });
         return this;
     };

     // Make these properties read-only and nonconfigurable
     Properties.prototype.freeze = function() {
         var o = this.o, frozen = { writable: false, configurable: false };
         this.names.forEach(function(n) {
                                if (o.hasOwnProperty(n))
                                    Object.defineProperty(o, n, frozen);
                            });
         return this;
     };

     // Return an object that maps names to descriptors for these properties.
     // Use this to copy properties along with their attributes:
     //   Object.defineProperties(dest, src.properties().descriptors());
     Properties.prototype.descriptors = function() {
         var o = this.o, desc = {};
         this.names.forEach(function(n) {
                                if (!o.hasOwnProperty(n)) return;
                                desc[n] = Object.getOwnPropertyDescriptor(o,n);
                            });
         return desc;
     };

     // Return a nicely formatted list of properties, listing the 
     // name, value and attributes. Uses the term "permanent" to mean
     // nonconfigurable, "readonly" to mean nonwritable, and "hidden"
     // to mean nonenumerable. Regular enumerable, writable, configurable 
     // properties have no attributes listed.
     Properties.prototype.toString = function() {
         var o = this.o; // Used in the nested function below
         var lines = this.names.map(nameToString);
         return "{\n  " + lines.join(",\n  ") + "\n}";
         
         function nameToString(n) {
             var s = "", desc = Object.getOwnPropertyDescriptor(o, n);
             if (!desc) return "nonexistent " + n + ": undefined";
             if (!desc.configurable) s += "permanent ";
             if ((desc.get && !desc.set) || !desc.writable) s += "readonly ";
             if (!desc.enumerable) s += "hidden ";
             if (desc.get || desc.set) s += "accessor " + n
             else s += n + ": " + ((typeof desc.value==="function")?"function"
                                                                   :desc.value);
             return s;
         }
     };

     // Finally, make the instance methods of the prototype object above 
     // nonenumerable, using the methods we've defined here.
     Properties.prototype.properties().hide();
}()); // Invoke the enclosing function as soon as we're done defining it.
