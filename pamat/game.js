document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const elements = {
        board: document.getElementById('board'),
        level: document.getElementById('level'),
        theme: document.getElementById('theme'),
        time: document.getElementById('time'),
        moves: document.getElementById('moves'),
        progress: document.getElementById('progress'),
        restart: document.getElementById('restart'),
        levelUp: document.getElementById('levelUp'),
        newLevel: document.getElementById('newLevel'),
        bonus: document.getElementById('bonus'),
        totalScore: document.getElementById('totalScore'),
        nextLevelBtn: document.getElementById('nextLevelBtn'),
        score: document.getElementById('score'),
        finalScreen: document.getElementById('finalScreen'),
        finalScore: document.getElementById('finalScore'),
        playAgain: document.getElementById('playAgain'),
        nextLevelCharacter: document.getElementById('nextLevelCharacter'),
        nextLevelTitle: document.getElementById('nextLevelTitle'),
        nextLevelPhrase: document.getElementById('nextLevelPhrase'),
        nextLevelFacts: document.getElementById('nextLevelFacts'),
        timeOverOverlay: document.getElementById('timeOverOverlay'),
        finalTimeScore: document.getElementById('finalTimeScore'),
        timeOverRestart: document.getElementById('timeOverRestart'),
        introOverlay: document.getElementById('introOverlay'), // Оверлей
        introContent: document.querySelector('.intro-content'), // Контент оверлея
        startGameBtn: document.getElementById('startGameBtn'),
    };
  
    // Проверка существования элементов
    for (const key in elements) {
        if (!elements[key]) {
            console.error(`Element ${key} not found!`);
        }
    }
  
    // Настройки уровней
    const levels = [
        { pairs: 6, time: 90, grid: 4, theme: "Berries", description: "Найди одинаковые ягоды!", images: ['golubica.png', 'cherry.png', 'arbus.png', 'grape.png', 'strawberry.png', 'blueberry.png'] },
        { pairs: 6, time: 80, grid: 4, theme: "Transport", description: "Найди одинаковый транспорт!", images: ['bus.png', 'train.png', 'airplane.png', 'ship.png', 'bicycle.png', 'motorcycle.png'] },
        { pairs: 6, time: 70, grid: 4, theme: "Professions", description: "Найди одинаковые профессии!", images: ['it.png', 'doctor.png', 'sud.png', 'firefighter.png','clown.png', 'astronaut.png'] },
        { pairs: 6, time: 65, grid: 4, theme: "Animals", description: "Найди одинаковых животных!", images: ['lion.png', 'gorilla.png', 'kangaroo.png', 'rhino.png', 'tiger.png', 'wolf.png'] },
        { pairs: 6, time: 60, grid: 4, theme: "Musical instruments", description: "Найди одинаковые инструменты!", images: ['guitar.png', 'piano.png', 'accordion.png', 'harp.png', 'maracas.png', 'xylophone.png'] },
        { pairs: 6, time: 55, grid: 4, theme: "Clothes", description: "Найди одинаковую одежду!", images: ['t-shirt.png', 'jeans.png','dress.png','shorts.png','socks.png','tie.png'] },
        { pairs: 6, time: 50, grid: 4, theme: "Mythology", description: "Найди одинаковых мифических существ!", images: ['yeti.png', 'centaur.png', 'ogre.png', 'werewolf.png', 'vampire.png', 'fairy.png'] },
        { pairs: 6, time: 45, grid: 4, theme: "Sea", description: "Найди одинаковых морских обитателей!", images: ['shark.png', 'octopus.png','jellyfish.png', 'seal.png', 'squid.png', 'anglerfish.png'] },
        { pairs: 6, time: 40, grid: 4, theme: "Weather events", description: "Найди одинаковые погодные явления!", images: ['lightning.png', 'tornado.png','hot.png', 'frost.png','hail.png', 'wind.png'] },
        { pairs: 6, time: 35, grid: 4, theme: "Space", description: "Найди одинаковые космические объекты!", images: ['alien.png','saturn.png','rocket.png','meteor.png','space3.png', 'rover.png'] }
    ];
  
    const levelsData = [
      {
          title: "Транспорт",
          character: "catcar",
          image: "character/catcar.png",
          phrase: "Врум-врум! Красный свет — стой, зёленый — катайся как я! Самый быстрый поезд разгоняется до 600 км/ч!",
          facts: [
              "Первый автомобиль ехал медленнее велосипеда (16 км/ч)",
              "Корабли держатся на воде благодаря закону Архимеда",
              "Воздушные шары летают, потому что горячий воздух легче холодного"
          ]
      },
      {
          title: "Профессии",
          character: "dog",
          image: "character/dog.png",
          phrase: "Гав-гав! Я раскрываю все тайны! Полицейские учатся 5 лет, а пожарные надевают костюм за 60 секунд!",
          facts: [
              "Врачи древности использовали пиявок для лечения",
              "Учителя в Японии работают 10 часов в день",
              "Космонавты перед полётом год тренируются в бассейне"
          ]
      },
      {
          title: "Животные",
          character: "rabbit",
          image: "character/rabbit.png",
          phrase: "Прыг-скок! Удивительный мир зверей — у улитки 14 000 зубов, а летучие мыши умеют видеть ушами!",
          facts: [
              "У осьминога 3 сердца",
              "Акула меняет зубы всю жизнь",
              "Кенгуру не умеют ходить назад"
          ]
      },
      {
          title: "Музыкальные инструменты",
          character: "catplane",
          image: "character/catplane.png",
          phrase: "Высота музыки — 10 000 метров! Арфе 5000 лет, а саксофон изобрели всего 180 лет назад!",
          facts: [
              "Скрипку делают из 70 деревянных деталей",
              "Барабанная дробь активирует оба полушария мозга",
              "Пианино настраивают 2 раза в год даже если на нём не играют"
          ]
      },
      {
          title: "Одежда",
          character: "dog",
          image: "character/dog.png",
          phrase: "Гав! У меня коллекция косточек и костюмов! Первые джинсы шили из парусины, а пуговицы придумал Наполеон!",
          facts: [
              "Шерстяные вещи греют даже мокрыми",
              "Один свитер = шерсть 4 овец",
              "Галстуки придумали хорваты"
          ]
      },
      {
          title: "Мифология",
          character: "rabbit",
          image: "character/rabbit.png",
          phrase: "Прыг-скок! В древности верили, что мир держится на черепахе! А Пегас родился из крови Медузы!",
          facts: [
              "Минотавр жил в лабиринте на Крите",
              "У Медузы были змеи вместо волос",
              "Пегас родился из крови Медузы"
          ]
      },
      {
          title: "Морские обитатели",
          character: "enot",
          image: "character/enot.png",
          phrase: "Ш-ш-ш! Морские секреты! Осьминоги имеют 3 сердца, а медузы на 95% состоят из воды — почти как мои ягоды!",
          facts: [
              "Сердце креветки расположено в голове",
              "Дельфины спят с одним открытым глазом",
              "Морские звёзды могут отращивать потерянные лучи"
          ]
      },
      {
          title: "Погодные явления",
          character: "catcar",
          image: "character/catcar.png",
          phrase: "Дворники работают — значит будет дождь! Радуга — это солнечный свет, разбитый на 7 цветов каплями воды!",
          facts: [
              "Гром гремит после молнии потому что свет быстрее звука",
              "Снежинки всегда имеют 6 лучей",
              "Роса появляется когда тёплый воздух встречается с холодным"
          ]
      },
      {
          title: "Космос",
          character: "humster",
          image: "character/humster.png",
          phrase: "Мои щёчки — чемодан для звёзд! На Юпитере бушует шторм размером с 3 Земли, а у Сатурна ледяные кольца!",
          facts: [
              "Венера вращается в обратную сторону",
              "Марс имеет гору Олимп высотой 27 км",
              "Плутон меньше Луны в 6 раз"
          ]
      }
  ];
  
    // Игровые переменные
    const gameState = {
      currentLevel: 0,
      score: 0,
      timeLeft: 0,
      maxTime: 0,
      flips: 0,
      matchedCards: 0,
      disableDeck: false,
      cardOne: null,
      cardTwo: null,
      timer: null,
      canFlip: true
    };
  
    // Запуск уровня игры
    function launchGameLevel(levelIndex) {
      if (levelIndex >= levels.length) {
          gameComplete();
          return;
      }
  
      const level = levels[levelIndex];
      gameState.timeLeft = level.time;
      gameState.maxTime = level.time;
      gameState.flips = 0;
      gameState.matchedCards = 0;
      gameState.disableDeck = false;
      gameState.cardOne = null;
      gameState.cardTwo = null;
      gameState.canFlip = true;
  
      clearInterval(gameState.timer);
  
      elements.level.textContent = gameState.currentLevel + 1;
      elements.theme.textContent = `${level.theme} (${level.description})`;
      elements.time.textContent = gameState.timeLeft;
      elements.moves.textContent = gameState.flips;
      elements.progress.style.width = '100%';
      elements.score.textContent = gameState.score;
      
      if (elements.levelUp) elements.levelUp.classList.add("hidden");
      if (elements.timeOverOverlay) elements.timeOverOverlay.classList.add("hidden");
  
      generateCards(level);
      initTimer();
    }
  
    // Генерация карт
    function generateCards(level) {
        if (!elements.board) return;
        
        elements.board.innerHTML = '';
        elements.board.className = 'game-board';
        elements.board.style.gridTemplateColumns = `repeat(${level.grid}, 1fr)`;
  
        const cards = [];
        level.images.forEach((img, index) => {
            cards.push({img, index});
            cards.push({img, index});
        });
  
        // Перемешивание карт
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
  
        cards.forEach((card, i) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = card.index;
            cardElement.dataset.img = card.img;
  
            cardElement.innerHTML = `
                <div class="front">
                    <img src="que_icon.svg" alt="Card back">
                </div>
                <div class="back">
                    <img src="images/${level.theme}/${card.img}" alt="${card.img.split('.')[0]}" loading="lazy">
                </div>
            `;
  
            cardElement.addEventListener('click', flipCard);
            elements.board.appendChild(cardElement);
        });
    }
  
    // Переворот карты
    function flipCard() {
        if (!gameState.canFlip || gameState.disableDeck || this.classList.contains('flip')) return;
  
        this.classList.add('flip');
  
        if (!gameState.cardOne) {
            gameState.cardOne = this;
            return;
        }
  
        gameState.cardTwo = this;
        gameState.flips++;
        if (elements.moves) elements.moves.textContent = gameState.flips;
        gameState.disableDeck = true;
  
        checkForMatch();
    }
  
    // Проверка на совпадение
    function checkForMatch() {
        const isMatch = gameState.cardOne.dataset.index === gameState.cardTwo.dataset.index;
  
        if (isMatch) {
            gameState.cardOne.style.boxShadow = '0 0 20px #7e57c2';
            gameState.cardTwo.style.boxShadow = '0 0 20px #7e57c2';
  
            gameState.matchedCards += 2;
            gameState.score += 50 + (gameState.currentLevel * 20);
            if (elements.score) elements.score.textContent = gameState.score;
  
            gameState.cardOne.removeEventListener('click', flipCard);
            gameState.cardTwo.removeEventListener('click', flipCard);
  
            if (gameState.matchedCards === levels[gameState.currentLevel].pairs * 2) {
                setTimeout(() => {
                    levelComplete();
                }, 500);
            }
  
            resetCards();
        } else {
            gameState.cardOne.style.boxShadow = '0 0 20px #ff5252';
            gameState.cardTwo.style.boxShadow = '0 0 20px #ff5252';
  
            gameState.canFlip = false;
            setTimeout(() => {
                gameState.cardOne.classList.remove('flip');
                gameState.cardTwo.classList.remove('flip');
                gameState.cardOne.style.boxShadow = '';
                gameState.cardTwo.style.boxShadow = '';
                resetCards();
                gameState.canFlip = true;
            }, 1000);
        }
    }
  
    // Сброс выбранных карт
    function resetCards() {
        gameState.cardOne = null;
        gameState.cardTwo = null;
        gameState.disableDeck = false;
    }
  
    // Инициализация таймера
    function initTimer() {
      clearInterval(gameState.timer);
      
      gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        if (elements.time) elements.time.textContent = gameState.timeLeft;
        if (elements.progress) elements.progress.style.width = `${(gameState.timeLeft / gameState.maxTime) * 100}%`;
  
        if (gameState.timeLeft <= 0) {
          clearInterval(gameState.timer);
          gameOver();
        }
      }, 1000);
    }
  
    // Уровень завершен
    function levelComplete() {
      clearInterval(gameState.timer);
      const bonus = Math.floor(gameState.timeLeft * (1 + gameState.currentLevel * 0.3));
      gameState.score += bonus;
  
      if (elements.newLevel) elements.newLevel.textContent = gameState.currentLevel + 2;
      if (elements.bonus) elements.bonus.textContent = `+${bonus}`;
      if (elements.totalScore) elements.totalScore.textContent = gameState.score;
  
      if (gameState.currentLevel < levels.length - 1) {
        const nextLevelData = levelsData[gameState.currentLevel + 1];
        if (elements.nextLevelCharacter) elements.nextLevelCharacter.src = nextLevelData.image;
        if (elements.nextLevelTitle) elements.nextLevelTitle.textContent = `УРОВЕНЬ ${gameState.currentLevel + 2}: ${nextLevelData.title.toUpperCase()}`;
        if (elements.nextLevelPhrase) elements.nextLevelPhrase.textContent = nextLevelData.phrase;
        
        if (elements.nextLevelFacts) {
          elements.nextLevelFacts.innerHTML = "";
          nextLevelData.facts.forEach(fact => {
            const li = document.createElement("li");
            li.textContent = fact;
            elements.nextLevelFacts.appendChild(li);
          });
        }
  
        if (elements.levelUp) elements.levelUp.classList.remove("hidden");
      } else {
        gameComplete();
      }
    }
  
    // Игра завершена
    function gameComplete() {
      if (elements.finalScore) {
          elements.finalScore.textContent = `Вы прошли все ${levels.length} уровней с результатом ${gameState.score} очков!`;
      }
      if (elements.finalScreen) {
          elements.finalScreen.style.display = 'flex';
      }
    }
  
    // Конец игры (время вышло)
    function gameOver() {
      clearInterval(gameState.timer);
      
      if (elements.finalTimeScore) elements.finalTimeScore.textContent = gameState.score;
      if (elements.timeOverOverlay) elements.timeOverOverlay.classList.remove('hidden');
    }
  
    // Переход на следующий уровень
    function nextLevel() {
      gameState.currentLevel++;
      if (elements.levelUp) elements.levelUp.classList.add("hidden");
      launchGameLevel(gameState.currentLevel);
    }
  
    // Инициализация игры
    function initGame() {
        gameState.currentLevel = 0;
        gameState.score = 0;
        if (elements.finalScreen) elements.finalScreen.style.display = 'none';
        if (elements.timeOverOverlay) elements.timeOverOverlay.classList.add('hidden');
        if (elements.introOverlay) elements.introOverlay.classList.add('hidden'); // Добавьте эту строку
        launchGameLevel(gameState.currentLevel);
    }
  
    // Обработчики событий
    if (elements.restart) elements.restart.addEventListener('click', initGame);
    if (elements.nextLevelBtn) elements.nextLevelBtn.addEventListener('click', nextLevel);
    if (elements.playAgain) elements.playAgain.addEventListener('click', initGame);
    if (elements.timeOverRestart) elements.timeOverRestart.addEventListener('click', initGame);
    if (elements.startGameBtn) {
        elements.startGameBtn.addEventListener('click', () => {
            if (elements.introOverlay) {
                elements.introOverlay.classList.add('hidden');
            }
            initGame();
        });
    };
});  
  