const socket = io(); // socket will send io storing it

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let online_users = document.querySelector("#online_users");

let username;

const audio = new Audio("sound.mp3");

do {
  username = prompt("Please enter your name :- ");
} while (!username);

socket.emit("user-joined", username);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value); // this will send textarea value
    textarea.value = "";
  }
});

function sendMessage(msg2) {
  let msg = {
    user: username,
    message: msg2,
  };

  appendMessage(msg, "outgoing");

  // sending to server

  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;

  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);

  scrollToBottom();
}

// Recieve Message

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  audio.play();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

socket.on("user-joined", (username) => {
  let mainDiv = document.createElement("div");

  let markup = `
        <h4>${username} has joined the chat</h4>
    `;

  mainDiv.classList.add("joined");

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);

  scrollToBottom();

});

socket.on("user-left", (username) => {
  let mainDiv = document.createElement("div");

  let markup = `
        <h4>${username} has left the chat</h4>
    `;

  mainDiv.classList.add("joined");

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);

  scrollToBottom();
});

function show_online_users(users) {
 
    let usersDiv = document.createElement("option");

    users.forEach((element) => {

        usersDiv.value = element;
        usersDiv.innerText = element;

    online_users.appendChild(usersDiv);
  });
}

socket.on("online_users",(online_users)=>{
    show_online_users(online_users);
})