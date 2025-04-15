const TOTAL_LEVELS = 10;
    const items = [
      '🍎','🍌','🍇','🍪','🍰','🧸','🪀','🎈','🎲','📦','🧦','🎁','🥕','🥚','🍋','🪁','🧃','🍭','🚗','🚕'
    ];

    let currentItems = [];
    let missingItem = '';
    let level = 1;
    let score = 0;

    const board = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const message = document.getElementById('message');
    const startButton = document.getElementById('start-button');

    document.getElementById('rules-button').onclick = () => {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('rules-modal').style.display = 'block';
    }

    function closeRules() {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('rules-modal').style.display = 'none';
    }

    function startGame() {
      level = 1;
      score = 0;
      updateUI();
      startButton.style.display = 'none';
      nextLevel();
    }

    function nextLevel() {
      message.textContent = 'Запоминай предметы...';
      board.innerHTML = '';
      const count = 4 + level;
      const shuffled = items.sort(() => 0.5 - Math.random());
      currentItems = shuffled.slice(0, count);
      missingItem = currentItems[Math.floor(Math.random() * currentItems.length)];

      currentItems.forEach(item => {
        const el = document.createElement('div');
        el.textContent = item;
        el.className = 'item';
        board.appendChild(el);
      });

      setTimeout(() => {
        board.innerHTML = '';
        const visibleItems = currentItems.filter(i => i !== missingItem);
        visibleItems.forEach(item => {
          const el = document.createElement('div');
          el.textContent = item;
          el.className = 'item';
          el.onclick = () => guessItem(item);
          board.appendChild(el);
        });

        const hidden = document.createElement('div');
        hidden.textContent = '❓';
        hidden.className = 'item';
        hidden.onclick = () => guessItem(missingItem);
        board.appendChild(hidden);

        message.textContent = 'Что исчезло?';
      }, 2000);
    }

    function guessItem(guess) {
      const itemsEls = document.querySelectorAll('.item');
      itemsEls.forEach(el => {
        el.onclick = null;
        if (el.textContent === missingItem) {
          el.classList.add('correct');
        } else if (el.textContent === guess) {
          el.classList.add('wrong');
        }
      });

      if (guess === missingItem) {
        score += 10;
        showMessage('✅ Верно!');
      } else {
        showMessage(`❌ Неправильно! Пропал: ${missingItem}`);
      }

      level++;
      updateUI();

      if (level > TOTAL_LEVELS) {
        setTimeout(endGame, 1500);
      } else {
        setTimeout(nextLevel, 1500);
      }
    }

    function updateUI() {
      levelDisplay.textContent = Math.min(level, TOTAL_LEVELS);
      scoreDisplay.textContent = score;
    }

    function showMessage(text) {
      message.textContent = text;
    }

    function endGame() {
      showMessage(`🎉 Игра окончена! Ваш счёт: ${score} из ${TOTAL_LEVELS * 10}`);
      startButton.textContent = 'Играть снова';
      startButton.style.display = 'inline-block';
    }

    startButton.onclick = startGame;