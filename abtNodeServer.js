var library = {Alice_in_Wonderland:"aliceInWonderland.txt" , Peter_Pan:"peter.txt" , Aesops_Fables:"aesop.txt" ,
Jungle_Book:"jungle.txt" , Andersens_Fairy_Tales:"andersen.txt"};
var fs = require("fs");
var http = require("http");
var path = require("path");


var server = http.createServer(function(req,res){
  console.log(req.url);
  var reqUrl = req.url;
  var urlArr = reqUrl.split("/");

  // urlArr.forEach(function(x){
  //   console.log(x + "   is the url")

  fs.readFile(urlArr[1] , function(err,data){

    if(library[urlArr[1]]){

      fs.readFile("index.html" , function(err,data1){

        fs.readFile( library[urlArr[1]] , function(err,data2){
          var paginatedFile = paginate(data2.toString() , urlArr[2]);
          var result = data1.toString().replace("REPLACE", paginatedFile);
          result = result.replace("pBack", "http://kyle.princesspeach.nyc/" + urlArr[1] + "/" + (parseInt(urlArr[2]) - 1)+" ");

          var book = data2.toString();
          var lines = book.split("\n");
          var totalPages = Math.floor(lines.length / 22) + 1;
          if (urlArr[2] < totalPages) {
            result = result.toString().replace("pNext", "http://kyle.princesspeach.nyc/" + urlArr[1] + "/" + (parseInt(urlArr[2]) + 1));
          } else {
            result = result.toString().replace("pNext","");
          }

          result = result.toString().replace("ii", urlArr[2]);
          title = urlArr[1].replace(/_/g, " ");
          result = result.replace("TITLE", title);
          res.end(result);
        });
      });
}




    else if(data){
    var out = data;
    res.end(out);
}
  else
{res.end("<html><body><h1>File Not Found</h1></body></html>")}


  })
  if(urlArr[2]){
  fs.readFile(urlArr[2],function(err,data){
    if(data){
      var out = data.toString();
      res.end(out);
    }

  })
}
})

server.listen(2000);

var paginate = function(book , pg){
  var pages = [];
  var lines = book.split("\n");
  var startLine = (pg-1) * 22;
  for (i=startLine ; i < startLine +22; i++){
    pages.push(lines[i]);
  }
  return pages.join("</br>");
}
