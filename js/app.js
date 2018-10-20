/*
 * Create a list that holds all of your cards
 */

let card = document.getElementsByClassName("card");
const cards = [...card];
const deck = document.getElementById("card-deck");

//players's moves
let moves = 0;
let counter = document.querySelector(".moves");

//store player's stars
const stars = document.querySelectorAll(".fa-star");
let starsList = document.querySelectorAll(".stars li");

//variables for mat cards
let matchedCards = document.getElementsByClassName("match");
let closeIcon = document.querySelector(".close");
let modal = document.getElementById("popup")
var chosenCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

window.onload = startGame();
function startGame() {
    //a new deck of cards is shuffled for every game
    var shuffleCards = shuffle(cards);
    for (var i = 0; i < shuffleCards.length; i++) {
        deck.innerHTML = "";
        [].forEach.call(cards, function (item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // moves is set to 0
    moves = 0;
    counter.innerHTML = moves;
    for (var i = 0; i < stars.length; i++) {
        stars[i].style.color = "FFD700";
        stars[i].style.visibility = "visible";
    }
    //timer is set to 0
    second = 0;
    minute = 0;
    hour = 0;
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}

//rating calc
function movesCounter() {
    moves++;
    counter.innerHTML = moves;
    if (moves == 1) {
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }
   
    if (moves > 8 && moves < 16) {
        for (var i = 0; i < 3; i++) {
            if (i > 1) {
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 18) {
        for (var i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].style.visibility = "collapse";
            }
        }
    }
}

//timer funtion
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer() {
    interval = setInterval(function () {
        timer.innerHTML = minute + " mins " + second + " secs";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

//toggle cards
var displayCard = function () {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};


function cardFlipped() {
    chosenCards.push(this);
    var flips = chosenCards.length;
    if (flips === 2) {
        movesCounter();
        if (chosenCards[0].type === chosenCards[1].type) {
            matched();
        } else {
            unmatched();
        }
    }
}


function matched() {
    chosenCards[0].classList.add("match", "disabled");
    chosenCards[1].classList.add("match", "disabled");
    chosenCards[0].classList.remove("show", "open", "no-event");
    chosenCards[1].classList.remove("show", "open", "no-event");
    chosenCards = [];
}

function unmatched() {
    chosenCards[0].classList.add("unmatched");
    chosenCards[1].classList.add("unmatched");
    disabled();
    setTimeout(function () {
        chosenCards[0].classList.remove("show", "open", "no-event", "unmatched");
        chosenCards[1].classList.remove("show", "open", "no-event", "unmatched");
        enable();
        chosenCards = [];
    }, 1100);
}
//cards are disabled temporarily
function disabled() {
    Array.prototype.filter.call(cards, function (card) {
        card.classList.add("disabled");
    });
}
//cards are enabled and matched cards are disabled
function enable() {
    Array.prototype.filter.call(cards, function (card) {
        card.classList.remove("disabled");
        for (var i = 0; i < matchedCards.length; i++) {
            matchedCards[i].classList.add("disabled");
        }
    });
}
//reset gamemodal
function closeModal() {
    closeIcon.addEventListener("click", function () {
        modal.classList.remove("show");
        startGame();
    });
}

//success
function congrats() {
    if (matchedCards.length == 16) {
        clearInterval(interval);
        finalTime = timer.innerHTML;
        modal.classList.add("show");
        var starRating = document.querySelector(".stars").innerHTML;
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("star-rating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;
        closeModal();
    };
}

// play again
function playAgain() {
    modal.classList.remove("show");
    startGame();
}

for (var i = 0; i < cards.length; i++) {
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardFlipped);
    card.addEventListener("click", congrats);
};
