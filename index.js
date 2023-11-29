const express=require('express')
const body_parser = require("body-parser")
const axios = require('axios')
require

const app=express().use(body_parser.json())
const token = process.env.TOKEN
const mytoken = process.env.MYTOKEN

app.listen(8000||process.env.PORT,()=> {
    console.log("Webhook is listening")
})

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res)=> {
    let mode=req.query["hub.mode"]
    let challenge=req.query["hub.challenge"]
    let token=req.query["hub.verify_token"]

    const mytoken="";

    if(mode && token) {
        if (mode==="subsribe" && token===mytoken) {
            res.status(200).send(challenge)
        } else {
            res.status(403)
        }
    }
})

//post request for sending message
app.post("/webhook", (req, res) =>{
    let body_param=req.body

    console.log(JSON.stringify(body_param,null,2))

    if(body_param.object) {
        if(body_param.entry && 
        body_param.entry[0].changes[0] &&
        body_param.entry[0].changes[0].value.message && 
        body_param.entry[0].changes[0].value.message[0]) {

            let phone_no_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body.entry[0].changes[0].value.messages[0].from;
            let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
            
            axios ({
                metod:"POST",
                url:"https://graph.facebook.com/v13.0"+phone_no_id+"/message?access_token="+token,
                data:{
                    messaging_product:"whatsapp",
                    to:from,
                    text:{
                        body:"Hi, Whats up?"
                    }
                },
                headers:{
                    "Content-Type": "application/json"
                }

            })       
            
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    }

})
