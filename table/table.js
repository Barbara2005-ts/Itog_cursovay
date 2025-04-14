const table = document.getElementById('table');
const startButton = document.getElementById('start-game');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const messageDisplay = document.getElementById('message');

let score = 0;
let level = 1;
let items = [];
let hiddenItemIndex = null;

const itemImages = [
    'items/abc-block.png', // Путь к изображению предмета 1
    'items/duck.png', // Путь к изображению предмета 2
    'items/piramida.png', // Путь к изображению предмета 3
    'items/robot.png', // Путь к изображению предмета 4
    'items/teddy-bear.png', // Путь к изображению предмета 5
    'items/toy-rocket.png', // Путь к изображению предмета 6
];

startButton.addEventListener('click', startGame);

function startGame() {
    messageDisplay.textContent = '';
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    items = generateItems(level);
    displayItems();
}

function generateItems(level) {
    const numberOfItems = 5 + level; // С каждым уровнем добавляются новые предметы
    let generatedItems = [];
    for (let i = 0; i < numberOfItems; i++) {
        const itemIndex = Math.floor(Math.random() * itemImages.length); // Случайный индекс изображения
        generatedItems.push({
            image: itemImages[itemIndex], // Путь к изображению предмета
            id: `item-${i}`, // Идентификатор для предмета
        });
    }
    hiddenItemIndex = Math.floor(Math.random() * numberOfItems); // Скрываем случайный предмет
    return generatedItems;
}

function displayItems() {
    table.innerHTML = ''; // Очистить таблицу

    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.dataset.index = index;
        
        // Создание изображения для предмета
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = `Предмет ${index + 1}`;
        img.classList.add('item-image'); // Класс для изображения
        itemElement.appendChild(img);

        itemElement.addEventListener('click', checkItem);
        table.appendChild(itemElement);
    });

    // Пропадающий предмет
    table.children[hiddenItemIndex].style.display = 'none';
    setTimeout(() => {
        table.children[hiddenItemIndex].style.display = 'block';
        askToGuess();
    }, 1000); // Показываем снова через секунду
}

function askToGuess() {
    messageDisplay.textContent = 'Что пропало? Кликните на предмет!';
}

function checkItem(event) {
    const clickedItemIndex = event.target.closest('.item').dataset.index;
    
    if (clickedItemIndex == hiddenItemIndex) {
        score += 10;
        level++;
        messageDisplay.textContent = 'Правильно! Переходим к следующему уровню.';
    } else {
        messageDisplay.textContent = 'Неверно, попробуйте снова!';
    }
    
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    setTimeout(startGame, 1500);
}
