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

app.listen(PORT, console.log(`The Server is running on ${PORT}`))