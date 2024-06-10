const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"], // Allow CORS requests from http://localhost:8080
  },
});

const users = {}; // Store usernames with their corresponding socket IDs

// Handle new client connections
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle setting the username for a new connection
  socket.on("set-username", (username, callback) => {
    if (users[username]) {
      // Username already taken, send error message
      callback({ success: false, message: "Username already taken" });
    } else {
      // Username available, save it and send success message
      users[username] = socket.id;
      socket.username = username;
      callback({ success: true, message: `Username set to ${username}` });
    }
  });

  // Handle sending messages
  socket.on("send-message", (message, room) => {
    if (!socket.username) {
      // User must set a username before sending messages
      socket.emit(
        "receive-message",
        "You must set a username before sending messages."
      );
      return;
    }

    // Create the payload with the message and the username
    const payload = { message, username: socket.username };
    if (room === "") {
      // Broadcast the message to all clients if no room is specified
      socket.broadcast.emit("receive-message", payload);
    } else {
      // Send the message to the specified room
      socket.to(room).emit("receive-message", payload);
    }
  });

  // Handle when a client joins or creates a room
  socket.on("join-room", (room, callback) => {
    if (!socket.username) {
      // User must set a username before joining rooms
      callback({
        success: false,
        message: "You must set a username before joining rooms.",
      });
      return;
    }

    // Join the specified room
    socket.join(room);
    const msg = { success: true, message: `You joined ${room}` };
    callback(msg.message); // Send a success message back to the client
  });

  // Handle client disconnections
  socket.on("disconnect", () => {
    if (socket.username) {
      // Remove the user from the users object
      delete users[socket.username];
    }
    console.log(`Disconnected: ${socket.id}`);
  });
});
