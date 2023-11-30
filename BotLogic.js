const prompt = require("prompt-sync")();
const { fetchQuestion } = require("./fetch") 
let { name, msg } = require("./index.js");


function fetchQuestionAndHandle() {

    fetchQuestion()
        .then(data => {
            const results = data.results || [];
            const questions = results.map(questionData => questionData.question);
            const incorrectAnswers = results.map(multipleChoice => multipleChoice.incorrect_answers || []);
            const correctAnswer = results.map(answerData => answerData.correct_answer);

            console.log("1. Question: " + questions[0]);
            const answers = incorrectAnswers[0].concat(correctAnswer[0]);
            shuffleArray(answers);

            // Display options with letters (A, B, C, D)
            answers.forEach((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // 65 is ASCII code for 'A'
                console.log(`${optionLetter}. ${option}`);
            });

            const choiceLetter = prompt("Which one is correct (A-D): ").toUpperCase(); // Convert user input to uppercase

            const choiceIndex = choiceLetter.charCodeAt(0) - 65; // Convert letter to index (0 for 'A', 1 for 'B', and so on)

            if (answers[choiceIndex] === correctAnswer[0]) {
                console.log('You are correct!');
                const quit = prompt("Would you like to continue? (y/n): ");
                if (quit === "n") {
                    console.log('Thanks for playing. See you next time!');
                } else {
                    fetchQuestionAndHandle(); // Continue the loop
                }
            } else {
                console.log(`Incorrect! The correct answer is: ${correctAnswer[0]}`);
                const quit = prompt("Would you like to continue? (y/n): ");
                if (quit === "n") {
                    console.log('Thanks for playing. See you next time!');
                } else {
                    fetchQuestionAndHandle(); // Continue the loop
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Call the function to start the loop

const letsgo = true
while(letsgo) { 
if (msg != '') {
    main(msg)
}
}
function main(msg) {
    if (msg == 'start') {
        console.log("Lets Go")
        fetchQuestionAndHandle();
    } else {
    }
}
