const socket = io();
let user;

const userEmailDiv = document.getElementById("userEmailDiv");
const chatBox = document.getElementById("chatBox");
const messagesLog = document.getElementById("messagesLog");

chatBox.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    socket.emit("userMessage", {
      user: user,
      message: e.target.value,
    });
    e.target.value = "";
  }
});

socket.on("messages", ({ messages }) => {
  console.log(messages);
  if (!user) {
    return;
  }
  messagesLog.innerHTML = "";
  messages.forEach((m) => {
    messagesLog.innerHTML += `<br/> ${m.timestamp} ${m.user}: ${m.message}`;
  });
});

socket.on("newUser", ({ newUserEmail }) => {
if(!user) return
  Swal.fire({
    title: `${newUserEmail} se ha unido al chat`,
    toast: true,
    position: "top-right",
    timer: 2000
  });
});

Swal.fire({
  title: "Identificate",
  text: "Necesitas un nombre de usuario",
  input: "text",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "Necesitas un nombre de usuario para poder chatear";
    }
  },
}).then((result) => {
  user = result.value;
  userEmailDiv.innerHTML = `User: ${user}`;
  socket.emit("authenticated", { user });
});

