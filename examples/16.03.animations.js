// Convert element e to relative positioning and "shake" it left and right.
// The first argument can be an element object or the id of an element.
// If a function is passed as the second argument, it will be invoked 
// with e as an argument when the animation is complete.
// The 3rd argument specifies how far to shake e. The default is 5 pixels.
// The 4th argument specifies how long to shake for. The default is 500 ms.
function shake(e, oncomplete, distance, time) {
    // Handle arguments
    if (typeof e === "string") e = document.getElementById(e);
    if (!time) time = 500;
    if (!distance) distance = 5;

    var originalStyle = e.style.cssText;      // Save the original style of e
    e.style.position = "relative";            // Make e relatively positioned
    var start = (new Date()).getTime();       // Note the animation start time
    animate();                                // Start the animation

    // This function checks the elapsed time and updates the position of e.
    // If the animation is complete, it restores e to its original state.
    // Otherwise, it updates e's position and schedules itself to run again.
    function animate() {
        var now = (new Date()).getTime();     // Get current time
        var elapsed = now-start;              // How long since we started
        var fraction = elapsed/time;          // What fraction of total time?

        if (fraction < 1) {     // If the animation is not yet complete
            // Compute the x position of e as a function of animation
            // completion fraction. We use a sinusoidal function, and multiply
            // the completion fraction by 4pi, so that it shakes back and
            // forth twice.
            var x = distance * Math.sin(fraction*4*Math.PI);
            e.style.left = x + "px";

            // Try to run again in 25ms or at the end of the total time.
            // We're aiming for a smooth 40 frames/second animation.
            setTimeout(animate, Math.min(25, time-elapsed));
        }
        else {                  // Otherwise, the animation is complete
            e.style.cssText = originalStyle  // Restore the original style
            if (oncomplete) oncomplete(e);   // Invoke completion callback
        }
    }
}

// Fade e from fully opaque to fully transparent over time milliseconds.
// Assume that e is fully opaque when this function is invoked.
// oncomplete is an optional function that will be invoked with e as its
// argument when the animation is done. If time is omitted, use 500ms.
// This function does not work in IE, but could be modified to animate
// IE's nonstandard filter property in addition to opacity.
function fadeOut(e, oncomplete, time) {
    if (typeof e === "string") e = document.getElementById(e);
    if (!time) time = 500;

    // We use Math.sqrt as a simple "easing function" to make the animation
    // subtly nonlinear: it fades quickly at first and then slows down some.
    var ease = Math.sqrt;

    var start = (new Date()).getTime();    // Note the animation start time
    animate();                             // And start animating

    function animate() {
        var elapsed = (new Date()).getTime()-start; // elapsed time
        var fraction = elapsed/time;                // As a fraction of total
        if (fraction < 1) {     // If the animation is not yet complete
            var opacity = 1 - ease(fraction);  // Compute element opacity
            e.style.opacity = String(opacity); // Set it on e  
            setTimeout(animate,                // Schedule another frame
                       Math.min(25, time-elapsed));
        }
        else {                  // Otherwise, we're done
            e.style.opacity = "0";          // Make e fully transparent
            if (oncomplete) oncomplete(e);  // Invoke completion callback
        }
    }
}
