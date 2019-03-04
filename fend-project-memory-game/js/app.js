/*
 * List that holds all of cards
 */
const deckArray = ['fab fa-github', 'fab fa-android', 'fab fa-amazon', 'fab fa-google',
                    'fab fa-facebook-f', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-apple',
                    'fab fa-github', 'fab fa-android', 'fab fa-amazon', 'fab fa-google',
                    'fab fa-facebook-f', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-apple'];

const temp = shuffle(deckArray);
const deckShuffledArray = split(temp, 4);
const deckSelector = document.querySelector('.deck');
const counterElement = document.querySelector('.moves');
const celebration = document.getElementById('confeti');
let clickCounter = 0;
let matchCounter = 0;
let failCounter = 0;
let deckQueue = [];

celebration.style.display = 'none';
buildDeck(deckShuffledArray);

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

//split array into matrix
function split(arr, n) {
    var res = [];
    while (arr.length) {
      res.push(arr.splice(0, n));
    }
    return res;
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
    const deckFragment = document.createDocumentFragment();
    let deckElement = document.querySelector('.deck');
    let dummyIndex = 0;

    for(const deckArr of deckArray) {
        const newDivRowElement = document.createElement('div');
        newDivRowElement.className = 'row';
        for(const deck of deckArr) {
            const newDivElement = document.createElement('div');
            const newIconElement = document.createElement('i');
            const newSpanElement = document.createElement('span');
            newSpanElement.innerText = ++dummyIndex;
            newSpanElement.style.display = 'none';
            newSpanElement.className = 'dummy';
            newDivElement.className = 'card';
            newIconElement.className = deck;
            newDivElement.appendChild(newIconElement);
            newDivElement.appendChild(newSpanElement);
            newDivRowElement.appendChild(newDivElement);
        }
        deckFragment.appendChild(newDivRowElement);
    }
    deckElement.appendChild(deckFragment);
}

//paint the stars
function giveStarRatings(score) {
    const stars = document.querySelector('.stars');

    for(let i = stars.children.length-1; i > 0 && i >= score ; --i)
        stars.children[i].firstElementChild.className = 'far fa-star';
}
/*
 * 
 */
deckSelector.addEventListener('click', function(events) {
    if(events && events.target && events.target.tagName.toLowerCase() === 'div'
      && events.target.classList.contains('card')) {
        if(deckQueue.length === 2 || events.target.classList.contains('open'))
            return;

        if(clickCounter === 0)
            timer();

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
            if(matchCounter * 2 === deckShuffledArray.length * deckShuffledArray[0].length) {
                celebration.style.display = 'block';
                stop();
                const score = Math.ceil(5*((clickCounter - failCounter)/clickCounter));
                giveStarRatings(score);
                $('#winning-modal').modal('show');
                $('.modal-body')[0].innerText = "Congratulations!! You finished the challenge in " + getTimerText()
                        + " with " + clickCounter + " steps..";
                setTimeout(function(){
                    celebration.style.display = 'none';
                }, 5000);
            }
        } else if(clickCounter % 2 === 0 //close the cards if they didn't match
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
        
        if(clickCounter % 16 === 0) {
            const score = Math.ceil(5*((clickCounter - failCounter)/clickCounter));
            giveStarRatings(score);
        }
    }
});

const restartElements = document.getElementsByClassName('restart');

function reloadPage() {
    location.reload();
}
for(restartElement of restartElements)
    restartElement.addEventListener('click', reloadPage, false);

let h1 = document.getElementById('display'),
    seconds = 0, minutes = 0, hours = 0,
    t;


function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00")
                    + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
                    + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}

/* Stop button */
function stop() {
    clearTimeout(t);
}

/* Clear button */
function clear() {
    h1.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
}

function getTimerText() {
    const splittedText = h1.textContent.split(':');

    const hourText  = splittedText[0] === '00' ? '' : splittedText[0] + ' hour ';
    const minuteText  = splittedText[1] === '00' ? '' : splittedText[1] + ' minutes ';
    const secondText  = splittedText[2] === '00' ? '' : splittedText[2] + ' seconds';

    return hourText + minuteText + secondText;
}
