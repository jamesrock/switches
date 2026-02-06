import './app.css';

const app = document.querySelector('#app');
const MIN = 1;
const MAX = 7;
const COUNT = 4;
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
  display.innerText = formatNumber(target.value-getTotal());
};

const getMultipliers = () => {
  const bob = [];
  sliders.forEach(() => {
    bob.push(random(1, 500));
  });
  return bob;
};

const generateTarget = () => {
  let value = 0;
  const values = [];
  sliders.forEach((slider, index) => {
    values.push(getRandom());
    value += values[values.length-1] * multipliers[index];
  });
  return {
    value,
    values
  };
};

const getTotal = () => {
  let bob = 0;
  sliders.forEach((slider, index) => {
    bob += slider.value * multipliers[index];
  });
  return bob;
};

const sliders = Array.from({length: COUNT}).map(() => createSlider());
const multipliers = getMultipliers();
const target = generateTarget();
console.log(multipliers);
console.log(target);

const board = createContainer('board');
app.appendChild(board);

const display = createContainer('display');
display.innerText = 0;
board.appendChild(display);

const holder = createContainer('holder');
board.appendChild(holder);

sliders.forEach((slider) => {
  holder.appendChild(slider);
  slider.value = getRandom();
  slider.addEventListener('input', () => {
    renderTotal();
  });
});

renderTotal();
