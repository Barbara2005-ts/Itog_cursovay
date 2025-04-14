const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let gameStarted = false;
let acceptingInput = false;

const startBtn = document.getElementById('startBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const messageEl = document.getElementById('message');

// Блокируем кнопки при загрузке
colors.forEach(color => {
    const btn = document.getElementById(color);
    btn.classList.add('disabled-btn');
    btn.addEventListener('click', () => handleColorClick(color));
});

startBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', nextLevel);

function startGame() {
    gameStarted = true;
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    
    messageEl.classList.add('hidden');
    nextLevelBtn.classList.add('hidden');
    updateDisplay();
    startBtn.classList.add('hidden');
    levelDisplay.parentElement.parentElement.classList.remove('hidden'); // Показываем счетчик
    
    updateDisplay();
    addToSequence();
    playSequence();
}

function blockButtons() {
    colors.forEach(color => {
        document.getElementById(color).classList.add('disabled-btn');
    });
}

function unblockButtons() {
    colors.forEach(color => {
        document.getElementById(color).classList.remove('disabled-btn');
    });
}

function nextLevel() {
    level++;
    playerSequence = [];
    acceptingInput = false;
    nextLevelBtn.classList.add('hidden');
    blockButtons();
    
    updateDisplay();
    addToSequence();
    playSequence();
}

function addToSequence() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
}

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

function highlightButton(color) {
    const btn = document.getElementById(color);
    btn.classList.add('highlight');
    
    setTimeout(() => {
        btn.classList.remove('highlight');
    }, 300);
}

function handleColorClick(color) {
    if (!gameStarted || !acceptingInput) return;
    
    highlightButton(color);
    playerSequence.push(color);
    
    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        gameOver();
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        score += level * 15;
        updateDisplay();
        acceptingInput = false;
        blockButtons();
        nextLevelBtn.classList.remove('hidden');
    }
}

function updateDisplay() {
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
}

function gameOver() {
    messageEl.textContent = `Игра окончена! Вы достигли ${level} уровня, получив ${score} очков!`;
    messageEl.classList.remove('hidden');
    levelDisplay.parentElement.parentElement.classList.add('hidden'); 
    gameStarted = false;
    acceptingInput = false;
    blockButtons();
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'Начать заново';
}