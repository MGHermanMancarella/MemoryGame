'use strict';

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'blue',
  'green',
  'orange',
  'purple',
];

const colors = shuffle(COLORS);

createCards(colors);

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
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById('game');

  for (let color of colors) {
    const card = document.createElement('div');
    card.classList.add(color);
    gameBoard?.appendChild(card);
    card.addEventListener('click', handleCardClick);
  }
}
let flipCount = 0;
let attempts = 0;
let firstFlip; // first card (div)
let secondFlip; // second card (div)
let color1; // first card color (string)
let color2; // second card color (string)

/** Flip a card face-up. */

function flipCard(card) {
  if (secondFlip === undefined) {
    let color = card.classList.value;
    return (card.style.backgroundColor = color);
  }
  while (flipCount === 2) {
    if (color1 !== color2) {
      flipCount = 0;
      unFlipCards(firstFlip);
    } else {
      flipCount = 0;
    }
  }
}

/** Flip a card face-down. */

function unFlipCards(card) {
  console.log('changing background color of firstFlip');
  card.style.backgroundColor = 'white';

  // console.log('changing background color of secondFlip');
  // secondFlip.style.backgroundColor = 'white';
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  flipCount++;
  attempts++;
  if (flipCount === 1) {
    flipCard(evt.target);
    firstFlip = evt.target;
    color1 = evt.target.classList.value;
  } else if (flipCount === 2) {
    flipCard(evt.target);
    secondFlip = evt.target;
    color2 = evt.target.classList.value;
  }
}

//  Save score  ----------------

// if ('lowestScore' in localStorage){
//   let lowestScore = Number(localStorage.getItem('lowestScore'))
//   if (attempts < lowestScore)
//   localStorage.clear();
//   localStorage.setItem('lowestScore' = attempts.toString()
// }
