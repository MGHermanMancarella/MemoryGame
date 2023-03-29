('use strict');

/** Memory game: find matching pairs of cards and flip both of them. */
const restartButton = document.getElementById('restart');
let attemptsCounter = document.getElementById('counter');
const startButton = document.getElementById('start');
let lowscoreHTML = document.getElementById('lowScore');
const resetScoreButton = document.getElementById('resetScore');
let gameHasStarted = false; // var to start game
let flipCount = 0;
let attempts = 0;
let matchCount = 0;
let firstFlip; // first card (div)
let secondFlip; // second card (div)
let color1; // first card color (string)
let color2; // second card color (string)
let okToFlip = true;

//-------slider--------

const myRange = document.getElementById('myRange');
const slideCounter = document.getElementById('slideCounter');
const localCardCount = localStorage.getItem('cardCount');
let cardCount;
if (localCardCount === null) {
  cardCount = 10;
  updateHTMLSliderVal(10);
} else {
  cardCount = Number(localCardCount);
  updateHTMLSliderVal(localCardCount);
}

myRange.addEventListener('input', () => {
  slideCounter.innerText = myRange.value;
  cardCount = myRange.value;
});

function updateHTMLSliderVal(val) {
  slideCounter.innerText = val.toString();
  myRange.value = val;
}

//------------------------

//------randomYorN radio------

const YNRadio = document.getElementsByName('randomYorN');
const localRandomColors = localStorage.getItem('randomColors');
let randomColors;
function updateHTMLRadioVal() {
  if (localRandomColors == undefined || localRandomColors === 'false') {
    YNRadio[1].checked = true;
    randomColors = false;
  } else {
    YNRadio[0].checked = true;
    YNRadio[1].checked = false;
    randomColors = true;
  }
}
updateHTMLRadioVal();
function setLocalRandomColor() {
  localStorage.setItem('randomColors', randomColors.toString());
}
for (let option of YNRadio) {
  option.addEventListener('change', function (event) {
    if (option.checked) {
      if (option.value === 'yes') {
        randomColors = true;
        setLocalRandomColor();
      } else {
        randomColors = false;
        setLocalRandomColor();
      }
    }
  });
}

// function randomColorYorN() {
//   for (let i = 0; i < YNRadio.length; i++) {
//     if (YNRadio[i].checked && YNRadio[i].value === 'yes') {
//       return (randomColors = true);
//     } else {
//       return (randomColors = false);
//     }
//   }
// }

//
//------Lowest score-------
//

let lowScoreLocal = localStorage.getItem('lowestscore');

if (lowScoreLocal === null) {
  lowscoreHTML.innerText = 'n/a';
} else {
  lowscoreHTML.innerText = lowScoreLocal;
}

if (flipCount >= 2) {
  flipCount = 0;
}
function updateHTMLLowScore(arg) {
  lowscoreHTML.innerText = arg;
}
function updateLocalLowScore() {
  localStorage.setItem('lowestscore', attempts.toString());
}

//
//-------Randomize functions--------
//

function RandomRGB() {
  let red = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue = Math.floor(Math.random() * 256);
  return `rgb(${red},${green},${blue})`;
}
function RandoCardCount() {
  const min = 4;
  const max = 50;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//--------------------

//----Card and Color Array Data---

const defaultArr = [
  'red',
  'blue',
  'LemonChiffon',
  'green',
  'MediumOrchid',
  'maroon',
  'fuchsia',
  'teal',
  'aqua',
  'DodgerBlue',
  'lawngreen',
  'chocolate',
  'Orange',
  'yellow',
  'LightSalmon',
  'darkolivegreen',
  'MidnightBlue',
  'slategray',
  'white',
  'LimeGreen',
  'black',
  'DarkKhaki',
  'Indigo',
  'SaddleBrown',
  'DarkSlateGray',
];

let finalCards = [];
let maxMatches;
//--------------------

//------Create Cards + shuffle-----
function generateArray() {
  for (let i = 0; i < cardCount / 2; i++) {
    if (randomColors) {
      finalCards.push(RandomRGB());
    } else {
      finalCards.push(defaultArr[i]);
    }
  }
  finalCards = shuffle(finalCards.concat(finalCards));
  maxMatches = finalCards.length / 2;
}

/** Shuffle  */

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

//--------------------

startButton?.addEventListener('click', function (event) {
  if (gameHasStarted === false) {
    generateArray();
    createCards(finalCards);
  }
  saveSettings();
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

//------Flip a card face-up-----

function flipCard(card) {
  let color = card.classList.value;
  card.style.backgroundColor = color;
  removeListener(card);
  attempts++;

  // @ts-ignore
  attemptsCounter.innerText = attempts;
}

//------Flip a card face-down------

function unFlipCards(card1, card2) {
  let cards = [card1, card2];
  for (let card of cards) {
    card.style.backgroundColor = 'transparent';
    addListener(card);
    okToFlip = true;
  }
  firstFlip = '';
  secondFlip = '';
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
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

      // check if match:

      if (color1 === color2) {
        firstFlip = '';
        secondFlip = '';
        matchCount++;

        // check if game-over

        if (maxMatches === matchCount) {
          // @ts-ignore
          showRestartButton();

          // Update Lowest-Score Locally and display on HTML
          if (lowScoreLocal === null) {
            updateLocalLowScore();
            updateHTMLLowScore(attempts.toString());
          } else {
            if (+lowScoreLocal > attempts) {
              alert('Congrats! That was the fewest cilcks yet!');
              updateLocalLowScore();
              updateHTMLLowScore(attempts.toString());

              attempts = 0;
            }
          }
        }
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
// let newGame = document.createElement('div');

// let oldGame = document.getElementById('game');
// let body = document.querySelector('body');
// restartButton?.addEventListener('click', function () {
//   const footer = document.querySelector('footer');
//   body?.removeChild(oldGame);
//   newGame.setAttribute('id', 'game');
//   body?.insertBefore(newGame, footer);
//   createCards(colors);
//   gameHasStarted = true;
// });
restartButton?.addEventListener('click', function () {
  location.reload();
});

resetScoreButton?.addEventListener('click', () => {
  localStorage.clear();
  updateHTMLLowScore('n/a');
  updateHTMLSliderVal(10);
  updateHTMLRadioVal();
});

function saveSettings() {
  localStorage.setItem('cardCount', cardCount);
  setLocalRandomColor();
  updateHTMLSliderVal();
}
//  Save score  ----------------

// if ('lowestScore' in localStorage){
//   let lowestScore = Number(localStorage.getItem('lowestScore'))
//   if (attempts < lowestScore)
//   localStorage.clear();
//   localStorage.setItem('lowestScore' = attempts.toString()
// }

const flipEm = document.getElementById('flipAllCards');
flipEm?.addEventListener('click', function () {
  let allCards = document.querySelectorAll('#game > div');
  for (let card of allCards) {
    card.style.backgroundColor = card.classList.value;
  }
  showRestartButton();
});

function showRestartButton() {
  restartButton.style.display = 'block';
}
