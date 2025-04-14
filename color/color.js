document.addEventListener('DOMContentLoaded', () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let score = 0;
    let gameStarted = false;
    let acceptingInput = false;

    // Элементы интерфейса
    const elements = {
        startGameBtn: document.getElementById('startGameBtn'),
        levelDisplay: document.getElementById('level'),
        scoreDisplay: document.getElementById('score'),
        messageEl: document.getElementById('message'),
        levelUpOverlay: document.getElementById('levelUp'),
        gameOverOverlay: document.getElementById('gameOverOverlay'),
        introOverlay: document.getElementById('introOverlay'),
        newLevelDisplay: document.getElementById('newLevel'),
        bonusDisplay: document.getElementById('bonus'),
        totalScoreDisplay: document.getElementById('totalScore'),
        finalLevelDisplay: document.getElementById('finalLevel'),
        finalScoreDisplay: document.getElementById('finalScore'),
        continueBtn: document.getElementById('continueBtn'),
        restartGameBtn: document.getElementById('restartGameBtn') // Кнопка "ИГРАТЬ СНОВА"
    };

    // Инициализация игры
    function init() {
        // Скрываем основной контейнер игры до начала
        document.getElementById('gameContainer').style.display = 'none';

        // Назначаем обработчик кнопки "НАЧАТЬ ИГРУ"
        elements.startGameBtn.addEventListener('click', startGame);

        // Назначаем обработчик для кнопки продолжения после уровня
        elements.continueBtn.addEventListener('click', continueGame);

        // Назначаем обработчик для кнопки "ИГРАТЬ СНОВА"
        elements.restartGameBtn.addEventListener('click', restartGame);

        // Скрываем все оверлеи на старте
        elements.levelUpOverlay.style.display = 'none';
        elements.gameOverOverlay.style.display = 'none';

        // Назначаем обработчики событий для кнопок цветов
        colors.forEach(color => {
            const btn = document.getElementById(color);
            btn.addEventListener('click', () => handleColorClick(color));
        });
    }

    // Начало игры
    function startGame() {
        gameStarted = true;
        sequence = [];
        playerSequence = [];
        level = 1;
        score = 0;

        // Прячем оверлей начала игры и показываем контейнер игры
        elements.introOverlay.style.display = 'none'; // скрываем приветственный оверлей
        document.getElementById('gameContainer').style.display = 'block'; // показываем основной контейнер игры

        // Обновляем интерфейс
        updateDisplay();

        // Добавляем первый цвет в последовательность
        addToSequence();
        playSequence();
    }

    // Обновление интерфейса
    function updateDisplay() {
        elements.levelDisplay.textContent = level;
        elements.scoreDisplay.textContent = score;
    }

    // Блокировка кнопок
    function blockButtons() {
        colors.forEach(color => {
            document.getElementById(color).classList.add('disabled-btn');
        });
    }

    // Разблокировка кнопок
    function unblockButtons() {
        colors.forEach(color => {
            document.getElementById(color).classList.remove('disabled-btn');
        });
    }

    // Добавление цвета в последовательность
    function addToSequence() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
    }

    // Воспроизведение последовательности
    function playSequence() {
        acceptingInput = false;
        blockButtons();

        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    unblockButtons();
                    acceptingInput = true;
                }, 500);
                return;
            }

            const color = sequence[i];
            highlightButton(color);
            i++;
        }, 800);
    }

    // Подсветка кнопки
    function highlightButton(color) {
        const btn = document.getElementById(color);
        btn.classList.add('highlight');

        setTimeout(() => {
            btn.classList.remove('highlight');
        }, 300);
    }

    // Обработка клика по цвету
    function handleColorClick(color) {
        if (!gameStarted || !acceptingInput) return;

        highlightButton(color);
        playerSequence.push(color);

        // Проверяем, совпадает ли последовательность
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            gameOver();
            return;
        }

        if (playerSequence.length === sequence.length) {
            levelComplete();
        }
    }

    // Завершение уровня
    function levelComplete() {
        score += level * 15;
        updateDisplay();
        acceptingInput = false;
        blockButtons();

        // Показываем оверлей завершения уровня
        elements.newLevelDisplay.textContent = level + 1;
        elements.bonusDisplay.textContent = `+${level * 15}`;
        elements.totalScoreDisplay.textContent = score;
        elements.levelUpOverlay.style.display = 'flex'; // Центрируем оверлей
    }

    // Продолжение игры после уровня
    function continueGame() {
        level++;
        playerSequence = [];
        acceptingInput = false;
        elements.levelUpOverlay.style.display = 'none';

        updateDisplay();
        addToSequence();
        playSequence();
    }

    // Конец игры
    function gameOver() {
        acceptingInput = false;
        blockButtons();

        // Показываем оверлей конца игры
        elements.finalLevelDisplay.textContent = level;
        elements.finalScoreDisplay.textContent = score;
        elements.gameOverOverlay.style.display = 'flex'; // Центрируем оверлей
    }

    // Перезапуск игры
    function restartGame() {
        // Скрыть оверлей окончания игры
        elements.gameOverOverlay.style.display = 'none';
        
        // Скрыть другие оверлеи
        elements.levelUpOverlay.style.display = 'none';
        
        // Сброс состояния игры
        gameStarted = false;
        sequence = [];
        playerSequence = [];
        level = 1;
        score = 0;
        
        // Прячем основной контейнер игры, чтобы сразу начать
        document.getElementById('gameContainer').style.display = 'none';
        
        // Показываем оверлей с приветствием
        elements.introOverlay.style.display = 'block';

        // Начинаем игру с первого уровня
        startGame();
    }

    // Запускаем инициализацию
    init();
});
