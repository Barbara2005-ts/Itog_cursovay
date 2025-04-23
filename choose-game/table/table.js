const allItems = ['abc-block', 'cat-toy', 'dice', 'dog-balloon', 'doll', 'duck', 'helicopter-toy', 'pinwheel', 'piramida', 'psp', 'rattle', 'robot', 'rocking-horse', 'sailboat', 'snakes-and-ladders', 'soldier', 'spinning-top', 'tamagotchi', 'tank-toy', 'teddy-bear', 'toy-car', 'toy-rocket', 'train-toy', 'water-gun', 'yoyo'];

let currentItems = [];
let missingItem = '';
let score = 0;
let level = 1;
const maxLevel = 10;
let timerInterval;
let isMemorizingPhase = true;

// Supabase клиент (добавьте свои данные)
const supabaseUrl = 'https://rjhqvhwlwdhpbrtytxxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHF2aHdsd2RocGJydHl0eHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjkwNjMsImV4cCI6MjA2MDg0NTA2M30.UuSxSWlp8VSyUyEsGFNkPQm3n2mqRw_hw7kDdz_DqSg';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let userId = null;

async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        userId = user.id;
    }
}

getCurrentUser();

// Элементы интерфейса
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const startOverlay = document.getElementById('overlay');
const startButton = document.getElementById('start-button');

const nextOverlay = document.getElementById('next-overlay');
const finalOverlay = document.getElementById('final-overlay');
const finalScoreDisplay = document.getElementById('final-score');
const finalLevelDisplay = document.getElementById('final-level');

// Кнопки
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

  // Настройка сложности
  const itemsCount = Math.min(3 + Math.floor(level / 2), 6);
  currentItems = [];
  while (currentItems.length < itemsCount) {
    const item = allItems[Math.floor(Math.random() * allItems.length)];
    if (!currentItems.includes(item)) {
      currentItems.push(item);
    }
  }

  missingItem = currentItems[Math.floor(Math.random() * currentItems.length)];

  // Отображение предметов
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
  let timeLeft = Math.max(5, 8 - Math.floor(level / 3));
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
    btn.addEventListener('click', () => handleGuess(option));
    guessContainer.appendChild(btn);
  });

  gameBoard.insertAdjacentElement('afterend', guessContainer);
  message.style.marginTop = '20px';
}

async function handleGuess(option) {
  const isCorrect = option === missingItem;
  const pointsEarned = level * 10; // Бонус за уровень

  if (isCorrect) {
    score += pointsEarned;
    message.textContent = `Правильно! +${pointsEarned} очков`;
    scoreDisplay.textContent = score;
  } else {
    message.innerHTML = `Неправильно! Пропал: <img src="items/${missingItem}.png" class="missing-item-img">`;
  }

  // Блокировка кнопок
  document.querySelectorAll('.guess-button').forEach(btn => {
    btn.disabled = true;
  });

  setTimeout(() => {
    const guessContainer = document.getElementById('guess-container');
    if (guessContainer) guessContainer.remove();

    message.style.marginTop = '0';

    if (level >= maxLevel) {
      if (finalScoreDisplay && finalLevelDisplay) {
        finalScoreDisplay.textContent = score;
        finalLevelDisplay.textContent = level;
      }
      finalOverlay.style.display = 'flex';

      // Сохранение статистики в Supabase
      if (userId) {
        saveStats();
      }
    } else {
      nextOverlay.style.display = 'flex';
    }
  }, 2000);
}

async function saveStats() {
  try {
    const { data: existingStats, error } = await supabaseClient
      .from('stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingStats) {
      const updatedPoints = existingStats.total_points + score;
      const updatedLevels = existingStats.total_levels + level;

      await supabaseClient
        .from('stats')
        .update({
          total_points: updatedPoints,
          total_levels: updatedLevels,
          lost_points: existingStats.lost_points + score,
          lost_levels: existingStats.lost_levels + level
        })
        .eq('user_id', userId);
    } else {
      // Создаем новую запись, если статистики нет
      await supabaseClient
        .from('stats')
        .insert({
          user_id: userId,
          total_points: score,
          total_levels: level,
          lost_points: score,
          lost_levels: level
        });
    }
  } catch (err) {
    console.error('Ошибка при сохранении статистики:', err);
  }
}
