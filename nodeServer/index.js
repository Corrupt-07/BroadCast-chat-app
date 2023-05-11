// Node server which will handle socket io connections
const CryptoJS = require("crypto-js");

const key = "CryptoJS.enc.Hex.parse(CryptoJS.lib.WordArray.random(16).toString())";
// console.log(key);

const io = require('socket.io')(8080, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log("new user is" + name);
        socket.broadcast.emit('user-joined', name)
    })

    socket.on('send', encryptedMessage => {
        const decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
        console.log("decrypted "+decryptedMessage);
        socket.broadcast.emit('receive', { message: decryptedMessage, name: users[socket.id] })
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })

})




