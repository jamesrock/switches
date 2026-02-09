import { 
  formatTime, 
  shuffle, 
  formatNumber, 
  pluckRandom, 
  random,
  createContainer,
  makeArray
} from '@jamesrock/rockjs';
import './app.css';

const app = document.querySelector('#app');
const COUNT = 9;

const createSwitch = () => {
  const node = document.createElement('input');
  node.type = 'checkbox';
  return node;
};

const renderTotal = () => {
  const total = settings.value-getTotal();
  if(total===0) {
    switches.forEach((s) => {
      s.disabled = true;
    });
    const duration = (Date.now() - time);
    gameOver.innerHTML = `\
      <h2>Solved!</h2>\
      <div class="stats">\
        <p class="time">Time: ${formatTime(duration)}</p>\
        <p class="moves">Moves: ${moves}</p>\
      </div>\
      <p class="continue">Tap to continue.</p>`;
    setTimeout(() => {
      gameOver.dataset.active = true;
    }, 500);
  };
  display.innerHTML = `<div class="display-inner"><span class="sign">${total===0 ? '&nbsp;' : (total<0 ? '&#9650;' : '&#9660;')}</span><span>${formatNumber(total<0 ? total*-1 : total)}</span></div>`;
};

const getMultipliers = () => {
  const multipliers = [];
  switches.forEach((s, index) => {
    // console.log((index)*10+1, ((index)*10)+10);
    multipliers.push(random((index)*10+1, ((index)*10)+10));
  });
  return shuffle(multipliers);
};

const getValues = () => {
  const values = makeArray(COUNT, () => 0);
  const bob = makeArray(COUNT, (a, index) => index);
  makeArray(random(2, 8)).forEach(() => {
    values[pluckRandom(bob)] = 1;
  });
  return values;
};

const generateSettings = () => {
  let value = 0;
  const values = getValues();
  const multipliers = getMultipliers();
  switches.forEach((s, index) => {
    value += (values[index] * multipliers[index]);
  });
  return {
    value,
    values,
    multipliers
  };
};

const getTotal = () => {
  let bob = 0;
  switches.forEach((slider, index) => {
    bob += ((slider.checked ? 1 : 0) * settings.multipliers[index]);
  });
  return bob;
};

const switches = makeArray(COUNT, () => createSwitch());
let settings = null;
let moves = 0;
let time = null;

const board = createContainer('board');
app.appendChild(board);

const teller = createContainer('teller');
teller.dataset.active = false;
board.appendChild(teller);

const display = createContainer('display');
display.innerText = 0;
board.appendChild(display);

const holder = createContainer('holder');
board.appendChild(holder);

const gameOver = createContainer('game-over');
gameOver.dataset.active = false;
board.appendChild(gameOver);

const newGame = () => {
  
  settings = generateSettings();

  teller.innerHTML = `<div>${JSON.stringify(settings.values)}</div><div>${JSON.stringify(settings.multipliers)}</div>`;

  console.log(settings);

  switches.forEach((s) => {
    s.checked = false;
    s.disabled = false;
  });

  gameOver.dataset.active = false;

  moves = 0;
  time = Date.now();
  
  renderTotal();

};

switches.forEach((s) => {
  holder.appendChild(s);
});

board.addEventListener('input', () => {
  moves ++;
  renderTotal();
});

gameOver.addEventListener('click', () => {
  newGame();
});

teller.addEventListener('click', () => {
  teller.dataset.active = true;
});

newGame();
