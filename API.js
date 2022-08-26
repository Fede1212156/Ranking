/*
[[[[[[[[[[[[[[ READ THE INSTRUCTIONS AND GO TO THE .ENV FILE ]]]]]]]]]]]]]]

[[[[[[[[[[[[[[ DON'T EDIT THIS FILE IF YOU DON'T KNOW WHAT YOU ARE DOING ]]]]]]]]]]]]]]

*/

const express = require("express")
const fetch = require("node-fetch")
const app = express()
require("dotenv")
var session = require('express-session')
const { login, rank, logger, getRank, errorlogger } = require("./recources/connect")

app.use(express.json())
app.use(session({
  secret: '1048928349387573',
  resave: false,
  saveUninitialized: false,
  expires: 600000,
}));


app.post("/:group/:gamepass/:playerid", async(req, res) => {
  const headers = req.headers
  const body = req.body
  const params = req.params
  console.log(body)
  if(!headers["authorization_key"]){
    return res.status(404).json({ code: 0, message: "Not found." });

  }

  var Response = await fetch(`https://groups.roblox.com/v2/users/${Number(params.playerid)}/groups/roles?groupid=${Number(params.group)}`, {
    method: "get",
    headers: {     
      'Content-Type': 'application/json', 
    }
  }).then(res => res.json())

  if(Response.data){
  Response.data.forEach(async group => {
    if(group.group.id == params.group){
      Response = group.role
      if(Response.rank == body.rankid){
        if(process.env.Webhook_Url){
        errorlogger("The user is already in this rank.", process.env.Webhook_Url)
        }
      return res.status(400).json({ code: 3, message: "The user is already in this rank." });
      }else{


    
  if(headers["authorization_key"] && headers["authorization_key"] !== process.env.AUTH_TOKEN){
    return res.status(401).json({ code: 1, message: "Unauthorized request." });
  }else{
    if(req.session && !req.session.xcsrf_token){
      
      await login(process.env.COOKIE, req.session).then(async function(response){
        
      await rank(params.playerid, body.rankid, params.group, params.gamepass, process.env.COOKIE, req.session).then(async function (response) {

setTimeout(async() => {
  
          var Response = await fetch(`https://groups.roblox.com/v2/users/${Number(params.playerid)}/groups/roles?groupid=${Number(params.group)}`, {
    method: "get",
    headers: {     
      'Content-Type': 'application/json', 
    }
  }).then(res => res.json())

  if(Response.data){
  Response.data.forEach(async group => {
    if(group.group.id == params.group){

        console.log(group.role.rank + ", " + body.rankid)

        
        if(group.role.rank == body.rankid){
         res.status(200).json({ code: 200, message: "Gamepass claimed." });
        console.log(req.session)
         if(process.env.Webhook_Url){
          logger(params.playerid, process.env.Webhook_Url, params.gamepass, params.group)
         }
        }else{
        console.log("Cookies expired. Please renew it.")
        if(process.env.Webhook_Url){
        errorlogger("Unauthenticated user! Please renew your cookie.", process.env.Webhook_Url)
        }
      console.log("The server returned an error please contact our support team.")
      return res.status(400).json({ code: 2, message: "Bad request." });
        }
        
    }
    })
  }
}, 5000);
       }).catch(function(err){
        console.log(err)
        if(process.env.Webhook_Url){
        errorlogger(err, process.env.Webhook_Url)
        }
        console.log("The server returned an error please contact our support team.")
      return res.status(400).json({ code: 2, message: "Bad request." });

    });

    }).catch(function(err){
        console.log(err)
        if(process.env.Webhook_Url){
        errorlogger(err, process.env.Webhook_Url)
        }
      console.log("The server returned an error please contact our support team.")
      return res.status(400).json({ code: 2, message: "Bad request." });

    });
   }
  }
  
      }
    }
  })

  }
        
})


app.use(function(req, res, next) {
  if(res.status(404)) {
    return res.json({ code: 0, message: "Not found." });
  }
});

app.listen(2022, function() {
  console.log("API is listening on port 2022")
})
