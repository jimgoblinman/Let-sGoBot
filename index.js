const express=require('express')
const body_parser = require("body-parser")
const axios = require('axios')

require('dotenv').config();

const app = express().use(body_parser.json());
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

let out_msg = "Whats up?";
let name = "";
let msg = "";

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

function main(phone_no_id, from, msg) {
    if (msg.toLowerCase() === 'start') {
        console.log("Let's Go");
        fetchQuestionAndHandle(phone_no_id, from);
    } else {
        out_msg = "Please enter 'start' to start. Type 'help' for a quick start of the Bot";
        sendWhatsAppMessage(phone_no_id, from, out_msg);
    }
}

function fetchQuestionAndHandle(phone_no_id, from) {
    fetchQuestion()
        .then(data => {
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

            // Wait for the user's response
            // You can use a delay or implement a mechanism to wait for user input from WhatsApp
            // For simplicity, let's assume user input is received instantly
            // For a real application, you would need to implement proper handling of user input
            // and continue the flow accordingly.
            // Example: Listen for user input from WhatsApp and call a function to handle the response.

            // Assuming user response is received instantly after sending the question
            out_msg = "Enter the number corresponding to the correct answer: ";
            sendWhatsAppMessage(phone_no_id, from, out_msg);

            // Assuming user response is received instantly after sending the question
            out_msg = "Enter the number corresponding to the correct answer: ";
            sendWhatsAppMessage(phone_no_id, from, out_msg);
            let userResponseIndex = msg
            const userChoiceIndex = parseInt(userResponseIndex) - 1;

            if (answers[userChoiceIndex] === correctAnswer[0]) {
                out_msg = 'You are correct!\n';
            } else {
                out_msg = `Incorrect! The correct answer is: ${correctAnswer[0]}\n`;
            }

            // Send the result to WhatsApp
            sendWhatsAppMessage(phone_no_id, from, out_msg);

            // Prompt the user to continue
            out_msg = "Would you like to continue? (y/n): ";
            sendWhatsAppMessage(phone_no_id, from, out_msg);
        })
        .catch(error => {
            console.error(error);
        });
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

module.exports = {
    name, msg
};