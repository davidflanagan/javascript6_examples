/*
 * This is server-side JavaScript, intended to be run with NodeJS.
 * It runs a WebSocket server on top of an HTTP server, using an external
 * websocket library from https://github.com/miksago/node-websocket-server/
 * If it gets an  HTTP request for "/" it returns the chat client HTML file.
 * Any other HTTP requests return 404. Messages received via the 
 * WebSocket protocol are simply broadcast to all active connections.
 */
var http = require('http');            // Use Node's HTTP server API
var ws = require('websocket-server');  // Use an external WebSocket library

// Read the source of the chat client at startup. Used below.
var clientui = require('fs').readFileSync("wschatclient.html");

// Create an HTTP server
var httpserver = new http.Server();  

// When the HTTP server gets a new request, run this function
httpserver.on("request", function (request, response) {
    // If the request was for "/", send the client-side chat UI.
    if (request.url === "/") {  // A request for the chat UI
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(clientui);
        response.end();
    }
    else {  // Send a 404 "Not Found" code for any other request
        response.writeHead(404);
        response.end();
    }
});

// Now wrap a WebSocket server around the HTTP server
var wsserver = ws.createServer({server: httpserver});

// Call this function when we receive a new connection request
wsserver.on("connection", function(socket) {
    socket.send("Welcome to the chat room."); // Greet the new client
    socket.on("message", function(msg) {      // Listen for msgs from the client
        wsserver.broadcast(msg);              // And broadcast them to everyone
    });
});

// Run the server on port 8000. Starting the WebSocket server starts the
// HTTP server as well. Connect to http://localhost:8000/ to use it.
wsserver.listen(8000);
