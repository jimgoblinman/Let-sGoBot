const express=require('express')
const body_parser = require("body-parser")
const axios = require('axios')

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

    if(mode && token) {
        if (mode==="subscribe" && token===mytoken) {
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
    console.log("Post excecuted")

    if(body_param.object) {
        console.log("Test")
        if (
            body_param.entry &&
            body_param.entry[0].changes[0] &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            console.log("Test2")
            let phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            
            console.log("phone_no_id:", phone_no_id);
            console.log("from:", from);
            console.log("msg_body:", msg_body)

            axios ({
                method:"POST",
                url:"https://graph.facebook.com/v17.0"+phone_no_id+"/messages?access_token="+token,
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
