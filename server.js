const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Default route to serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Add a route for the email page
app.get("/email.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "email.html"));
});

// Handle any undefined routes (404)
app.get("*", (req, res) => {
    res.status(404).send("Page Not Found");
});

io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle sending messages
    socket.on("sendMessage", (data) => {
        console.log(`Message from ${data.from} to ${data.to}: ${data.message}`);

        // Send the message to the intended recipient
        io.emit("receiveMessage", data); // In real cases, use rooms to target specific users
    });
    
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
