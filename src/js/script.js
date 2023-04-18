import _ from "underscore";
import { fireBase } from "../module/firebase.js";

// sets the images
{
    const rockImg = document.querySelectorAll(".rock");
    const rockUrl = new URL('../assets/rock.jpg', import.meta.url);
    rockImg[0].src = rockUrl.href;
    rockImg[1].src = rockUrl.href;

    const paperImg = document.querySelectorAll(".paper");
    const paperUrl = new URL('../assets/paper.png', import.meta.url);
    paperImg[0].src = paperUrl.href;
    paperImg[1].src = paperUrl.href;

    const scissorsImg = document.querySelectorAll(".scissors");
    const scissorsUrl = new URL('../assets/scissors.png', import.meta.url);
    scissorsImg[0].src = scissorsUrl.href;
    scissorsImg[1].src = scissorsUrl.href;
}


const playerArea = document.querySelector("#playerArea");
const startButton = document.querySelector("#startButton");
let playerName;
const theChosenOne = "red solid 2px";
const notTheChosenOne = null;
let playerWins = 0;

const firebase = new fireBase();
firebase.getFirebase().then(response => addHighscore(response));

playerArea.addEventListener("click", event => {
    let pcChoice = pcChoiceFunc();

    const rock = document.querySelector("#playerRock");
    const paper = document.querySelector("#playerPaper");
    const scissors = document.querySelector("#playerScissors");
    let playerChoice;

    // checks what the player chose
    if (event.target.id == "playerRock") {
        playerChoice = "Rock";
        rock.style.border = theChosenOne;
        paper.style.border = notTheChosenOne;
        scissors.style.border = notTheChosenOne;
    }
    else if (event.target.id == "playerPaper") {
        playerChoice = "Paper";
        rock.style.border = notTheChosenOne;
        paper.style.border = theChosenOne;
        scissors.style.border = notTheChosenOne;
    }
    else {
        playerChoice = "Scissors";
        rock.style.border = notTheChosenOne;
        paper.style.border = notTheChosenOne;
        scissors.style.border = theChosenOne;
    }
    // Round Tie
    if (playerChoice == pcChoice) {

    }
    // Round Player Win
    else if ((playerChoice == "Rock" && pcChoice == "Scissors") || (playerChoice == "Scissors" && pcChoice == "Paper") || (playerChoice == "Paper" && pcChoice == "Rock")) {
        playerWins++;
        displayLocalCurrentScore();
    }
    // Round Player Lose
    else {
        checkIfNewPlayer();
        playerWins = 0;
        displayLocalCurrentScore();
    }
})

// Displays current score
function displayLocalCurrentScore() {
    const h1 = document.querySelector(".playerName");
    h1.innerText = `${playerName} Wins: ${playerWins}`;
}

// when you press the "Play!" button after entering your name
startButton.addEventListener("click", event => {
    event.preventDefault();

    const formInput = document.querySelector("input").value;

    if (formInput.length != 0) {
        const gameArea = document.querySelector("#gameArea");
        const info = document.querySelector("#info");
        const playerNameAll = document.querySelectorAll(".playerName");

        gameArea.style.display = "inherit";
        info.style.display = "inherit";

        const score = document.querySelector("#score");
        const ol = document.createElement("ol");
        score.append(ol);

        playerName = formInput;

        for (let i = 0; i < playerNameAll.length; i++) {
            playerNameAll[i].innerText = playerName;
        }

        const form = document.querySelector("form");
        form.style.display = "none";
    }

})

// pc choose option
function pcChoiceFunc() {
    const pcChoiceClass = document.querySelectorAll(".pcChoice")
    let rps;

    let math = Math.floor(Math.random() * 3);

    // changes from numbers to a word and the border of computer area so show what the computer chose
    if (math == 0) {
        rps = "Rock";
        pcChoiceClass[0].style.border = theChosenOne;
        pcChoiceClass[1].style.border = notTheChosenOne;
        pcChoiceClass[2].style.border = notTheChosenOne;
    }
    else if (math == 1) {
        rps = "Paper";
        pcChoiceClass[0].style.border = notTheChosenOne;
        pcChoiceClass[1].style.border = theChosenOne;
        pcChoiceClass[2].style.border = notTheChosenOne;
    }
    else {
        rps = "Scissors";
        pcChoiceClass[0].style.border = notTheChosenOne;
        pcChoiceClass[1].style.border = notTheChosenOne;
        pcChoiceClass[2].style.border = theChosenOne;
    }
    return rps;
}

// Adds highscore on page
function addHighscore(arr) {
    highScoreArray = _.sortBy(arr, "score");

    const ol = document.querySelector("ol");
    ol.innerHTML = null;

    for (let i = 0; i < highScoreArray.length; i++) {
        const li = document.createElement("li");
        ol.prepend(li);
        li.innerText = `${highScoreArray[i].name} ${highScoreArray[i].score}`;
    }
}

// Checks if the player already exists or not and if players score is higher than on the list. Then updates database
function checkIfNewPlayer() {
    let newPlayer = true;

    for (let i = 0; i < highScoreArray.length; i++) {
        let name = highScoreArray[i].name;
        let score = highScoreArray[i].score;

        if (name == playerName && score < playerWins) {
            highScoreArray[i].score = playerWins;
            newPlayer = false;
            firebase.putToFireBase().then(response => addHighscore(response));
        }
        else if (name == playerName && score >= playerWins) newPlayer = false;
    }

    // New player
    if (newPlayer && playerWins > highScoreArray[0].score) {
        highScoreArray[0].score = playerWins;
        highScoreArray[0].name = playerName;
        firebase.putToFireBase().then(response => addHighscore(response));
    }
}