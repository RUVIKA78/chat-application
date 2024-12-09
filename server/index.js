import express from "express"
import { chats } from "./data/data.js"
import { config } from "dotenv"
import cors from "cors"
import connectionDb from "./db.js"
import userRouter from "./routes/user.route.js"
import messageRouter from "./routes/message.route.js"
import { errorHandler, notFound } from "./middlewares/error.middleware.js"
import chatRouter from "./routes/chat.route.js"
import { Server } from "socket.io";
import path from "path"
config()

const app = express()

connectionDb()

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: "GET, POST, HEAD, PATCH, PUT, DELETE",
    credentials: true
}

app.use(cors(corsOptions))

app.use(express.json())

// app.get('/', (req, res) => {
//     res.send("API IS RUNNING")
// })

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(process.env.PORT || 4000, () => {
    console.log("server is running");
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        console.log(userData);
        
        if (!userData) {
            console.log("userData is undefined");
            return;
        }
    
        if (!userData._id) {
            console.log("userData._id is undefined");
            return;
        }
    
        // socket.userData = userData;  // Store userData in the socket instance
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room", room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageRecieved) => {
        if (!newMessageRecieved || !newMessageRecieved.chat) {
            return console.log("newMessageReceived or newMessageReceived.chat is not defined");
        }
    
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off('setup', () => {
        console.log("user disconnected");
        if (socket.userData) {
            socket.leave(socket.userData._id);
        }
    });
});


//production
const __dirname1 = path.resolve();
if (process.env.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname1, './client/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    })
}
else{
    app.get('/', ()=> {
    console.log("server is running");
    
})
}