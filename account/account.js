console.log('Скрипт account.js начал выполнение');

// Основные переменные
let supabaseClient;

// Главная функция инициализации
// Главная функция инициализации
async function initApp() {
    console.log('Инициализация приложения...');
    
    try {
        // 1. Инициализация Supabase
        initSupabase();
        
        // 2. Проверка сессии
        const { user, error } = await checkAuth();
        if (error || !user) return;
        
        // 3. Установка имени пользователя
        document.getElementById('user-name').textContent = 
            user.user_metadata?.username || user.email?.split('@')[0] || 'Пользователь';
        
        // 4. Настройка аватара
        await setupAvatar(user);
        
        // 5. Загрузка статистики
        await loadUserStats(user);
        
        console.log('Приложение успешно инициализировано');
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Произошла ошибка при загрузке страницы');
    }
}



// Инициализация Supabase
function initSupabase() {
    const supabaseUrl = 'https://rjhqvhwlwdhpbrtytxxp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHF2aHdsd2RocGJydHl0eHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjkwNjMsImV4cCI6MjA2MDg0NTA2M30.UuSxSWlp8VSyUyEsGFNkPQm3n2mqRw_hw7kDdz_DqSg';
    
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    window.supabase = supabaseClient;
    
    console.log('Supabase инициализирован');
}

// Проверка авторизации
async function checkAuth() {
    console.log('Проверка авторизации...');
    
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error || !session) {
            console.warn('Пользователь не авторизован, перенаправление...');
            window.location.href = 'rule.html';
            return { error: true };
        }
        
        const { data: { user } } = await supabaseClient.auth.getUser();
        return { user };
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        return { error: true };
    }
}

// Загрузка данных пользователя
async function loadUserStats(user) {
    const userId = user.id;
    console.log('Загрузка статистики для пользователя:', userId);

    try {
        const { data, error } = await supabaseClient
            .from('stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error && error.code === 'PGRST116') {
            // Если статистика отсутствует, создаём её
            const { error: insertError } = await supabaseClient.from('stats').insert({
                user_id: userId,
                total_points: 0,
                total_levels: 0,
                flash_points: 0,
                flash_levels: 0,
                lost_points: 0,
                lost_levels: 0,
                pairs_points: 0,
                pairs_levels: 0
            });
            
            if (insertError) {
                console.error('Ошибка при создании статистики:', insertError);
                throw insertError;
            }
            
            console.log('Статистика создана');
            // Обновляем отображение с нулевыми значениями
            updateStatsDisplay({
                total_points: 0,
                total_levels: 0,
                flash_points: 0,
                flash_levels: 0,
                lost_points: 0,
                lost_levels: 0,
                pairs_points: 0,
                pairs_levels: 0
            });
        } else if (data) {
            console.log('Статистика загружена:', data);
            // Обновляем отображение с загруженными данными
            updateStatsDisplay(data);
        } else {
            console.error('Неизвестная ошибка при загрузке статистики');
            throw new Error('Не удалось загрузить статистику');
        }
    } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        showError('Не удалось загрузить статистику');
    }
}


// Настройка аватара (исправленная версия)
async function setupAvatar(user) {
    console.log('Настройка аватара...');
    
    const avatarImg = document.getElementById('current-avatar');
    if (!avatarImg) {
        console.error('Элемент аватара не найден');
        return;
    }
    
    // 1. Проверяем аватар в метаданных пользователя
    const userAvatar = user.user_metadata?.avatar;
    
    // 2. Проверяем сохраненный аватар в localStorage
    const savedAvatar = localStorage.getItem('selectedAvatar');
    
    // 3. Устанавливаем аватар (приоритет: метаданные > localStorage > дефолтный)
    avatarImg.src = userAvatar || savedAvatar || 'avatars/user.png';
    
    // Назначение обработчиков для смены аватара
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', async () => {
            const newAvatar = option.src;
            console.log('Смена аватара на:', newAvatar);
            
            try {
                // Визуальное обновление
                avatarImg.src = newAvatar;
                localStorage.setItem('selectedAvatar', newAvatar);
                
                // Сохранение в Supabase
                const { error } = await supabaseClient.auth.updateUser({
                    data: { avatar: newAvatar }
                });
                
                if (error) throw error;
                console.log('Аватар сохранен');
            } catch (error) {
                console.error('Ошибка сохранения аватара:', error);
                alert('Не удалось сохранить аватар');
                // Возвращаем предыдущий аватар при ошибке
                avatarImg.src = userAvatar || savedAvatar || 'avatars/user.png';
            }
        });
    });
}



// Обновление отображения статистики
function updateStatsDisplay(stats) {
    console.log('Обновление статистики:', stats);
    
    const fields = {
        'total-points': 'total_points',
        'total-levels': 'total_levels',
        'flash-points': 'flash_points',
        'flash-levels': 'flash_levels',
        'lost-points': 'lost_points',
        'lost-levels': 'lost_levels',
        'pairs-points': 'pairs_points',
        'pairs-levels': 'pairs_levels'
    };

    Object.entries(fields).forEach(([elementId, field]) => {
        const element = document.getElementById(elementId);
        console.log(`Обновление ${elementId} значением ${stats[field]}`);
        if (element) {
            element.textContent = stats[field] || 0;
        } else {
            console.error(`Элемент с ID ${elementId} не найден`);
        }
    });
}

// Показать ошибку
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Ошибка: ${message}`;
    document.body.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Проверка загрузки Supabase
function checkDependencies() {
    return new Promise((resolve) => {
        const check = () => {
            if (typeof supabase !== 'undefined') {
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// Запуск приложения
async function startApp() {
    try {
        await checkDependencies();
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initApp();
        } else {
            document.addEventListener('DOMContentLoaded', initApp);
        }
    } catch (error) {
        console.error('Критическая ошибка:', error);
        showError('Не удалось загрузить приложение');
    }
}

// Старт приложения
startApp();