const socket = io();

// hambergur functionlity
const hambergur_btn = document.querySelector("#hamburger");
const active_users_container = document.querySelector(".users");
const overlay = document.querySelector(".overlay");

hambergur_btn.addEventListener("click",()=>{
    active_users_container.classList.toggle("users-hamb");
    overlay.classList.toggle("body-overlay");
});

overlay.addEventListener("click",()=>{
  active_users_container.classList.toggle("users-hamb");
  overlay.classList.toggle("body-overlay");
})

let username;

const chats = document.querySelector(".chat__body");
const active_users = document.querySelector(".users__body");
const inputMsgSendBox = document.querySelector(".chat__footer--search-div input");
const mesgSendBtn = document.querySelector("#mesg-send-btn");

do{
    username = prompt("Enter your name : ");
}while(!username)

// It will be called when new user is joined
socket.emit("new-user-joined",username);

// Notifying the new user joined
socket.on('user-connected',(socket_name)=>{
   userJoinLeft(socket_name, 'joined');
});

// Notifying the new user left
socket.on('user-disconnected',(socket_name)=>{
    userJoinLeft(socket_name,"left");
});

// Functionto create joined/Left status div
function userJoinLeft(name,status){
    const statusMesg = `<div class="join-left">
                            <p>${name} has ${status} the chat</p>
                        </div>`;
    chats.scrollTop = chats.scrollHeight;
    chats.insertAdjacentHTML("beforeend",statusMesg);
}

// To show all the active users
socket.on("user-list",(users)=>{
    active_users.innerHTML="";
    users_arr= Object.values(users);
    document.querySelector(".users-section-heading").textContent=`Users (${users_arr.length})`;
    users_arr.forEach((user)=>{
     let active_user_name = ` <div class="users__body-user">
                                <div class="user__name--div">
                                    <p class="name">${user}</p>
                                    <div class="dot"></div>
                                </div>
                            </div>`;
      active_users.insertAdjacentHTML("beforeend",active_user_name);
    })
})

// function for sending the messages
mesgSendBtn.addEventListener("click",()=>{
    let data={
        user : username,
        msg : inputMsgSendBox.value
    };
    if(inputMsgSendBox.value !="")
    {
        appendMessage(data,'outgoing');
        socket.emit("message",data);
        inputMsgSendBox.value="";
    }
    else{
        alert("Enter some text");
    }
});

window.addEventListener("keyup",(e)=>{
    if(e.key === "Enter")
    {
        let data={
            user : username,
            msg : inputMsgSendBox.value
        };
        if(inputMsgSendBox.value !="")
        {
            appendMessage(data,'outgoing');
            socket.emit("message",data);
            inputMsgSendBox.value="";
        }
        else{
            alert("Enter some text");
        }
   }
})

socket.on("message",(data)=>{
    appendMessage(data, "incoming")
})

function appendMessage(data,status){

    if(status ==="outgoing")
    {
        let msgSent =`<div class="mesg-sent">
                            <div class="msg">
                                <p class="msg-author-name">you</p><br>
                                <p>${data.msg}
                                </p>
                            </div>
                    </div>`;
         chats.scrollTop = chats.scrollHeight;
         chats.insertAdjacentHTML("beforeend",msgSent);
    }
    else{
        let msgSent =`   <div class="mesg-receive">
                                <div class="msg">
                                    <p class="msg-author-name">${data.user}</p><br>
                                    <p>${data.msg}
                                    </p>
                                </div>
                        </div>`;

         chats.scrollTop = chats.scrollHeight;
         chats.insertAdjacentHTML("beforeend",msgSent);
    }
    
    
}

