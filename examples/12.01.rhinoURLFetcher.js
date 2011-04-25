/*
 * A download manager application with a simple Java GUI
 */

// Import the Swing GUI components and a few other classes
importPackage(javax.swing); 
importClass(javax.swing.border.EmptyBorder);
importClass(java.awt.event.ActionListener);
importClass(java.net.URL);
importClass(java.io.FileOutputStream);
importClass(java.lang.Thread);

// Create some GUI widgets
var frame = new JFrame("Rhino URL Fetcher");     // The application window
var urlfield = new JTextField(30);               // URL entry field
var button = new JButton("Download");            // Button to start download
var filechooser = new JFileChooser();            // A file selection dialog
var row = Box.createHorizontalBox();             // A box for field and button
var col = Box.createVerticalBox();               // For the row & progress bars
var padding = new EmptyBorder(3,3,3,3);          // Padding for rows

// Put them all together and display the GUI
row.add(urlfield);                               // Input field goes in the row
row.add(button);                                 // Button goes in the row
col.add(row);                                    // Row goes in the column
frame.add(col);                                  // Column goes in the frame
row.setBorder(padding);                          // Add some padding to the row
frame.pack();                                    // Set to minimum size
frame.visible = true;                            // Make the window visible

// When anything happens to the window, call this function.
frame.addWindowListener(function(e, name) {
    // If the user closes the window, exit the application.
    if (name === "windowClosing")                // Rhino adds the name argument
        java.lang.System.exit(0);
});

// When the user clicks the button, call this function
button.addActionListener(function() {
    try {
        // Create a java.net.URL to represent the source URL.
        // (This will check that the user's input is well-formed)
        var url = new URL(urlfield.text);
        // Ask the user to select a file to save the URL contents to.
        var response = filechooser.showSaveDialog(frame);
        // Quit now if they clicked Cancel
        if (response != JFileChooser.APPROVE_OPTION) return;
        // Otherwise, get the java.io.File that represents the destination file
        var file = filechooser.getSelectedFile();
        // Now start a new thread to download the url
        new java.lang.Thread(function() { download(url,file); }).start();
    }    catch(e) {
        // Display a dialog box if anything goes wrong
        JOptionPane.showMessageDialog(frame, e.message, "Exception",
                                     JOptionPane.ERROR_MESSAGE);
    }
});

// Use java.net.URL, etc. to download the content of the URL and use
// java.io.File, etc. to save that content to a file.  Display download
// progress in a JProgressBar component.  This will be invoked in a new thread.
function download(url, file) {
    try {
        // Each time we download a URL we add a new row to the window
        // to display the url, the filename, and the download progress
        var row = Box.createHorizontalBox();     // Create the row
        row.setBorder(padding);                  // Give it some padding
        var label = url.toString() + ": ";       // Display the URL 
        row.add(new JLabel(label));              //   in a JLabel
        var bar = new JProgressBar(0, 100);      // Add a progress bar
        bar.stringPainted = true;                // Display filename in
        bar.string = file.toString();            //   the progress bar
        row.add(bar);                            // Add bar to this new row
        col.add(row);                            // Add row to the column
        frame.pack();                            // Resize window

        // We don't yet know the URL size, so bar starts just animating
        bar.indeterminate = true; 

        // Now connect to the server and get the URL length if we can
        var conn = url.openConnection();         // Get java.net.URLConnection
        conn.connect();                          // Connect and wait for headers
        var len = conn.contentLength;            // See if we have URL length
        if (len) {                               // If length known, then 
            bar.maximum = len;                   //   set the bar to display 
            bar.indeterminate = false;           //   the percent downloaded
        }

        // Get input and output streams
        var input = conn.inputStream;            // To read bytes from server
        var output = new FileOutputStream(file); // To write bytes to file
        
        // Create an array of 4k bytes as an input buffer
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,
                                                         4096);
        var num;
        while((num=input.read(buffer)) != -1) {  // Read and loop until EOF
            output.write(buffer, 0, num);        // Write bytes to file
            bar.value += num;                    // Update progress bar
        }
        output.close();                          // Close streams when done
        input.close();
    }
    catch(e) { // If anything goes wrong, display error in progress bar
        if (bar) {
            bar.indeterminate = false;           // Stop animating
            bar.string = e.toString();           // Replace filename with error
        }
    }
}
