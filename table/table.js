const allItems = ['abc-block', 'cat-toy', 'dice', 'dog-balloon', 'doll', 'duck', 'helicopter-toy', 'pinwheel', 'piramida', 'psp', 'rattle', 'robot', 'rocking-horse', 'sailboat', 'snakes-and-ladders', 'soldier', 'spinning-top', 'tamagotchi', 'tank-toy', 'teddy-bear', 'toy-car', 'toy-rocket', 'train-toy', 'water-gun', 'yoyo'];

let currentItems = [];
let missingItem = '';
let score = 0;
let level = 1;
const maxLevel = 10;
let timerInterval;
let isMemorizingPhase = true;

const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const startOverlay = document.getElementById('overlay');
const startButton = document.getElementById('start-button');

const nextOverlay = document.getElementById('next-overlay');
const finalOverlay = document.getElementById('final-overlay');

// Инициализация игры
startButton.addEventListener('click', () => {
  startOverlay.style.display = 'none';
  startGame();
});

document.getElementById('next-button').addEventListener('click', () => {
  nextOverlay.style.display = 'none';
  level++;
  startGame();
});

document.getElementById('restart-button').addEventListener('click', () => {
  finalOverlay.style.display = 'none';
  level = 1;
  score = 0;
  startGame();
});

function startGame() {
  isMemorizingPhase = true;
  levelDisplay.textContent = level;
  scoreDisplay.textContent = score;
  message.textContent = 'Запомни предметы!';
  message.style.marginTop = '0';
  gameBoard.innerHTML = '';

  // Очищаем предыдущие кнопки выбора
  const oldGuessContainer = document.getElementById('guess-container');
  if (oldGuessContainer) oldGuessContainer.remove();

  // Настройка сложности в зависимости от уровня
  const itemsCount = Math.min(3 + Math.floor(level/2), 6);
  currentItems = [];
  while (currentItems.length < itemsCount) {
    const item = allItems[Math.floor(Math.random() * allItems.length)];
    if (!currentItems.includes(item)) {
      currentItems.push(item);
    }
  }

  missingItem = currentItems[Math.floor(Math.random() * currentItems.length)];

  // Отображение предметов для запоминания
  currentItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    
    const img = document.createElement('img');
    img.src = `items/${item}.png`;
    img.alt = item;
    img.className = 'item-img';
    
    itemElement.appendChild(img);
    gameBoard.appendChild(itemElement);
  });

  // Таймер для фазы запоминания
  let timeLeft = Math.max(5, 8 - Math.floor(level/3));
  timerDisplay.textContent = `${timeLeft}`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (isMemorizingPhase) {
        startGuessingPhase();
      }
    }
  }, 1000);
}

function startGuessingPhase() {
  isMemorizingPhase = false;
  message.textContent = 'Какой предмет пропал?';
  gameBoard.innerHTML = '';

  // Отображение предметов без пропавшего
  const displayItems = currentItems.filter(item => item !== missingItem);
  displayItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    
    const img = document.createElement('img');
    img.src = `items/${item}.png`;
    img.alt = item;
    img.className = 'item-img';
    
    itemElement.appendChild(img);
    gameBoard.appendChild(itemElement);
  });

  showGuessOptions();
}

function showGuessOptions() {
  const guessContainer = document.createElement('div');
  guessContainer.id = 'guess-container';
  
  const options = [missingItem]; // Правильный вариант
  while (options.length < 4) { // 4 варианта ответа
    const option = allItems[Math.floor(Math.random() * allItems.length)];
    if (!options.includes(option) && !currentItems.includes(option)) {
      options.push(option);
    }
  }

  // Перемешивание вариантов
  options.sort(() => Math.random() - 0.5);

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'guess-button';
    
    const img = document.createElement('img');
    img.src = `items/${option}.png`;
    img.alt = option;
    img.className = 'guess-img';
    
    btn.appendChild(img);
    btn.addEventListener('click', handleGuess);
    guessContainer.appendChild(btn);
  });

  // Вставка кнопок после игрового поля, но перед сообщением
  gameBoard.insertAdjacentElement('afterend', guessContainer);
  message.style.marginTop = '20px';
}

function handleGuess(e) {
  const option = e.currentTarget.querySelector('img').alt;
  const isCorrect = option === missingItem;
  
  if (isCorrect) {
    score += 10;
    message.textContent = 'Правильно! +10 очков';
    scoreDisplay.textContent = score;
  } else {
    message.innerHTML = `Неправильно! Пропал: <img src="items/${missingItem}.png" class="missing-item-img">`;
  }

  // Блокировка кнопок после выбора
  document.querySelectorAll('.guess-button').forEach(btn => {
    btn.disabled = true;
  });
  
  // Завершение уровня через 2 секунды
  setTimeout(() => {
    const guessContainer = document.getElementById('guess-container');
    if (guessContainer) guessContainer.remove();
    
    message.style.marginTop = '0';
    
    if (level >= maxLevel) {
      document.getElementById('final-score').textContent = `Ваш счёт: ${score}`;
      finalOverlay.style.display = 'flex';
    } else {
      nextOverlay.style.display = 'flex';
    }
  }, 2000);
}