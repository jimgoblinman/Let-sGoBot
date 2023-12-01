const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

const app = express().use(bodyParser.json());
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

let out_msg = "Whats up?";
let name = "";
let msg = "";
let questionAsked = false;
let nthQuestion = false;

app.listen(8000 || process.env.PORT, () => {
    console.log("Webhook is listening");
});

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if (mode && token) {
        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
});

app.post("/webhook", (req, res) => {
    let body_param = req.body;

    if (body_param.object) {
        if (
            body_param.entry &&
            body_param.entry[0].changes[0] &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            name = body_param.entry[0].changes[0].value.contacts[0].profile.name;
            msg = body_param.entry[0].changes[0].value.messages[0].text.body;
            console.log("name: " + name);
            console.log("msg: " + msg);

            main(phone_no_id, from, msg);

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

async function main(phone_no_id, from, msg) {
    
    if (msg.toLowerCase() === 'start') {
        console.log("Waiting fetch");
        questionAsked = true;
        await fetchQuestionAndHandle(phone_no_id, from);
    } else if (msg.toLowerCase() === "help") {
        out_msg = "Welcome to the Trivia Bot!\n\n" +
                  "To start the trivia, type 'start'.\n" +
                  "The bot will provide you with a question and options.\n" +
                  "Reply with the number corresponding to the correct answer.\n" +
                  "For example, if the correct answer is option 2, type '2'.\n" +
                  "The bot will let you know if you are correct and ask if you want to continue.\n" +
                  "Enjoy the trivia!";
        sendWhatsAppMessage(phone_no_id, from, out_msg);
    } else if (questionAsked == false) {
        out_msg = "Please enter 'start' to start. Type 'help' for a quick start of the Bot";
        sendWhatsAppMessage(phone_no_id, from, out_msg);
    }
}

async function fetchQuestionAndHandle(phone_no_id, from) {
    try {
        const data = await fetchQuestion();
        const results = data.results || [];
        const questions = results.map(questionData => questionData.question);
        const incorrectAnswers = results.map(multipleChoice => multipleChoice.incorrect_answers || []);
        const correctAnswer = results.map(answerData => answerData.correct_answer);

        out_msg = `1. Question: ${questions[0]}\n`;
        const answers = incorrectAnswers[0].concat(correctAnswer[0]);
        shuffleArray(answers);

        // Display options with numbers
        answers.forEach((option, index) => {
            out_msg += `${index + 1}. ${option}\n`;
        });

        // Send the question to WhatsApp
        sendWhatsAppMessage(phone_no_id, from, out_msg);
        questionAsked = true;
        await delay (500)
        msg = ''
        // Wait for the user's response
        await delay(5000)
        waitForUserResponse(phone_no_id, from, answers, correctAnswer[0]);
        console.log("test")
    } catch (error) {
        console.error(error);
    }
}

async function waitForUserResponse(phone_no_id, from, answers, correctAnswer) {
    let userResponseIndex;

    // Prompt the user for input
    //out_msg = "Enter the number corresponding to the correct answer (1-4): ";
    //sendWhatsAppMessage(phone_no_id, from, out_msg);

    // Wait for the user's response asynchronously
   
    // Validate user input
    userResponseIndex = await msg.trim();
    msg = '';  // Empty the msg variable for the next input

    //Write here chatgpt

    
    
    if (!isInteger(userResponseIndex) || parseInt(userResponseIndex) < 1 || parseInt(userResponseIndex) > 4) {
        // Send an error message for invalid input
        out_msg = "Wrong Input pls enter a number between 1 and 4: ";
        sendWhatsAppMessage(phone_no_id, from, out_msg);
        delay(500);
        return;
    } else {

    const userChoiceIndex = parseInt(userResponseIndex) - 1;

    console.log("User Choice"+userChoiceIndex)
    console.log("correct answer"+ correctAnswer)

    if (answers[userChoiceIndex] === correctAnswer) {
        console.log("True");
        out_msg = 'You are correct!\n';
    } else {
        console.log("False");
        out_msg = `Incorrect! The correct answer is: ${correctAnswer}\n`;
    }

    // Send the result to WhatsApp
    sendWhatsAppMessage(phone_no_id, from, out_msg);
    await delay(1000);

    // Prompt the user to continue
    out_msg = "Would you like to continue? (y/n): ";
    sendWhatsAppMessage(phone_no_id, from, out_msg);
    await delay(5000);
    if (msg.toLowerCase == 'y' || msg.toLowerCase == 'yes') {
        letsGo();
    } else {
        out_msg = "See ya next time!";
        sendWhatsAppMessage(phone_no_id, from, out_msg);
        await delay(500);
    }
    questionAsked = false;
    await delay(500);
    }
}


function sendWhatsAppMessage(phone_no_id, to, body) {
    axios({
        method: "POST",
        url: `https://graph.facebook.com/v17.0/${phone_no_id}/messages?access_token=${token}`,
        data: {
            messaging_product: "whatsapp",
            to: to,
            text: {
                body: body,
            }
        },
        headers: {
            "Content-Type": "application/json",
        }
    });
}

function fetchQuestion() {
    const url = "https://opentdb.com/api.php?amount=1&type=multiple";
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        })
        .catch(error => {
            throw error;
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isInteger(value) {
    return /^\d+$/.test(value);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function letsGo() {
    console.log("Waiting fetch");
    questionAsked = true;
    await fetchQuestionAndHandle(phone_no_id, from);
}

module.exports = {
    name, msg
};
