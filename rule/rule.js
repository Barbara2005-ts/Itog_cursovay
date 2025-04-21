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
        'https://uuxlntdjcmfosskjwyhb.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eGxudGRqY21mb3Nza2p3eWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDkyMDgxOCwiZXhwIjoyMDYwNDk2ODE4fQ.PhUHwUcHqDu1VFX9O-kuilvFF26XSu1ITxGL1QDNg_s'
    );

    async function registerUser() {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const { data, error } = await supabaseClient.auth.signUp({ email, password });
            if (error) throw error;
            alert('Проверьте вашу почту для подтверждения!');
            closeModal('modalRegister');
            nextSlide();
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
        }
    }

    async function loginUser() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            alert('Добро пожаловать, ' + data.user.email + '!');
            closeModal('modalLogin');
            nextSlide();
        } catch (error) {
            alert('Ошибка входа: ' + error.message);
        }
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
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
