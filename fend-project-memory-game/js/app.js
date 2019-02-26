/*
 * Create a list that holds all of your cards
 */


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

// construct the the deck dom
function buildDeck(deckArray) {
    console.log(deckArray);
    const deckFragment = document.createDocumentFragment();
    let deckUlElement = document.querySelector('.deck');
    let i = 0;
    for(const deckArr of deckArray) {
        const newLiElement = document.createElement('li');
        const newIconElement = document.createElement('i');
        const newSpanElement = document.createElement('span');
        newSpanElement.innerText = ++i;
        newSpanElement.style.display = 'none';
        newSpanElement.className = 'dummy';
        newLiElement.className = 'card';
        newIconElement.className = deckArr;
        newLiElement.appendChild(newIconElement);
        newLiElement.appendChild(newSpanElement);
        deckFragment.appendChild(newLiElement);
    }
    deckUlElement.appendChild(deckFragment);
}

const deckArray = ['fab fa-github', 'fab fa-android', 'fab fa-amazon', 'fab fa-google',
                    'fab fa-facebook-f', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-apple',
                    'fab fa-github', 'fab fa-android', 'fab fa-amazon', 'fab fa-google',
                    'fab fa-facebook-f', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-apple'];
buildDeck(shuffle(deckArray));

const deckSelector = document.querySelector('.deck');
const counterElement = document.querySelector('.moves');
let clickCounter = 0;
let matchCounter = 0;
let failCounter = 0;
let deckQueue = [];
let score = 3;

deckSelector.addEventListener('click', function(events) {
    if(events && events.target && events.target.tagName.toLowerCase() === 'li') {
        console.log(events);
        if(deckQueue.length == 2)
            return;

        deckQueue.push(events.target);
        ++clickCounter;
        counterElement.textContent = clickCounter;
        events.target.classList.add('open');
        events.target.classList.add('show');

        //if 2 cards are clicked and both are same cards
        if(clickCounter % 2 === 0 
            && events.target.firstElementChild.className ===  deckQueue[0].firstElementChild.className) {
            //avoiding self clicks
            if(events.target.querySelector('.dummy').innerText === deckQueue[0].querySelector('.dummy').innerText) {
                --clickCounter;
                return;
            }
            ++matchCounter;
            deckQueue[0].classList.add('match');
            events.target.classList.add('match');
            deckQueue = [];

            //winning logic
            if(matchCounter * 2 === deckArray.length) {
                console.log('Hip hip hurray!!!');
                score = Math.ceil(3*((clickCounter - failCounter)/clickCounter));
            }
        } else if(clickCounter % 2 === 0
            && events.target.firstElementChild.className !==  deckQueue[0].firstElementChild.className) {
            ++failCounter;
            setTimeout(function(){ 
                events.target.classList.remove('open');
                events.target.classList.remove('show');
                deckQueue[0].classList.remove('open');
                deckQueue[0].classList.remove('show');
                deckQueue = [];
            }, 1000);
        }
    }
});
