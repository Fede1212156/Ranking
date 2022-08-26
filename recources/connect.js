/*
[[[[[[[[[[[[[[ READ THE INSTRUCTIONS AND GO TO THE .ENV FILE ]]]]]]]]]]]]]]

[[[[[[[[[[[[[[ DON'T EDIT THIS FILE IF YOU DON'T KNOW WHAT YOU ARE DOING ]]]]]]]]]]]]]]

*/

const fetch = require('node-fetch');
const { EmbedBuilder, WebhookClient } = require("discord.js")


getRank = async function(group, user){
var promise = new Promise(async function(resolve, reject) {  
  var Response = await fetch(`https://groups.roblox.com/v2/users/${Number(user)}/groups/roles?groupid=${Number(group)}`, {
    method: "get",
    headers: {     
      'Content-Type': 'application/json', 
    }
  }).then(res => res.json())

  if(Response.data){
  Response.data.forEach(async group => {
    if(group.group.id == group){
      resolve(group.role)
    }
    })
  }                                                   
})
return promise;
}

async function login(cookie, session){
await fetch("https://auth.roblox.com", {
    method: "post",
    headers: { Cookie: `.ROBLOSECURITY=${cookie};`, "Content-Type": "application/json" }
}).then(async function (res) {
const csrf = res.headers.get("x-csrf-token")
  
if(csrf && res.status === 403){
 session.csrf = csrf
 return csrf; 
}
}).catch(async function(err) {
  throw new Error(err)
})
}


async function rank(userid, rank, groupid, gamepass, cookie, session){

  var Response = await fetch(`https://groups.roblox.com/v2/users/${Number(userid)}/groups/roles?groupid=${Number(groupid)}`, {
    method: "get",
    headers: {     
      'Content-Type': 'application/json', 
    }
  }).then(res => res.json())




  
const res1 = await fetch("https://groups.roblox.com/v1/groups/" + groupid + "/roles", {
  method: "GET",
  headers: { 
    'Content-Type': 'application/json', 
  }
}).then(res => res.json())
res1.roles.forEach(async function(role){

if(rank == role.rank){
  console.log(role)
  const data = JSON.stringify({ roleId: Number(role.id) })
  
  
console.log(data)
await  fetch(`https://groups.roblox.com/v1/groups/${groupid}/users/${userid}`, {
  method: "PATCH", 
  body: data,
  headers: { 
    'Content-Type': 'application/json', 
    "X-CSRF-TOKEN": session.csrf,
    Cookie: `.ROBLOSECURITY=${cookie};`,
 
  }
}).then(async function (res) {
  console.log(res)
if(res.status !== 200){
  new Error(res.statusText)
 }else if(res.status === 200){

  return res.statusText;
 }
}).catch(async function(err) {
  new Error(err)
})



}
})


}

async function logger(userid, webhook, gamepass, groupid){ 


  var Response = await fetch(`https://groups.roblox.com/v2/users/${Number(userid)}/groups/roles?groupid=${Number(groupid)}`, {
    method: "get",
    headers: {     
      'Content-Type': 'application/json', 
    }
  }).then(res => res.json())

  if(Response.data){
  Response.data.forEach(async group => {
    if(group.group.id == groupid){
      Response = group.role
      console.log(Response)

const webhookClient = new WebhookClient({ url: webhook });


  
  const username = await fetch("https://api.roblox.com/users/" + userid).then(res => res.json());


  const info = await fetch("https://api.roblox.com/marketplace/productinfo?assetId=" + gamepass).then(res => res.json());


const embed = new EmbedBuilder()
.setTitle("Gamepass Claimed Sucessfully")
.setDescription(username.Username + " has claimed " + info.Name + " and has been sucessfully promoted to " + Response.name + "!")
.setColor("0x32CD32")

webhookClient.send({
	embeds: [embed],
});

    }
  })
  }
}


async function errorlogger(err, webhook){ 
const webhookClient = new WebhookClient({ url: webhook });


  
const embed = new EmbedBuilder()
.setTitle("Gamepass Claim Failed")
.setDescription("Error: " + err)
.setColor("0xFF5733")
webhookClient.send({
	embeds: [embed],
});
}


module.exports.login = login;
module.exports.rank = rank;
module.exports.errorlogger = errorlogger;
module.exports.logger = logger;
module.exports.getRank = getRank
