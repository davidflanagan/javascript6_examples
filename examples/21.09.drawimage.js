// Draw a line in the upper left
c.moveTo(5,5);
c.lineTo(45,45);
c.lineWidth = 8;
c.lineCap = "round";
c.stroke();

// Define a transformation
c.translate(50,100);       
c.rotate(-45*Math.PI/180); // Straighten out the line
c.scale(10,10);            // Enlarge it so we can see the individual pixels

// Use draw image to copy the line
c.drawImage(c.canvas,
            0, 0, 50, 50,  // source rectangle: untransformed
            0, 0, 50, 50); // destination rectangle: transformed
