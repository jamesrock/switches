import '/css/app.css';
import {
  DisplayObject,
  setDocumentHeight,
  formatTime,
  shuffle,
  formatNumber,
  pluckRandom,
  random,
  makeContainer,
  makeNode,
  makeArray
} from '@jamesrock/rockjs';
import interact from 'interactjs';

setDocumentHeight();

const app = document.querySelector('#app');
const COUNT = 9;
const yGap = 5;
const xGap = 5;
const itemSize = 50;

const makeIndex = (items, key = 'id') => {
  const out = {};
  items.forEach((item) => {
    out[item[key]] = item;
  });
  return out;
};

const xPositions = [0, 1, 2, 0, 1, 2, 0, 1, 2].map((index) => {
  return (index * (itemSize + xGap));
});

const yPositions = [0, 0, 0, 1, 1, 1, 2, 2, 2].map((index) => {
  return (index * (itemSize + yGap));
});

const positions = makeArray(COUNT).map((index) => {
  return [xPositions[index], yPositions[index]];
});

class Item extends DisplayObject {
  constructor(id, weight) {

    super();

    this.id = id;
    this.weight = weight;
    this.node = makeNode('div', 'item');

    this.resetPosition();
    this.setProp('id', this.id);

  };
  setDropped(a) {

    this.dropped = a;
    this.setProp('dropped', this.dropped);
    return this;

  };
  resetPosition() {

    console.log('resetPosition');

    const [x, y] = positions[this.id];

    this.setPosition(x, y);
    return this;

  };
  setChecked(a) {

    this.checked = a;
    return this;

  };
  setPosition(x, y) {

    this.node.style.left = `${x}px`;
    this.node.style.top = `${y}px`;
    return this;

  };
  dropped = false;
  checked = false;
};

const renderTotal = () => {
  const total = settings.value-getTotal();
  if(total===0) {
    setTimeout(() => {
      showGameOverScreen();
    }, 500);
  };
  display.innerHTML = `<div class="display-inner"><span class="sign">${total===0 ? '&nbsp;' : (total<0 ? '&#9650;' : '&#9660;')}</span><span>${formatNumber(total<0 ? total*-1 : total)}</span><span class="unit">kg</span></div>`;
};

const showGameOverScreen = () => {
  items.forEach((s) => {
    s.disabled = true;
  });
  const duration = (Date.now() - time);
  gameOver.innerHTML = `\
    <h2>Solved!</h2>\
    <div class="stats">\
      <p class="time">Time: ${formatTime(duration)}</p>\
      <p class="moves">Moves: ${moves}</p>\
    </div>\
    <p class="continue">Tap to continue</p>`;
  gameOver.dataset.active = true;
};

const getMultipliers = () => {
  const multipliers = [];
  makeArray(COUNT).forEach((s, index) => {
    multipliers.push(random((index)*10+1, ((index)*10)+10));
  });
  return shuffle(multipliers);
};

const getValues = () => {
  const values = makeArray(COUNT, () => 0);
  const bob = makeArray(COUNT);
  makeArray(random(2, 8)).forEach(() => {
    values[pluckRandom(bob)] = 1;
  });
  return values;
};

const generateSettings = () => {
  let value = 0;
  const values = getValues();
  const multipliers = getMultipliers();
  makeArray(COUNT).forEach((s, index) => {
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
  items.forEach((item) => {
    bob += ((item.checked ? 1 : 0) * item.weight);
  });
  return bob;
};

let items = null;
let itemMap = null;
let settings = null;
let moves = 0;
let time = null;

const board = makeContainer('board');
app.appendChild(board);

const display = makeContainer('display');
display.innerText = 0;

const tray = makeContainer('tray');
board.appendChild(tray);

tray.style.width = tray.style.height = `${itemSize * 3 + (xGap * 2)}px`;

const scales = makeContainer('scales');
const platform = makeContainer('platform');
scales.appendChild(display);
scales.appendChild(platform);
board.appendChild(scales);

const gameOver = makeContainer('game-over');
gameOver.dataset.active = false;
board.appendChild(gameOver);

const newGame = () => {

  if(false) {
    items.forEach((item) => {
      item.destroy();
    });
  };

  settings = generateSettings();

  items = makeArray(COUNT, (a, id) => new Item(id, settings.multipliers[id]));
  itemMap = makeIndex(items);

  console.log(items);
  console.log(settings);

  items.forEach((item) => {
    item.appendTo(tray);
  });

  gameOver.dataset.active = false;

  moves = 0;
  time = Date.now();

  renderTotal();

};

gameOver.addEventListener('click', () => {
  newGame();
});

newGame();

let position = null;
let group = null;

interact('.item').draggable({
	listeners: {
		start(event) {

      position = { x: event.target.offsetLeft, y: event.target.offsetTop };

      group = [itemMap[event.target.dataset.id]];
      console.log(group);

			group.forEach((item, index) => {
        item.setDropped(false);
			});

		},
    move(event) {

			position.x += event.dx;
			position.y += event.dy;
			group.forEach((item, index) => {
				item.setPosition((position.x), (position.y));
      });

		},
	}
});

interact('.platform').dropzone({
	accept: '.item',
	ondrop: (event) => {

    group.forEach((item) => {
      item.setDropped(true).setChecked(true);
    });

    moves ++;
    renderTotal();

	}
});

interact('body').dropzone({
	accept: '.item',
	ondrop: (event) => {

    group.forEach((item) => {
      item.setDropped(true).setChecked(false).resetPosition();
    });

    moves ++;
    renderTotal();

	}
});
