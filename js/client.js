console.log("client.js");

const socket = io('http://localhost:8080');
const key = "CryptoJS.enc.Hex.parse(CryptoJS.lib.WordArray.random(16).toString())";
console.log(key);
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInput')
const messageContainer = document.querySelector('.container');
var audio = new Audio('tone.mp3')

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }

}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')

    const encryptedMessage = CryptoJS.AES.encrypt(message, key).toString();
    console.log("encrypted " +encryptedMessage);
    socket.emit('send', encryptedMessage);
    messageInput.value = '';
})


const name = prompt("Enter your name to join")
socket.emit('new-user-joined', name)

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
    // socket.emit('counter', crypter.encrypt({id: id}));
})

socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left')
})

socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})


