const socket = io();
const inboxList = document.getElementById("inboxList");
const sentList = document.getElementById("sentList");

const emailForm = document.getElementById("emailForm");
const toInput = document.getElementById("to");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const userEmail = localStorage.getItem("email");

// Switch between sections
function showCompose() {
    document.getElementById("composeSection").style.display = "block";
    document.getElementById("inboxSection").style.display = "none";
    document.getElementById("sentSection").style.display = "none";
}

function showInbox() {
    document.getElementById("composeSection").style.display = "none";
    document.getElementById("inboxSection").style.display = "block";
    document.getElementById("sentSection").style.display = "none";
}

function showSent() {
    document.getElementById("composeSection").style.display = "none";
    document.getElementById("inboxSection").style.display = "none";
    document.getElementById("sentSection").style.display = "block";
}

// Handle form submission
emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const to = toInput.value;
    const subject = subjectInput.value || "(No Subject)";
    const message = messageInput.value;

    // Send message using socket
    socket.emit("sendMessage", {
        from: userEmail,
        to: to,
        subject: subject,
        message: message
    });

    // Add message to sent list
    const sentItem = document.createElement("li");
    sentItem.className = "sent";
    sentItem.innerHTML = `<strong>To: ${to}</strong><br><em>${subject}</em><br>${message}`;
    sentList.appendChild(sentItem);

    // Clear form fields
    toInput.value = "";
    subjectInput.value = "";
    messageInput.value = "";
});

// Handle receiving messages
socket.on("receiveMessage", function (data) {
    if (data.to === userEmail) {
        const inboxItem = document.createElement("li");
        inboxItem.className = "received";
        inboxItem.innerHTML = `<strong>From: ${data.from}</strong><br><em>${data.subject}</em><br>${data.message}`;
        inboxList.appendChild(inboxItem);
    }
});
