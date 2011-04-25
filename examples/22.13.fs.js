/*
 * These functions have been tested in Google Chrome 10.0 dev.
 * You may need to launch Chrome with these options:
 * --unlimited-quota-for-files       : enables filesystem access
 * --allow-file-access-from-files    : allows testing from file:// URLs
 */

// Lots of the asynchronous functions we use accept an optional error callback.
// This one just logs the error.
function logerr(e) { console.log(e); }

// requestFileSystem() gets us a sandboxed local filesystem accessible only
// to apps from this origin. We can read and write files at will, but
// can't get out of the sandbox to access the rest of the system.
var filesystem; // Assume this is initialized before the funcs below are called.
requestFileSystem(PERSISTENT,             // Or TEMPORARY for cache files
                  10*1024*1024,           // We'd like 10 megabytes, please
                  function(fs) {          // When done, call this function
                      filesystem = fs;    // Just save the filesystem into
                  },                      // a global variable.
                  logerr);                // Call this if an error occurs


// Read the contents of the specified file as text and pass them to callback.
function readTextFile(path, callback) {
    // Call getFile() to find the FileEntry for the specified filename
    filesystem.root.getFile(path, {}, function(entry) {
        // This function is called with the FileEntry for the file
        // Now we call the FileEntry.file() method to get the File object
        entry.file(function(file) {          // Call this with the File
            var reader = new FileReader();   // Create a FileReader
            reader.readAsText(file);         // And read the file
            reader.onload = function() {     // When read successful
                callback(reader.result);     // Pass it to the callback
            } 
            reader.onerror = logerr;         // Log readAsText() errors
        }, logerr);                          // Log file() errors
    }, 
    logerr);                                 // Log getFile() errors
}

// Append the specified contents to the file at the specified path, creating
// a new file if no file by that name already exists.  Call callback when done.
function appendToFile(path, contents, callback) {
    // filesystem.root is the root directory.
    filesystem.root.getFile( // Get a FileEntry object 
        path,                // The name and path of the file we want
        {create:true},       // Create it if it doesn't already exist
        function(entry) {    // Call this when it has been found
            entry.createWriter(     // Create a FileWriter object for the file
                function(writer) {  // Call this function when created
                    // By default a writer starts at the beginning of the file.
                    // We want to start writing at the end of the file
                    writer.seek(writer.length);  // Move to end of file
                    
                    // Convert file contents to a Blob. The contents argument
                    // can be a string or a Blob or an ArrayBuffer.
                    var bb = new BlobBuilder()
                    bb.append(contents);
                    var blob = bb.getBlob();
                    
                    // Now write the blob to the file
                    writer.write(blob);
                    writer.onerror = logerr;  // Log errors from write()
                    if (callback)             // If there is a callback
                        writer.onwrite = callback; // call it on success
                },
                logerr);     // Log errors from createWriter()
        },
        logerr);             // Log errors from getFile()
}

// Delete the named file, calling the optional callback when done
function deleteFile(name, callback) {
    filesystem.root.getFile(name, {},          // Get FileEntry for named file
                            function(entry) {  // Pass the FileEntry here
                                entry.remove(callback, // Delete the FileEntry
                                             logerr);  // Or log remove() error
                            },
                            logerr);           // Log a getFile() error
}

// Create a new directory with the specified name
function makeDirectory(name, callback) {
    filesystem.root.getDirectory(name,           // Name of directory to create
                                 {               // Options
                                     create: true,  // Create, if doesn't exist
                                     exclusive:true // Error if it does exist
                                 },
                                 callback,       // Call this when done
                                 logerr);        // Log any errors
}

// Read the contents of the specified directory, and pass them, as an array
// of strings, to the specified callback function
function listFiles(path, callback) {
    // If no directory specified, list the root directory. Otherwise, look up
    // the named directory and list it (or log an error looking it up).
    if (!path) getFiles(filesystem.root);
    else filesystem.root.getDirectory(path, {}, getFiles, logerr);

    function getFiles(dir) {               // This function is used above
        var reader = dir.createReader();   // A DirectoryReader object
        var list = [];                     // Where we store filenames
        reader.readEntries(handleEntries,  // Pass entries to function below
                           logerr);        // or log an error.

        // Reading directories can be a multistep process. We have to keep
        // calling readEntries() until we get an empty array. Then we're done
        // and we can pass the full list to the user's callback function.
        function handleEntries(entries) {
            if (entries.length == 0) callback(list);  // We're done
            else {
                // Otherwise, add these entries to the list and ask for more
                // The array-like object contains FileEntry objects and
                // we need to get the name of each one.
                for(var i = 0; i < entries.length; i++) {
                    var name = entries[i].name;              // Get entry name
                    if (entries[i].isDirectory) name += "/"; // Mark directories
                    list.push(name);                         // Add to list
                }
                // Now get the next batch of entries
                reader.readEntries(handleEntries, logerr);
            }
        }
    }
}
