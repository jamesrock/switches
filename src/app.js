import './app.css';

const app = document.querySelector('#app');
const MIN = 1;
const MAX = 10;
const COUNT = 5;
const random = (min, max) => (Math.floor(Math.random()*((max-min)+1))+min);
const getRandom = () => random(MIN, MAX);
const formatter = new Intl.NumberFormat('en-GB');
const formatNumber = (n) => formatter.format(n);

const createSlider = () => {
  const node = document.createElement('input');
  node.type = 'range';
  node.min = MIN;
  node.max = MAX;
  node.step = 1;
  node.value = 4;
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
    sliders.forEach((slider) => {
      slider.disabled = true;
    });
    setTimeout(() => {
      gameOver.dataset.active = true;
    }, 500);
  };
  display.innerText = formatNumber(total);
};

const generateSettings = () => {
  let value = 0;
  const values = [];
  const multipliers = [];
  const setters = [];
  sliders.forEach((slider, index) => {
    multipliers.push(random((index)*10+1, ((index)*10)+10));
    values.push(getRandom());
    setters.push(getRandom());
    value += (values[index] * multipliers[index]);
  });
  return {
    value,
    values,
    multipliers,
    setters
  };
};

const getTotal = () => {
  let bob = 0;
  sliders.forEach((slider, index) => {
    bob += (slider.value * settings.multipliers[index]);
  });
  return bob;
};

const getTotalTest = (values) => {
  let bob = 0;
  values.forEach((value, index) => {
    bob += (value * settings.multipliers[index]);
  });
  return bob;
};

const sliders = Array.from({length: COUNT}).map(() => createSlider());
let settings = null;

const board = createContainer('board');
app.appendChild(board);

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

  console.log('getTotalTest', getTotalTest([1, 2, 3, 4]));
  console.log('getTotalTest', getTotalTest([4, 3, 2, 1]));
  console.log(settings);

  sliders.forEach((slider, index) => {
    slider.value = settings.setters[index];
    slider.disabled = false;
  });

  gameOver.dataset.active = false;
  
  renderTotal();

};

sliders.forEach((slider, index) => {
  holder.appendChild(slider);
  slider.addEventListener('input', () => {
    renderTotal();
  });
});

gameOver.addEventListener('click', () => {
  newGame();
});

newGame();
