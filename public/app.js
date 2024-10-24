const socket = io();
const inboxList = document.getElementById("inboxList");
const sentList = document.getElementById("sentList");

const emailForm = document.getElementById("emailForm");
const toInput = document.getElementById("to");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const userEmail = localStorage.getItem("email");

document.querySelector('.email-display').textContent = `${userEmail}`;
// Check if user is logged in
if (!userEmail) {
    window.location.href = '/'; // Redirect to login page if not logged in
}

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


emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const to = toInput.value;
    const subject = subjectInput.value || "(No Subject)";
    const message = messageInput.value;

    
    socket.emit("sendMessage", {
        from: userEmail,
        to: to,
        subject: subject,
        message: message
    });


    const sentItem = document.createElement("li");
    sentItem.className = "sent";
    sentItem.innerHTML = `<strong>To: ${to}</strong><br><em>${subject}</em><br>${message}`;
    sentList.appendChild(sentItem);

    
    toInput.value = "";
    subjectInput.value = "";
    messageInput.value = "";
});


socket.on("receiveMessage", function (data) {
    if (data.to === userEmail) {
        const inboxItem = document.createElement("li");
        inboxItem.className = "received";
        inboxItem.innerHTML = `<strong>From: ${data.from}</strong><br><em>${data.subject}</em><br>${data.message}`;
        inboxList.appendChild(inboxItem);
    }
});
