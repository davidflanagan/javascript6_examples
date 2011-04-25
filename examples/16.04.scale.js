// Scale the text size of element e by the specified factor
function scale(e, factor) {
    // Use the computed style to query the current size of the text
    var size = parseInt(window.getComputedStyle(e,"").fontSize);
    // And use the inline style to enlarge that size
    e.style.fontSize = factor*size + "px";
}

// Alter the background color of element e by the specified amount.
// Factors > 1 lighten the color and factors < 1 darken it.  
function scaleColor(e, factor) {
    var color = window.getComputedStyle(e, "").backgroundColor;  // Query
    var components = color.match(/[\d\.]+/g);   // Parse r,g,b, and a components
    for(var i = 0; i < 3; i++) {                // Loop through r, g and b
        var x = Number(components[i]) * factor;         // Scale each one
        x = Math.round(Math.min(Math.max(x, 0), 255));  // Round and set bounds
        components[i] = String(x);                      
    }
    if (components.length == 3)  // A rgb() color
        e.style.backgroundColor = "rgb(" + components.join() + ")";
    else                         // A rgba() color
        e.style.backgroundColor = "rgba(" + components.join() + ")";
}
