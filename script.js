// Массив фраз для печатной машинки
const phrases = [
    "Твой разговор. Твои правила.",
    "Твой код. Твоя защита.",
    "Говори свободно."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const taglineElement = document.getElementById('tagline');

// Эффект печатной машинки
function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        taglineElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        taglineElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

// Переключение между экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Обработка ввода номера телефона
function initPhoneInput() {
    const phoneInput = document.getElementById('phone-number');
    const getCodeBtn = document.getElementById('get-code-btn');
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        let formattedValue = '';
        if (value.length > 0) formattedValue = '+7 ';
        if (value.length > 1) formattedValue += value.slice(1, 4);
        if (value.length > 4) formattedValue += ' ' + value.slice(4, 7);
        if (value.length > 7) formattedValue += ' ' + value.slice(7, 9);
        if (value.length > 9) formattedValue += ' ' + value.slice(9, 11);
        
        e.target.value = formattedValue;
        
        // Активация кнопки при вводе 11 цифр
        getCodeBtn.disabled = value.length !== 11;
    });
}

// Обработка кнопок языка
function initLanguageButtons() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            console.log(`Язык изменён на: ${lang === 'ru' ? 'Русский' : 'English'}`);
            // Здесь позже будет реальная смена языка
        });
    });
}

// Запуск при инициализации
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем эффект печати
    typeEffect();
    
    // Назначаем обработчик кнопки "Продолжить"
    document.getElementById('get-started-btn').addEventListener('click', () => {
        showScreen('login-screen');
    });
    
    // Инициализируем остальные компоненты
    initPhoneInput();
    initLanguageButtons();
    
    // Обработка кнопки "Получить код"
    document.getElementById('get-code-btn').addEventListener('click', () => {
        const phone = document.getElementById('phone-number').value;
        if (phone.length > 5) {
            alert(`Код отправлен на номер ${phone}`);
            // Здесь позже будет реальная отправка SMS
        }
    });
});
