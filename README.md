# Chat Application

This is a chat application which allows users to join different chat rooms and communicate with each other in real-time.

## Getting Started

To run the chat application locally on your machine,follow these steps:

1.Install Node.js and npm on your machine.

2.Clone this repository to your local machine using the following command: git clone https://github.com/Meghana0802/chat-application.git

3.You have to install socket.io and socket.io-client. Use the following command: npm i socket.io,npm i socket.io-client

4.Install snowpack on the client side by running:
  npm i --save-dev snowpack

5.Install nodemon on the server side:
  npm i -dev nodemon

## Usage

1.Start the server:
   nodemon server.js

2.Start the client:
   npm start

3.Open your web browser and go to `http://localhost:8080` to connect multiple clients to the sever.

4.Set your username by entering it in the provided input field and clicking the "Login" button.

5.Enter the name of the chat room you want to join in the "Room" input field and click the "Join" button.

6.Start chatting with other users in the selected room by typing your messages in the input field at the bottom and clicking the "Send" button.
 
## Features

1.Real-time messaging: Chat with other users in real-time.

2.Multiple rooms: Create or join different chat rooms to organize conversations.

3.Text formatting: Use buttons to apply formatting to your messages, such as bold, italic, and underline.

4.Hyperlinks: URLs in messages are automatically converted into clickable hyperlinks.

5.User-friendly interface: Clean and intuitive interface for easy navigation and messaging.