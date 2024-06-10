import { io } from "socket.io-client"; // Import the socket.io client library

// Get references to various DOM elements
const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");
const roomsList = document.getElementById("rooms-list");

// Initialize socket.io connection to the server
const socket = io("http://localhost:3000");
let currentRoom = ""; // Track the currently selected room
const messages = {}; // Store messages by room

// Event handler for successful connection to the server
socket.on("connect", () => {
  displayMessage(`You connected with id: ${socket.id}`, "");
});

// Event listener for DOMContentLoaded to ensure elements are available
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const container = document.querySelector(".container");
  const loginContainer = document.querySelector(".login-container");

  // Handle login form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission
    const username = document.getElementById("username").value.trim(); // Get the username

    if (username === "") {
      loginError.textContent = "Please enter a username."; // Display error if username is empty
      return;
    }
    // Emit set-username event to the server
    socket.emit("set-username", username, (response) => {
      if (response.success) {
        loginContainer.style.display = "none"; // Hide login container
        container.style.display = "flex"; // Show main container
      } else {
        loginError.textContent = response.message; // Display error message
      }
    });
  });
});

// Event listener for message form submission
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the default form submission
  const message = messageInput.value; // Get the message input value
  const room = roomInput.value; // Get the room input value
  if (message === "") return;
  displayMessage(`You: ${message}`, room); // Display the message in the UI
  socket.emit("send-message", message, room); // Emit send-message event to the server
  messageInput.value = ""; // Clear the message input
});

// Function to handle selecting a room
// Function to handle selecting a room
function selectRoom(room) {
  currentRoom = room; // Update the current room

  console.log("Selected room:", room);

  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = ""; // Clear the message container

  if (messages[room]) {
    console.log("Messages for room", room, ":", messages[room]);
    // Append all messages belonging to the selected room
    messages[room].forEach((message) => {
      console.log("Displaying message:", message);
      displayMessage(message, room);
    });
  }
}

// Event listener for join room button click
joinRoomButton.addEventListener("click", handleJoin);

// Function to handle joining a room
function handleJoin() {
  const room = roomInput.value;
  if (room === "") return;

  // Check if the room already exists in the list
  const existingRoom = Array.from(roomsList.children).find(
    (item) => item.textContent === room
  );
  if (!existingRoom) {
    // Add new room to the list
    const roomItem = document.createElement("li");
    roomItem.textContent = room;
    roomItem.addEventListener("click", () => selectRoom(room)); // Add click event listener to select the room
    roomsList.appendChild(roomItem); // Append the room item to the list
  }

  // Emit join-room event to the server
  socket.emit("join-room", room, (message) => {
    displayMessage(message, room); // Display the join room message
  });
}

// Function to display a message in the chat UI
function displayMessage(message, room) {
  if (!messages[room]) {
    messages[room] = []; // Initialize messages array for the room if it doesn't exist
  }
  if (!messages[room].includes(message)) {
    messages[room].push(message); // Add message to the room's messages array
  }

  const div = document.createElement("div"); // Create a new div element

  // Regular expression to match URLs in the message
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const messageWithLinks = message.replace(
    urlRegex,
    '<a href="$1" style="color: blue;">$1</a>'
  );

  // Set the innerHTML of the div to include the message with links
  div.innerHTML = messageWithLinks;
  const messageContainer = document.getElementById("message-container");
  messageContainer.appendChild(div); // Append the div to the message container

  // Scroll to the bottom of the message container
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Event listener for receiving messages from the server
socket.on("receive-message", ({ message, username }) => {
  const room = roomInput.value;
  displayMessage(`${username}: ${message}`, room); // Display received message
});

// Event listeners for text formatting buttons
const italicButton = document.getElementById("italic");
const boldButton = document.getElementById("bold");
const underlineButton = document.getElementById("underline");

// Handle italic formatting
italicButton.addEventListener("click", () => {
  const message = messageInput.value;
  const italicizedMessage = document.createElement("i");
  italicizedMessage.textContent = message;
  messageInput.value = "";
  messageInput.focus();
  messageInput.setRangeText(
    italicizedMessage.outerHTML,
    messageInput.selectionStart,
    messageInput.selectionEnd,
    "end"
  );
});

// Handle bold formatting
boldButton.addEventListener("click", () => {
  const message = messageInput.value;
  const boldMessage = document.createElement("b");
  boldMessage.textContent = message;
  messageInput.value = "";
  messageInput.focus();
  messageInput.setRangeText(
    boldMessage.outerHTML,
    messageInput.selectionStart,
    messageInput.selectionEnd,
    "end"
  );
});

// Handle underline formatting
underlineButton.addEventListener("click", () => {
  const message = messageInput.value;
  const underlinedMessage = document.createElement("u");
  underlinedMessage.textContent = message;
  messageInput.value = "";
  messageInput.focus();
  messageInput.setRangeText(
    underlinedMessage.outerHTML,
    messageInput.selectionStart,
    messageInput.selectionEnd,
    "end"
  );
});
