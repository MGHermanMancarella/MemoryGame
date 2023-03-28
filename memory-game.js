('use strict');

/** Memory game: find matching pairs of cards and flip both of them. */
const restartButton = document.getElementsByClassName('restart');
let attemptsCounter = document.getElementById('counter');
const startButton = document.getElementById('start');
let gameHasStarted = false; // var to start game
let flipCount = 0;
let attempts = 0;
let matchCount = 0;
let firstFlip; // first card (div)
let secondFlip; // second card (div)
let color1; // first card color (string)
let color2; // second card color (string)
if (flipCount >= 2) {
  flipCount = 0;
}

let okToFlip = true;
const COLORS = [
  'red',
  // 'blue',
  // 'green',
  // 'orange',
  // 'purple',
  'red',
  // 'blue',
  // 'green',
  // 'orange',
  // 'purple',
];

const colors = shuffle(COLORS);
const maxMatches = colors.length / 2;

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 */

startButton?.addEventListener('click', function (event) {
  if (gameHasStarted === false) {
    createCards(colors);
  }
  gameHasStarted = true;
});

function createCards(cards) {
  const gameBoard = document.getElementById('game');

  for (let color of cards) {
    const card = document.createElement('div');
    card.classList.add(color);
    gameBoard?.appendChild(card);
    card.addEventListener('click', handleCardClick);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  let color = card.classList.value;
  card.style.backgroundColor = color;
  removeListener(card);
  attempts++;
  attemptsCounter.innerText = attempts;
}

/** Flip a card face-down. */

function unFlipCards(card1, card2) {
  let cards = [card1, card2];
  for (let card of cards) {
    card.style.backgroundColor = 'white';
    addListener(card);
    okToFlip = true;
  }
  firstFlip = '';
  secondFlip = '';
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  gameOver();
  if (okToFlip) {
    if (flipCount === 0) {
      flipCard(evt.target);
      firstFlip = evt.target;
      color1 = evt.target.classList.value;
      flipCount++;
    } else if (flipCount === 1) {
      flipCard(evt.target);
      secondFlip = evt.target;
      color2 = evt.target.classList.value;

      flipCount = 0;

      if (color1 === color2) {
        firstFlip = '';
        secondFlip = '';
        matchCount++;
      } else {
        okToFlip = false;
        setTimeout(unFlipCards, 1000, firstFlip, secondFlip);
      }
    }
  }
}

function removeListener(target) {
  target.removeEventListener('click', handleCardClick);
}

function addListener(target) {
  target.addEventListener('click', handleCardClick);
}

function gameOver() {
  if (maxMatches === matchCount) {
    alert('WINNER');
  }
}
//  Save score  ----------------

// if ('lowestScore' in localStorage){
//   let lowestScore = Number(localStorage.getItem('lowestScore'))
//   if (attempts < lowestScore)
//   localStorage.clear();
//   localStorage.setItem('lowestScore' = attempts.toString()
// }
