document.addEventListener('DOMContentLoaded', () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let score = 0;
    let gameStarted = false;
    let acceptingInput = false;
    let userId = null;

    // Supabase
    const supabaseUrl = 'https://rjhqvhwlwdhpbrtytxxp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHF2aHdsd2RocGJydHl0eHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjkwNjMsImV4cCI6MjA2MDg0NTA2M30.UuSxSWlp8VSyUyEsGFNkPQm3n2mqRw_hw7kDdz_DqSg';

    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        userId = user.id;
    }
}

    getCurrentUser();

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
        restartGameBtn: document.getElementById('restartGameBtn')
    };

    function init() {
        document.getElementById('gameContainer').style.display = 'none';

        elements.startGameBtn.addEventListener('click', startGame);
        elements.continueBtn.addEventListener('click', continueGame);
        elements.restartGameBtn.addEventListener('click', restartGame);

        elements.levelUpOverlay.style.display = 'none';
        elements.gameOverOverlay.style.display = 'none';

        colors.forEach(color => {
            const btn = document.getElementById(color);
            btn.addEventListener('click', () => handleColorClick(color));
        });
    }

    function startGame() {
        gameStarted = true;
        sequence = [];
        playerSequence = [];
        level = 1;
        score = 0;

        elements.introOverlay.style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';

        updateDisplay();
        addToSequence();
        playSequence();
    }

    function updateDisplay() {
        elements.levelDisplay.textContent = level;
        elements.scoreDisplay.textContent = score;
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
            levelComplete();
        }
    }

    function levelComplete() {
        score += level * 15;
        updateDisplay();
        acceptingInput = false;
        blockButtons();

        elements.newLevelDisplay.textContent = level + 1;
        elements.bonusDisplay.textContent = `+${level * 15}`;
        elements.totalScoreDisplay.textContent = score;
        elements.levelUpOverlay.style.display = 'flex';
    }

    function continueGame() {
        level++;
        playerSequence = [];
        acceptingInput = false;
        elements.levelUpOverlay.style.display = 'none';

        updateDisplay();
        addToSequence();
        playSequence();
    }

    async function gameOver() {
        acceptingInput = false;
        blockButtons();
    
        elements.finalLevelDisplay.textContent = level;
        elements.finalScoreDisplay.textContent = score;
        elements.gameOverOverlay.style.display = 'flex';
    
        // Сохраняем статистику в Supabase
        if (userId) {
            const { data: existingStats, error } = await supabaseClient
                .from('stats')
                .select('*')
                .eq('user_id', userId)
                .single();
    
            if (existingStats) {
                const updatedPoints = existingStats.total_points + score;
                const updatedLevels = existingStats.total_levels + level;
    
                await supabaseClient // ← Исправлено здесь!
                    .from('stats')   // ← Убедись, что таблица называется 'stats', а не 'user_stats'
                    .update({
                        total_points: updatedPoints,
                        total_levels: updatedLevels,
                        flash_points: existingStats.flash_points + score,
                        flash_levels: existingStats.flash_levels + level
                    })
                    .eq('user_id', userId);
            }
        }
    }

    function restartGame() {
        elements.gameOverOverlay.style.display = 'none';
        elements.levelUpOverlay.style.display = 'none';

        gameStarted = false;
        sequence = [];
        playerSequence = [];
        level = 1;
        score = 0;

        document.getElementById('gameContainer').style.display = 'none';
        elements.introOverlay.style.display = 'block';

        startGame();
    }

    init();
});
