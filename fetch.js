const prompt = require("prompt-sync")();

async function fetchQuestion() {
    // Use dynamic import for node-fetch
    const fetch = (await import("node-fetch")).default;

    let settings = false
    let category = "";
    let difficulty = "";
    let type = "";


    if (settings == false) {//difficulty, gamemode
        console.log("Please enter some Settings for your Trivia Game. Leave it blank for the default settings.")
        category = prompt("Which category would you like to pick: "); //Print all the categories
        difficulty = prompt("Which difficulty would you like to pick: (1 Easy, 2 Medium, 3 Hard) ");
        type = prompt("Which type would you like to pick: (1 Multiple Choice, 2 True/False) ");
        
        settings = true;
    }

    

    if (difficulty == 1) {
        difficulty = "easy";
    } else if (difficulty == 2) {
        difficulty = "medium";
    } else if (difficulty == 3) {
        difficulty = "hard";
    }

    if (type == "1") {
        type = "multiple"
    } else {
        type = "boolean"
    }

    console.log("Category: " +category);
    console.log("Difficulty: " +difficulty);
    console.log("Type: " +type);

    const url = `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=${type}`;
    
    console.log(url);

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

module.exports = { fetchQuestion };
