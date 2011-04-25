// The constructor function 
function SingletonSet(member) {
    this.member = member;   // Remember the single member of the set
}

// Create a prototype object that inherits from the prototype of Set.
SingletonSet.prototype = inherit(Set.prototype);

// Now add properties to the prototype.
// These properties override the properties of the same name from Set.prototype.
extend(SingletonSet.prototype, {
           // Set the constructor property appropriately
           constructor: SingletonSet,
           // This set is read-only: add() and remove() throw errors
           add: function() { throw "read-only set"; },    
           remove: function() { throw "read-only set"; }, 
           // A SingletonSet always has size 1
           size: function() { return 1; },                
           // Just invoke the function once, passing the single member.
           foreach: function(f, context) { f.call(context, this.member); },
           // The contains() method is simple: true only for one value
           contains: function(x) { return x === this.member; }
       });
