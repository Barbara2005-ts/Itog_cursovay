document.addEventListener('DOMContentLoaded', function () {
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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHF2aHdsd2RocGJydHl0eHhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTI2OTA2MywiZXhwIjoyMDYwODQ1MDYzfQ.G8dLZZu9b7FHOZmwFDun4tN50oXtPt2NxHspnTo6xT0')

        async function registerUser() {
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const username = document.getElementById('username').value;
        
            if (!username) {
                alert('Пожалуйста, введите имя пользователя!');
                return;
            }
        
            try {
                // Проверка на наличие пользователя с таким email
                const { data, error: userError } = await supabaseClient
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();  // Ожидаем только один результат
        
                if (userError && userError.code !== 'PGRST100') {
                    throw userError;  // Ошибка при проверке email
                }
        
                if (data) {
                    alert('Пользователь с таким email уже существует!');
                    return;
                }
        
                // Регистрация пользователя
                const { error } = await supabaseClient.auth.signUp({ email, password });
        
                if (error) throw error;
        
                // Сохранение имени пользователя в localStorage
                localStorage.setItem('username', username);
        
                alert('Проверьте вашу почту для подтверждения!');
                closeModal('modalRegister');
                nextSlide();
                window.location.href = '../account/account.html';
            } catch (error) {
                console.error('Ошибка регистрации:', error);  // Логирование ошибки
                alert('Ошибка регистрации: ' + error.message);
            }
        }
        
        
    

    const animals = {
        init: function () {
            document.querySelectorAll('.animal-container').forEach(container => {
                const bubble = container.querySelector('.speech-bubble');
                container.addEventListener('mouseenter', () => {
                    if (bubble) {
                        bubble.style.opacity = '1';
                        bubble.style.transform = 'scale(1)';
                    }
                });
                container.addEventListener('mouseleave', () => {
                    if (bubble) {
                        bubble.style.opacity = '0';
                        bubble.style.transform = 'scale(0.9)';
                    }
                });
            });
        }
    };

    // Инициализация всех компонентов
    slider.init();
    modal.init();
    animals.init();

    // Глобальные функции
    window.openModal = modal.open;
    window.closeModal = modal.close;
    window.nextSlide = slider.nextSlide.bind(slider);
    window.prevSlide = slider.prevSlide.bind(slider);
    window.registerUser = registerUser;
    window.loginUser = loginUser;
});
