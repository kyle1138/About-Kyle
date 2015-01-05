var chatToo = new WebSocket("ws://kyle.princesspeach.nyc:3000");
// var chatToo = new WebSocket("ws://localhost:3000");
var info = {namList:[]};

var talker = function(name , message){
  var li = document.createElement("li");
  var aCheck = message.slice(0 , 7);
  var pCheck = message.slice(-4);
  if((aCheck === "http://" || aCheck === "https:/") && (pCheck === ".jpg" || (pCheck === ".png" || pCheck === ".gif"))){
    var pic = document.createElement("img");
    pic.src = message;
    li.innerHTML = name + " : " + message + "</br>";
    li.appendChild(pic);}
    else if(aCheck === "http://" || aCheck === "https:/"){
    li.innerHTML = name + " : " + "<a href=\"" + message +"\" target =\"_blank\">"+ message +"</a>";
  }else{
  li.innerText = name + " : " + message;}
  var top = msgBox.firstChild;
  msgBox.insertBefore(li , top);
}

var userListGen = function(arr){
  usersList.innerHTML = "";
  arr.forEach(function(nam){
  var userNam = document.createElement("li");
  userNam.innerText = nam;
  usersList.appendChild(userNam);
  })


}
chatToo.addEventListener("message" , function(evt){
  mumble = JSON.parse(evt.data);
  if(mumble.message){
  talker(mumble.name , mumble.message);
  userListGen(mumble.namList);
  console.log(mumble.namList);
}else{
  userListGen(mumble.namList);}
})

handle.addEventListener("keyup" , function(){
  info["name"] = handle.value.trim();
  info["message"] = "";
  var out = JSON.stringify(info);
  chatToo.send(out);
})

input.addEventListener("keyup",function(){
  info["message"] = input.value.trim();
})

say.addEventListener("click", function(msg){
  if(input.value.trim().length > 0){
  var out = JSON.stringify(info);
  chatToo.send(out);
  input.value = "";}else{input.value = "";}
})

input.addEventListener("keydown",function(ent){
  if(input.value.trim().length > 0 && ent.keyCode === 13){
    var out = JSON.stringify(info);
    chatToo.send(out);
    input.value = "";
  }else if(input.value.trim().length < 2 && ent.keyCode === 13){input.value = "";}
})

chatToo.addEventListener("open" , function(){
  console.log("connected");
  info["name"] = prompt("What is your username?");
  if(info["name"] === ""){while(info["name"] === "")
  {info["name"] = prompt("You must enter a username to chat.");}
  handle.value = info["name"];
  info.namList.push(info["name"]);
  handle.value = info["name"];
  info["message"] = handle.value + " has joined the chatroom."
  var join = JSON.stringify(info);
  chatToo.send(join);}
  else{
  info.namList.push(info["name"]);
  handle.value = info["name"];
  info["message"] = handle.value + " has joined the chatroom."
  var join = JSON.stringify(info);
  chatToo.send(join);}
})

chatToo.addEventListener("close" , function(){
  console.log("Disconnected");
  talker(info["name"] ,"you have been disconnected");
})
