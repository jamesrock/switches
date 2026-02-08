import './app.css';

const app = document.querySelector('#app');
const COUNT = 9;
const random = (min, max) => (Math.floor(Math.random()*((max-min)+1))+min);
const pluckRandom = (a) => (a.splice(random(0, a.length-1), 1)[0]);
const formatter = new Intl.NumberFormat('en-GB');
const formatNumber = (n) => formatter.format(n);
const shuffle = (array) => {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
  return array;
};

const createSwitch = () => {
  const node = document.createElement('input');
  node.type = 'checkbox';
  return node;
};

const createContainer = (label = '{label}') => {
  const node = document.createElement('div');
  node.classList.add(label);
  return node;
};

const renderTotal = () => {
  const total = settings.value-getTotal();
  if(total===0) {
    switches.forEach((s) => {
      s.disabled = true;
    });
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
  const values = Array.from({length: COUNT}).map(() => 0);
  const bob = Array.from({length: COUNT}).map((a, index) => index);
  Array.from({length: random(2, 8)}).forEach(() => {
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

const switches = Array.from({length: COUNT}).map(() => createSwitch());
let settings = null;

const board = createContainer('board');
app.appendChild(board);

const teller = createContainer('teller');
board.appendChild(teller);

const display = createContainer('display');
display.innerText = 0;
board.appendChild(display);

const holder = createContainer('holder');
board.appendChild(holder);

const gameOver = createContainer('game-over');
gameOver.dataset.active = false;
gameOver.innerHTML = `<h2>Well done!</h2><p>Tap to start new game.</p>`;
board.appendChild(gameOver);

const newGame = () => {
  
  settings = generateSettings();

  teller.innerText = JSON.stringify(settings.values);

  console.log(settings);

  switches.forEach((s) => {
    s.checked = false;
    s.disabled = false;
  });

  gameOver.dataset.active = false;
  
  renderTotal();

};

switches.forEach((slider, index) => {
  holder.appendChild(slider);
  slider.addEventListener('input', () => {
    renderTotal();
  });
});

gameOver.addEventListener('click', () => {
  newGame();
});

newGame();
