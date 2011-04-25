/*
 * Find all elements of CSS class "sparkline", parse their content as
 * a series of numbers, and replace it with a graphical representation.
 *
 * Define sparklines with markup like this:
 *   <span class="sparkline">3 5 7 6 6 9 11 15</span>
 *
 * Style sparklines with CSS like this:
 *   .sparkline { background-color: #ddd; color: red; }
 *
 * - Sparkline color is from the computed style of the CSS color property.
 * - Sparklines are transparent, so the normal background color shows through.
 * - Sparkline height is from the data-height attribute if defined or from
 *   the computed style for the font-size otherwise.
 * - Sparkline width is from the data-width attribute if it is defined
 *   or the number of data points times data-dx if that is defined or
 *   the number of data points times the height divided by 6
 * - The minimum and maximum values of the y axis are taken from the data-ymin
 *   and data-ymax attributes if they are defined, and otherwise come from
 *   the minimum and maximum values of the data.
 */
onLoad(function() {   // When the document firsts loads
    // Find all elements of class "sparkline"
    var elts = document.getElementsByClassName("sparkline");
    main: for(var e = 0; e < elts.length; e++) { // For each element
        var elt = elts[e];

        // Get content of the element and convert to an array of numbers.
        // If the conversion fails, skip this element.
        var content = elt.textContent || elt.innerText;  // Element content
        var content = content.replace(/^\s+|\s+$/g, ""); // Strip spaces
        var text = content.replace(/#.*$/gm, "");  // Strip comments
        text = text.replace(/[\n\r\t\v\f]/g, " "); // Convert \n etc, to space
        var data = text.split(/\s+|\s*,\s*/);      // Split on space or comma
        for(var i = 0; i < data.length; i++) {     // For each chunk
            data[i] = Number(data[i]);             // Convert to a number
            if (isNaN(data[i])) continue main;     // and abort on failure
        }

        // Now compute the color, width, height, and y axis bounds of the 
        // sparkline from the data, from data- attributes of the element,
        // and from the computed style of the element.
        var style = getComputedStyle(elt, null); 
        var color = style.color;
        var height = parseInt(elt.getAttribute("data-height")) ||
            parseInt(style.fontSize) || 20;
        var width = parseInt(elt.getAttribute("data-width")) ||
            data.length * (parseInt(elt.getAttribute("data-dx")) || height/6);
        var ymin = parseInt(elt.getAttribute("data-ymin")) ||
            Math.min.apply(Math, data);
        var ymax = parseInt(elt.getAttribute("data-ymax")) ||
            Math.max.apply(Math, data);
        if (ymin >= ymax) ymax = ymin + 1;

        // Create the canvas element.
        var canvas = document.createElement("canvas"); 
        canvas.width = width;     // Set canvas dimensions
        canvas.height = height;
        canvas.title = content;   // Use the element content as a tooltip
        elt.innerHTML = "";       // Erase existing element content
        elt.appendChild(canvas);  // Insert the canvas into the element

        // Now plot the points (i,data[i]), transforming to canvas coordinates.
        var context = canvas.getContext('2d');
        for(var i = 0; i < data.length; i++) {          // For each data point
            var x = width*i/data.length;                // Scale i
            var y = (ymax-data[i])*height/(ymax-ymin);  // Scale data[i]
            context.lineTo(x,y); // First lineTo() does a moveTo() instead
        }
        context.strokeStyle = color;   // Specify the color of the sparkline
        context.stroke();              // and draw it
    }
});
