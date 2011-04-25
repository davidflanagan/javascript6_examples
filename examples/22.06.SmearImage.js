// Asynchronously replace the contents of the image with a smeared version.
// Use it like this: <img src="testimage.jpg" onclick="smear(this)"/>
function smear(img) {
    // Create an offscreen <canvas> the same size as the image
    var canvas = document.createElement("canvas");
    canvas.width = img.width; 
    canvas.height = img.height;

    // Copy the image into the canvas, then extract its pixels
    var context = canvas.getContext("2d"); 
    context.drawImage(img, 0, 0);          
    var pixels = context.getImageData(0,0,img.width,img.height)

    // Send the pixels to a worker thread
    var worker = new Worker("SmearWorker.js");      // Create worker
    worker.postMessage(pixels);                     // Copy and send pixels

    // Register a handler to get the worker's response
    worker.onmessage = function(e) {
        var smeared_pixels = e.data;                // Pixels from worker
        context.putImageData(smeared_pixels, 0, 0); // Copy them to the canvas
        img.src = canvas.toDataURL();               // And then to the img
        worker.terminate();                         // Stop the worker thread
        canvas.width = canvas.height = 0;           // Don't keep pixels around
    }
}
