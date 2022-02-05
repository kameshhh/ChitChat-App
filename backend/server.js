const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();

dotenv.config()
connectDB()
const userRoute = require('./routes/userRoute')

app.use(express.json())



app.get('/', (req, res) => {
    res.send("API is Running")
});

app.use("/api/user", userRoute)


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`The Server is running on ${PORT}`))