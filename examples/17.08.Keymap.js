/*
 * Keymap.js: bind key events to handler functions.
 *
 * This module defines a Keymap class. An instance of this class represents a
 * mapping of key identifiers (defined below) to handler functions. A Keymap
 * can be installed on an HTML element to handle keydown events. When such an
 * event occurs, the Keymap uses its mapping to invoke the appropriate handler.
 *
 * When you create a Keymap, you can pass a JavaScript object that represents 
 * the initial set of bindings for the Keymap. The property names of this object
 * are key identifers, and the property values are the handler functions.
 * After a Keymap has been created, you can add new bindings by passing a key
 * identifer and handler function to the bind() method. You can remove a
 * binding by passing a key identifier to the unbind() method.
 *
 * To make use of a Keymap, call its install() method, passing an HTML element,
 * such as the document object. install() adds an onkeydown event handler to
 * the specified object. When this handler is invoked, it determines the key
 * identifier of the pressed key and invokes the handler function, if any,
 * bound to that key identifier. A single Keymap may be installed on more than
 * one HTML element.
 *
 * Key Identifiers
 *
 * A key identifier is a case-insensitive string representation of a key plus
 * any modifier keys that are held down at the same time. The key name is
 * usually the (unshifted) text on the key. Legal key names include "A", "7",
 * "F2", "PageUp", "Left", "Backspace", and "Esc".
 *
 * See the Keymap.keyCodeToKeyName object in this module for a list of names.
 * These are a subset of the names defined by the DOM Level 3 standard and 
 * this class will use the key property of the event object when implemented.
 *
 * A key identifier may also include modifier key prefixes. These prefixes are
 * Alt, Ctrl, Meta, and Shift. They are case-insensitive, and must be separated
 * from the key name and from each other with spaces or with an underscore,
 * hyphen, or +. For example: "SHIFT+A", "Alt_F2", "meta-v", and "ctrl alt left".
 * On Macs, Meta is the Command key and Alt is the Option key. Some browsers
 * map the Windows key to the Meta modifier.
 *
 * Handler Functions
 *
 * Handlers are invoked as methods of the document or document element on which
 * the keymap is installed and are passed two arguments:
 *   1) the event object for the keydown event
 *   2) the key identifier of the key that was pressed
 * The handler return value becomes the return value of the keydown handler.
 * If a handler function returns false, the keymap will stop bubbling and
 * cancel any default action associated with the keydown event.
 *
 * Limitations
 *
 * It is not possible to bind a handler function to all keys. The operating
 * system traps some key sequences (Alt-F4, for example). And the browser
 * itself may trap others (Ctrl-S, for example). This code is browser, OS,
 * and locale-dependent. Function keys and modified function keys work well,
 * and unmodified alphanumeric keys work well. The combination of Ctrl and Alt
 * with alphanumeric characters is less robust.
 *
 * Most punctuation characters that do not require the Shift key (`=[];',./\ 
 * but not hyphen) on standard US keyboard layouts are supported. But they are
 * not particularly portable to other keyboard layouts and should be avoided.
 */

// This is the constructor function
function Keymap(bindings) {
    this.map = {};    // Define the key identifier->handler map
    if (bindings) {   // Copy initial bindings into it
        for(name in bindings) this.bind(name, bindings[name]);
    }
}

// Bind the specified key identifier to the specified handler function
Keymap.prototype.bind = function(key, func) {
    this.map[Keymap.normalize(key)] = func;
};

// Delete the binding for the specified key identifier
Keymap.prototype.unbind = function(key) {
    delete this.map[Keymap.normalize(key)];
};

// Install this Keymap on the specified HTML element
Keymap.prototype.install = function(element) {
    // This is the event-handler function
    var keymap = this;
    function handler(event) { return keymap.dispatch(event, element); }

    // Now install it
    if (element.addEventListener)
        element.addEventListener("keydown", handler, false);
    else if (element.attachEvent) 
        element.attachEvent("onkeydown", handler);
};

