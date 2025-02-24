import { Server } from "socket.io";

const websocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default websocket;