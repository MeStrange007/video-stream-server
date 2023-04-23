// Require necessary modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
// const { ExpressPeerServer } = require('peer');
const cors = require("cors");

// Create an Express app and a server instance
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
const server = http.createServer(app);

app.route("/health").get((req, res)=>{
  res.status(200).send({
    msg: "running"
  })
});

// Create a PeerJS server instance
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });

// Use the PeerJS server as middleware
// app.use('/peerjs', peerServer);

// Serve static files from the 'public' directory
// app.use(express.static('public'));

// Create a Socket.io instance and listen for connections
const io = socketIO(server,{
  cors: {
    origin: '*',
  }
});

// Define a global variable to store the broadcaster's stream
let broadcasterStream;

const room_loc = []

let broadcasterID;

io.on("connection", (socket) => {
  console.log("New Connection : ",socket.id);
	// socket.emit("me", socket.id);

  socket.on('broadcaster', (roomName) => {
    console.log("Broadcaster recieve : ",roomName," ",socket.id);
    broadcasterID = socket.id;
    // socket.join(roomID);
    // room_loc.push({"roomName":roomName,"roomID":roomID})
  })

  socket.on("request-stream",(data)=>{
    console.log("request-stream recieve : ");
    io.to(broadcasterID).emit("send-stream",data)
  })

  socket.on("stream",(data)=>{
    console.log("stream recieve : ");
    io.to(data.to).emit("recieve-stream",data.signal)
  })

	socket.on("disconnect", () => {
    console.log("disconnected : ",socket.id);
		// socket.broadcast.emit("callEnded")
	});

	// socket.on("callUser", ({ userToCall, signalData, from, name }) => {
	// 	io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	// });

	// socket.on("answerCall", (data) => {
	// 	io.to(data.to).emit("callAccepted", data.signal)
	// });
});



// io.on("connection", (socket) => {
// 	// socket.emit("me", socket.id);
//   console.log("User Connected with ID",socket.id);
//   socket.on('broadcaster', (roomName) => {
//     const roomID = socket.id;
//     socket.join(roomID);
//     socket.emit('room_created',roomID);
//     room_loc.push({"roomName":roomName,"roomID":roomID})
//   })
//   console.log(room_loc);
//   socket.on("viewer",(roomName)=>{
//     const viewerID = socket.id;
//     const room = room_loc.find(element => element.roomName==roomName)
//     io.to(room.roomID).emit("send-stream",{to:viewerID})
//   })

//   socket.on('disconnect', () => {
//     console.log('A user disconnected.');
//   });

	// socket.on("disconnect", () => {
	// 	socket.broadcast.emit("callEnded")
	// });

	// socket.on("callUser", ({ userToCall, signalData, from, name }) => {
	// 	io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	// });

	// socket.on("answerCall", (data) => {
	// 	io.to(data.to).emit("callAccepted", data.signal)
	// });
// });

// Listen for Socket.io connections
// io.on('connection', (socket) => {
//   console.log('A user connected.');
//   socket.on('broadcaster', (roomid) => {
//     const roomName = socket.id;
//     socket.join(roomName);
//     socket.emit('room_created',roomName);
//     room_loc = {...room_loc,roomid:roomName}
//   })
//   socket.on("accept-user")

//     // Listen for 'stream' event from the broadcaster
//     socket.on('stream', (stream) => {
//       // Store the broadcaster's stream
//       broadcasterStream = stream;
//     //   console.log("here");
//         console.log(stream);
//       // Broadcast the stream to all viewers in the room
//       socket.to(roomName).emit('viewerStream', stream);
//     });
//   });

  // Listen for 'viewer' event from a viewer
  // socket.on('viewer', () => {
  //   // Send a message to the viewer indicating that they are now a viewer
  //   socket.emit('viewer');

  //   // If there is a broadcaster, send them the broadcaster's stream
  //   if (broadcasterStream) {
  //     socket.emit('viewerStream', broadcasterStream);
  //   }
  // });

  // // Listen for Socket.io disconnections
  // socket.on('disconnect', () => {
  //   console.log('A user disconnected.');
  // });
// });

// Start the server
server.listen(PORT, () => {
  console.log('Server started on port ', PORT);
});