// This method dispatches key events based on the keymap bindings.
Keymap.prototype.dispatch = function(event, element) {
    // We start off with no modifiers and no key name
    var modifiers = ""
    var keyname = null;

    // Build the modifier string in canonical lowercase alphabetical order.
    if (event.altKey) modifiers += "alt_";      
    if (event.ctrlKey) modifiers += "ctrl_";
    if (event.metaKey) modifiers += "meta_";
    if (event.shiftKey) modifiers += "shift_";

    // The keyname is easy if the DOM Level 3 key property is implemented:
    if (event.key) keyname = event.key;
    // Use the keyIdentifier on Safari and Chrome for function key names
    else if (event.keyIdentifier && event.keyIdentifier.substring(0,2) !== "U+")
        keyname = event.keyIdentifier;
    // Otherwise, use the keyCode property and the code-to-name map below
    else keyname = Keymap.keyCodeToKeyName[event.keyCode];

    // If we couldn't figure out a key name, just return and ignore the event.
    if (!keyname) return;

    // The canonical key id is modifiers plus lowercase key name
    var keyid = modifiers + keyname.toLowerCase();

    // Now see if the key identifier is bound to anything
    var handler = this.map[keyid];

    if (handler) {  // If there is a handler for this key, handle it
        // Invoke the handler function
        var retval = handler.call(element, event, keyid);

        // If the handler returns false, cancel default and prevent bubbling
        if (retval === false) {
            if (event.stopPropagation) event.stopPropagation();  // DOM model
            else event.cancelBubble = true;                      // IE model
            if (event.preventDefault) event.preventDefault();    // DOM
            else event.returnValue = false;                      // IE
        }

        // Return whatever the handler returned
        return retval;
    }
};

// Utility function to convert a key identifier to canonical form.
// On non-Macintosh hardware, we could map "meta" to "ctrl" here, so that
// Meta-C would be "Command-C" on the Mac and "Ctrl-C" everywhere else.
Keymap.normalize = function(keyid) {
    keyid = keyid.toLowerCase();           // Everything lowercase
    var words = keyid.split(/\s+|[\-+_]/); // Split modifiers from name
    var keyname = words.pop();             // keyname is the last word
    keyname = Keymap.aliases[keyname] || keyname; // Is it an alias?
    words.sort();                          // Sort remaining modifiers
    words.push(keyname);                   // Add the normalized name back 
    return words.join("_");                // Concatenate them all
};

Keymap.aliases = {        // Map common key aliases to their "official" 
    "escape":"esc",       // key names used by DOM Level 3 and by 
    "delete":"del",       // the key code to key name map below.
    "return":"enter",     // Both keys and values must be lowercase here.
    "ctrl":"control",
    "space":"spacebar",
    "ins":"insert"
};

// The legacy keyCode property of the keydown event object is not standardized
// But the following values seem to work for most browsers and OSes.
Keymap.keyCodeToKeyName = {
    // Keys with words or arrows on them
    8:"Backspace", 9:"Tab", 13:"Enter", 16:"Shift", 17:"Control", 18:"Alt",
    19:"Pause", 20:"CapsLock", 27:"Esc", 32:"Spacebar", 33:"PageUp",  
    34:"PageDown", 35:"End", 36:"Home", 37:"Left", 38:"Up", 39:"Right",
    40:"Down", 45:"Insert", 46:"Del",

    // Number keys on main keyboard (not keypad)
    48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",

    // Letter keys. Note that we don't distinguish upper and lower case
    65:"A", 66:"B", 67:"C", 68:"D", 69:"E", 70:"F", 71:"G", 72:"H", 73:"I",
    74:"J", 75:"K", 76:"L", 77:"M", 78:"N", 79:"O", 80:"P", 81:"Q", 82:"R",
    83:"S", 84:"T", 85:"U", 86:"V", 87:"W", 88:"X", 89:"Y", 90:"Z",

    // Keypad numbers and punctuation keys. (Opera does not support these.)
    96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",
    106:"Multiply", 107:"Add", 109:"Subtract", 110:"Decimal", 111:"Divide",

    // Function keys
    112:"F1", 113:"F2", 114:"F3", 115:"F4", 116:"F5", 117:"F6",
    118:"F7", 119:"F8", 120:"F9", 121:"F10", 122:"F11", 123:"F12",
    124:"F13", 125:"F14", 126:"F15", 127:"F16", 128:"F17", 129:"F18",
    130:"F19", 131:"F20", 132:"F21", 133:"F22", 134:"F23", 135:"F24",

    // Punctuation keys that don't require holding down Shift
    // Hyphen is nonportable: FF returns same code as Subtract
    59:";", 61:"=", 186:";", 187:"=", // Firefox and Opera return 59,61 
    188:",", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
};
