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
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', function() {
        slider.init();
        
        // Глобальные функции для кнопок
        window.nextSlide = () => slider.nextSlide();
        window.prevSlide = () => slider.prevSlide();
    });

// Модальные окна
const modal = {
    init: function() {
        // Гарантированно скрываем все модальные окна при загрузке
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Закрытие по клику вне окна
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                const modalId = event.target.id;
                modal.close(modalId);
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
}

const supabase = supabase.createClient(
    'https://uuxlntdjcmfosskjwyhb.supabase.co',
    'вставь_сюда_свой_ANON_KEY'
  );
  
  async function registerUser() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
  
    if (error) {
      alert("Ошибка регистрации: " + error.message);
    } else {
      alert("Регистрация успешна! Подтвердите почту.");
      closeModal("modalRegister");
    }
  }
  
  async function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      alert("Ошибка входа: " + error.message);
    } else {
      alert("Вход выполнен!");
      closeModal("modalLogin");
      // можно запустить игру или перейти к следующему слайду
    }
  }
  
  

    // Анимация пузырей у животных
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

    // Глобальные функции для вызова из HTML
    window.openModal = (id) => modal.open(id);
    window.closeModal = (id) => modal.close(id);
    window.nextSlide = () => slider.nextSlide();
    window.prevSlide = () => slider.prevSlide();
});
