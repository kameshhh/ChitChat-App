const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();

dotenv.config()
connectDB()
const userRoute = require('./routes/userRoute');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require("./routes/messageRoutes")

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
// const http = require('http');
// const server = http.createServer(app);
const { Server } = require('socket.io');

app.use(express.json())



app.get('/', (req, res) => {
    res.send("API is Running")
});

app.use("/api/user", userRoute)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`The Server is running on ${PORT}`))




const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io")

    socket.on("setup", (userData) => {
        socket.join(userData._id)
            // console.log(userData._id)
        socket.emit("connected")

    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));



    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})