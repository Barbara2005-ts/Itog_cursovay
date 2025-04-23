document.addEventListener('DOMContentLoaded', function () {
    // Добавьте в DOMContentLoaded:
    document.getElementById('login-btn').addEventListener('click', loginUser);
    // Слайдер
    const slider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.slide'),

        init: function() {
            this.updateSlide();
        },

        updateSlide: function() {
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('hidden', index !== this.currentSlide);
                if (index === this.currentSlide) {
                    slide.style.animation = 'fadeIn 0.5s ease';
                }
            });
            this.updateButtons();
        },

        updateButtons: function() {
            const currentSlide = this.slides[this.currentSlide];
            const prevBtns = currentSlide.querySelectorAll('.prev-button');
            const nextBtns = currentSlide.querySelectorAll('.next-button');

            prevBtns.forEach(btn => {
                btn.style.display = this.currentSlide === 0 ? 'none' : 'block';
            });

            nextBtns.forEach(btn => {
                btn.style.display = this.currentSlide === this.slides.length - 1 ? 'none' : 'block';
            });
        },

        nextSlide: function() {
            if (this.currentSlide < this.slides.length - 1) {
                this.currentSlide++;
                this.updateSlide();
            }
        },

        prevSlide: function() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateSlide();
            }
        }
    };

    // Модальные окна
    const modal = {
        init: function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', function(event) {
                if (event.target.classList.contains('modal')) {
                    modal.close(event.target.id);
                }
            });
        },

        open: function(id) {
            const modalElement = document.getElementById(id);
            if (modalElement) {
                modalElement.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        },

        close: function(id) {
            const modalElement = document.getElementById(id);
            if (modalElement) {
                modalElement.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    };

    // Supabase (замени на свои ключи в .env или через сервер)
    const supabaseClient = supabase.createClient(
        'https://rjhqvhwlwdhpbrtytxxp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHF2aHdsd2RocGJydHl0eHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjkwNjMsImV4cCI6MjA2MDg0NTA2M30.UuSxSWlp8VSyUyEsGFNkPQm3n2mqRw_hw7kDdz_DqSg'
    );

       // Обработчик изменений состояния аутентификации
       supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth Event:', event, 'Session:', session);
        if (event === 'SIGNED_IN') {
            const username = session.user.user_metadata?.username || session.user.email.split('@')[0];
            localStorage.setItem('username', username);
            localStorage.setItem('supabase_session', JSON.stringify(session));
        }
    });
    // Функция регистрации с полной обработкой ошибок
    async function registerUser() {
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const username = document.getElementById('username').value.trim();
    
        if (!username || !email || !password) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
    
        try {
            // 1. Пытаемся зарегистрировать пользователя
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                    // Отключаем подтверждение email
                    emailRedirectTo: window.location.origin
                }
            });
    
            // 2. Обработка ошибок
            if (error) {
                if (error.message.includes('User already registered')) {
                    if (confirm('Этот email уже зарегистрирован. Хотите войти?')) {
                        openModal('modalLogin');
                        document.getElementById('login-email').value = email;
                        document.getElementById('login-password').focus();
                    }
                    return;
                }
                throw error;
            }
    
            // 3. Автоматический вход после регистрации
            const { error: loginError } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
    
            if (loginError) throw loginError;

                const { data: userData, error: userError } = await supabaseClient.auth.getUser();
                if (userError) throw userError;

                const userId = userData.user.id;
                const { error: statsError } = await supabaseClient
                .from('stats')
                .insert({
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
                if (statsError) throw statsError;
    
            // 4. Успешная регистрация и вход
            alert('Регистрация и вход выполнены успешно!');
            closeModal('modalRegister');
            
            // Очистка формы
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('username').value = '';
            
            // Перенаправление
            window.location.href = '/home/account/account.html';
    
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка регистрации: ' + error.message);
        }
    }

    async function loginUser() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        if (!email || !password) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
    
        try {
            // 1. Попытка входа
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
    
            // 2. Обработка ошибок
            if (error) {
                console.error('Ошибка входа:', error);
                
                // Случай неподтвержденного email
                if (error.message.includes('email not confirmed')) {
                    const resend = confirm('Email не подтвержден. Отправить письмо с подтверждением?');
                    if (resend) {
                        await supabaseClient.auth.resend({
                            type: 'signup',
                            email: email
                        });
                        alert('Письмо с подтверждением отправлено!');
                    }
                    return;
                }
                
                // Случай неверных учетных данных
                if (error.message.includes('Invalid login credentials')) {
                    alert('Неверный email или пароль');
                    return;
                }
                
                // Общий случай ошибки
                alert('Ошибка входа: ' + error.message);
                return;
            }
    
            // 3. Успешный вход
            const username = data.user.user_metadata?.username || data.user.email.split('@')[0];
            localStorage.setItem('username', username);
            
            alert('Вход выполнен успешно!');
            closeModal('modalLogin');
            window.location.href = '/home/account/account.html';
    
        } catch (err) {
            console.error('Неожиданная ошибка:', err);
            alert('Произошла непредвиденная ошибка при входе');
        }
    }

    // Инициализация всех компонентов
    slider.init();
    modal.init();

    // Глобальные функции
    window.openModal = modal.open;
    window.closeModal = modal.close;
    window.nextSlide = slider.nextSlide.bind(slider);
    window.prevSlide = slider.prevSlide.bind(slider);
    window.registerUser = registerUser;
});
    