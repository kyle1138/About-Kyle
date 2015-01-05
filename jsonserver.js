var censor = function(string){
  stringCheck = "check  " + string.trim() + "  check";
  for(var cc = 0 ; cc < curse.length ; cc ++){
    for(var i = 0; i < stringCheck.length - curse[cc].length ; i++){
      var inspect = stringCheck.slice(i,i + curse[cc].length);
      if(inspect === curse[cc]){
        string = "CENSORED! AND KICKED!";
        kill = 1;
        return string;
      }
    }
  }
  return string.trim();
}

var wisp = function(wispH){
  var wTarget = -1;
    for(var wc = 0; wc < namListS.length; wc++ ){
      if(namListS[wc] === wispH["message"].slice(9,9 + namListS[wc].length)){
        wTarget = wc;
        wc = namListS.length;
        console.log(wc + " is the whisper target");
      }
    }
    for(var sc = 0; sc < namListS.length; sc++ ){
      if(namListS[sc] === wispH["name"]){
        wsTarget = sc;
        console.log(sc + " is the whisper sender");
      }
    }
    out = JSON.stringify(wispH);
    if (wTarget > -1){
    clients[wTarget].send(out);
    clients[wsTarget].send(out);
  }
};


var funCheck = function(string){
  for(var cc = 0 ; cc < fun.length ; cc ++){
    for(var i = 0; i <= string.length - fun[cc].length ; i++){
      var inspect = string.slice(i,i + fun[cc].length);
      if(inspect === fun[cc]){
        string = string.slice(0,i) + newFun[cc] + string.slice(i + fun[cc].length , string.length);
      }
    }
  }
  return string.trim();
}

var WSS = require("ws").Server;
var server = new WSS({port:3000});
var curse = [" shit " , " fuck " , " ass ", " cunt " , " shithead "];
var fun = ["(table flip)" , "(umadbro)" , "(fu)" , "(gimme)" , "(srs)"];
var newFun = ["(╯°□°）╯︵ ┻━┻" , "¯\\_(ツ)_/¯" ,"╭∩╮（︶︿︶）╭∩╮" , "༼ つ ◕_◕ ༽つ", "(ಠ_ಠ)"];
var clients = [];
var msgLog = [];
var namListS = [];

server.on("connection" , function(ws){
  console.log("there has been a connection.")
  clients.push(ws);
  msgLog.forEach(function(msg){ws.send(msg)})

  ws.on("message" , function(msg){
    var hash = JSON.parse(msg);
    var kill = 0;
    var index = clients.indexOf(ws);
    namListS[index] = hash.name;
    hash["namList"] = namListS;
    console.log(hash.name + ": " + hash.message);
    hash.message = censor(hash.message);
    hash.message = funCheck(hash.message);
    if(hash.message.slice(0,9) === "/whisper@")
      {wisp(hash)}else
      {
    msgOut = JSON.stringify(hash);
    msgLog.push(msgOut);
    if(hash.message === "CENSORED! AND KICKED!"){
      ws.send("YOU HAVE BEEN KICKED");
      setTimeout(function(){ws.close()} , 3);
      console.log("death")}

    clients.forEach(function(user){user.send(msgOut)});
}
  })
  ws.on("close" , function(){
    var escapee = clients.indexOf(ws);
    clients.splice(escapee,1);
    namListS.splice(escapee,1);
    console.log("somebody left")
    clients.forEach(function(user){user.send("A user has left the room")})

  })
})
