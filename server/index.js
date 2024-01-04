const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const colors = require("colors");
const cors = require('cors')


dotenv.config();
const app = express();
app.use(cors({
    origin: "http://localhost:3000"
}));
connectDB();


app.use(express.json()); // to accept json data

app.get('/', (req,res)=>{
    res.send("Welcome")
})

app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes) ;
app.use("/api/message",messageRoutes);


const PORT = process.env.PORT;

const server = app.listen(PORT,console.log(`Server running on PORT ${PORT}...`.bgBlue.red.bold.underline));

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket)=>{
    console.log("connected to socket.io".bgRed.bold);
   
    
    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        socket.emit("connection");
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("joined chat room: "+room)
    })

    socket.on('typing', (room)=> socket.in(room).emit('typing'));
    socket.on('stop typing', (room)=> socket.in(room).emit('stop typing'));

    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user =>{
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved",newMessageRecieved);
        })
    })
})