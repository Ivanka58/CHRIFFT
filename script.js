// ============ СОСТОЯНИЕ ============
let currentLang = localStorage.getItem('shifr_lang') || 'ru';
let currentPage = 'welcome';

// Слоганы
const slogansRU = [
    "Твой код — твои правила.",
    "Говори свободно.",
    "Абсолютная приватность.",
    "Никакой слежки.",
    "Двойное дно.",
    "Секунда — и данных нет.",
    "Общайся без страха.",
    "Шифр не врёт."
];

const slogansEN = [
    "Your code — your rules.",
    "Speak freely.",
    "Absolute privacy.",
    "No surveillance.",
    "Double bottom.",
    "One second — and data is gone.",
    "Communicate without fear.",
    "Cipher doesn't lie."
];

// Тексты для авторизации
const authTexts = {
    ru: {
        back: 'Назад',
        title: 'Вход в ШИФР',
        subtitle: 'Введите номер телефона для авторизации',
        placeholder: '___ ___-__-__',
        getCode: 'Получить код',
        footer: 'Шифрование end-to-end',
        loading: 'Отправка...',
        codeSent: 'Код отправлен! Проверьте SMS 📱',
        invalidPhone: 'Введите корректный номер телефона'
    },
    en: {
        back: 'Back',
        title: 'SHIFR Login',
        subtitle: 'Enter your phone number to sign in',
        placeholder: '___ ___-__-__',
        getCode: 'Get Code',
        footer: 'End-to-end encryption',
        loading: 'Sending...',
        codeSent: 'Code sent! Check your SMS 📱',
        invalidPhone: 'Please enter a valid phone number'
    }
};

// ============ DOM ЭЛЕМЕНТЫ ============
const welcomePage = document.getElementById('welcomePage');
const authPage = document.getElementById('authPage');
const sloganElement = document.getElementById('slogan');
const continueBtn = document.getElementById('continueBtn');
const langToggle = document.getElementById('langToggle');
const backBtn = document.getElementById('backBtn');
const phoneInput = document.getElementById('phoneInput');
const getCodeBtn = document.getElementById('getCodeBtn');
const phoneMask = document.getElementById('phoneMask');
const authTitle = document.querySelector('.auth-title');
const authSubtitle = document.querySelector('.auth-subtitle');
const backText = document.querySelector('.back-text');
const btnText = document.querySelector('.btn-text');
const footerText = document.querySelector('.footer-text');

// ============ ПЕЧАТАНИЕ СЛОГАНОВ ============
let currentSloganIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer;
let isTyping = false;

function getCurrentSlogans() {
    return currentLang === 'ru' ? slogansRU : slogansEN;
}

function typeSlogan() {
    const slogans = getCurrentSlogans();
    const fullSlogan = slogans[currentSloganIndex];
    
    if (!isDeleting) {
        charIndex++;
        sloganElement.textContent = fullSlogan.substring(0, charIndex);
        
        if (charIndex >= fullSlogan.length) {
            isTyping = false;
            clearTimeout(typeTimer);
            setTimeout(() => {
                isDeleting = true;
                isTyping = true;
                typeSlogan();
            }, 2000);
            return;
        }
    } else {
        charIndex--;
        sloganElement.textContent = fullSlogan.substring(0, charIndex);
        
        if (charIndex <= 0) {
            isDeleting = false;
            isTyping = false;
            currentSloganIndex = (currentSloganIndex + 1) % slogans.length;
            clearTimeout(typeTimer);
            setTimeout(() => {
                isTyping = true;
                typeSlogan();
            }, 300);
            return;
        }
    }
    
    const speed = isDeleting ? 30 : 70;
    typeTimer = setTimeout(typeSlogan, speed);
}

function resetAndRestartTyping() {
    clearTimeout(typeTimer);
    charIndex = 0;
    isDeleting = false;
    isTyping = true;
    sloganElement.textContent = '';
    typeSlogan();
}

// Запуск печатания
isTyping = true;
typeSlogan();

// Смена слогана каждые 3 секунды
setInterval(() => {
    if (!isTyping && currentPage === 'welcome') {
        currentSloganIndex = (currentSloganIndex + 1) % getCurrentSlogans().length;
        resetAndRestartTyping();
    }
}, 3000);

// ============ ФОРМАТИРОВАНИЕ ТЕЛЕФОНА ============
function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    
    if (digits.length > 0) {
        formatted += digits.substring(0, 3);
    }
    if (digits.length > 3) {
        formatted += ' ' + digits.substring(3, 6);
    }
    if (digits.length > 6) {
        formatted += '-' + digits.substring(6, 8);
    }
    if (digits.length > 8) {
        formatted += '-' + digits.substring(8, 10);
    }
    
    return formatted;
}

function updatePhoneDisplay() {
    const value = phoneInput.value.replace(/\D/g, '');
    phoneInput.value = formatPhoneNumber(value);
    
    // Обновление маски
    const digits = value.length;
    const placeholder = '___ ___-__-__';
    const formatted = formatPhoneNumber(value);
    let maskedDisplay = formatted;
    
    for (let i = formatted.length; i < placeholder.length; i++) {
        maskedDisplay += placeholder[i];
    }
    
    phoneMask.textContent = '🔑 ' + maskedDisplay;
    
    // Активация кнопки
    if (digits.length === 10) {
        getCodeBtn.disabled = false;
        phoneInput.style.borderBottomColor = '#00ff88';
        phoneInput.style.boxShadow = '0 5px 15px -5px rgba(0, 255, 136, 0.3)';
    } else {
        getCodeBtn.disabled = true;
        phoneInput.style.borderBottomColor = '';
        phoneInput.style.boxShadow = '';
    }
}

// ============ ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ============
function showPage(page) {
    currentPage = page;
    welcomePage.classList.remove('active');
    authPage.classList.remove('active');
    
    if (page === 'welcome') {
        welcomePage.classList.add('active');
        resetAndRestartTyping();
    } else if (page === 'auth') {
        authPage.classList.add('active');
        updateAuthTexts();
        phoneInput.focus();
    }
}

// ============ ОБНОВЛЕНИЕ ЯЗЫКА ============
function updateAllTexts() {
    // Обновление кнопки языка
    langToggle.textContent = currentLang === 'ru' ? 'English' : 'Русский';
    
    // Обновление заголовка страницы
    document.title = currentLang === 'ru' ? 'ШИФР — защищённый мессенджер' : 'SHIFR — secure messenger';
    
    // Обновление кнопки Продолжить
    continueBtn.textContent = currentLang === 'ru' ? 'Продолжить' : 'Continue';
    
    // Обновление текстов авторизации
    updateAuthTexts();
    
    // Сохранение языка
    localStorage.setItem('shifr_lang', currentLang);
}

function updateAuthTexts() {
    const texts = authTexts[currentLang];
    backText.textContent = texts.back;
    authTitle.textContent = texts.title;
    authSubtitle.textContent = texts.subtitle;
    phoneInput.placeholder = texts.placeholder;
    btnText.textContent = texts.getCode;
    footerText.textContent = texts.footer;
}

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
// Кнопка Продолжить
continueBtn.addEventListener('click', () => {
    showPage('auth');
});

// Кнопка Назад
backBtn.addEventListener('click', () => {
    showPage('welcome');
    phoneInput.value = '';
    updatePhoneDisplay();
    getCodeBtn.disabled = true;
    getCodeBtn.classList.remove('loading');
});

// Переключение языка
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    document.documentElement.lang = currentLang;
    updateAllTexts();
    
    if (currentPage === 'welcome') {
        currentSloganIndex = 0;
        resetAndRestartTyping();
    }
    
    // Анимация переключения
    langToggle.style.transform = 'scale(1.2)';
    setTimeout(() => {
        langToggle.style.transform = 'scale(1)';
    }, 200);
});

// Ввод телефона
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    phoneInput.value = formatPhoneNumber(value);
    updatePhoneDisplay();
});

// Запрет ввода не-цифр
phoneInput.addEventListener('keydown', (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
        e.preventDefault();
    }
});

// Получить код
getCodeBtn.addEventListener('click', () => {
    if (getCodeBtn.disabled) return;
    
    const texts = authTexts[currentLang];
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    
    if (phoneDigits.length === 10) {
        // Имитация отправки
        getCodeBtn.classList.add('loading');
        btnText.textContent = texts.loading;
        
        setTimeout(() => {
            getCodeBtn.classList.remove('loading');
            btnText.textContent = texts.getCode;
            
            // Создаём уведомление
            showNotification(texts.codeSent);
            
            // Эффект успеха на поле ввода
            phoneInput.style.borderBottomColor = '#00ff88';
            phoneInput.style.boxShadow = '0 5px 25px -5px rgba(0, 255, 136, 0.6)';
            setTimeout(() => {
                phoneInput.style.boxShadow = '';
            }, 2000);
        }, 2000);
    }
});

// ============ УВЕДОМЛЕНИЕ ============
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(20, 0, 40, 0.95);
        border: 1px solid #00ff88;
        color: #00ff88;
        padding: 15px 30px;
        border-radius: 50px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        letter-spacing: 2px;
        z-index: 1000;
        text-shadow: 0 0 10px #00ff88;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        animation: slideDown 0.3s ease, slideUp 0.3s ease 2.7s forwards;
        pointer-events: none;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Добавляем анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-30px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-30px); }
    }
`;
document.head.appendChild(style);

// ============ ИНИЦИАЛИЗАЦИЯ ============
// Применяем сохранённый язык
updateAllTexts();

// Эффект при наведении на букву Ш на странице приветствия
document.querySelector('.sh-letter').addEventListener('mouseenter', function() {
    this.style.textShadow = `
        0 0 20px #ff0044,
        0 0 40px #ff0044,
        0 0 70px rgba(255, 0, 68, 0.6)
    `;
});

document.querySelector('.sh-letter').addEventListener('mouseleave', function() {
    this.style.textShadow = `
        0 0 15px #ff0044,
        0 0 30px #ff0044,
        0 0 50px rgba(255, 0, 68, 0.5)
    `;
});

// Цифровой дождь на странице авторизации
function createDigitalRain() {
    const rainContainer = document.querySelector('.digital-rain');
    if (!rainContainer) return;
    
    const characters = '01';
    
    setInterval(() => {
        const rain = document.createElement('span');
        rain.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
        rain.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            color: #ff0044;
            font-size: ${Math.random() * 15 + 10}px;
            animation: rainDrop ${Math.random() * 3 + 2}s linear forwards;
            opacity: 0;
        `;
        rainContainer.appendChild(rain);
        
        setTimeout(() => {
            if (rain.parentNode) {
                rain.parentNode.removeChild(rain);
            }
        }, 5000);
    }, 100);
}

const rainStyle = document.createElement('style');
rainStyle.textContent = `
    @keyframes rainDrop {
        0% { transform: translateY(0); opacity: 0.3; }
        70% { opacity: 0.2; }
        100% { transform: translateY(100vh); opacity: 0; }
    }
`;
document.head.appendChild(rainStyle);

createDigitalRain();

// Автофокус на поле ввода при переходе на страницу авторизации
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'authPage' && authPage.classList.contains('active')) {
            setTimeout(() => phoneInput.focus(), 300);
        }
    });
});

observer.observe(authPage, { attributes: true, attributeFilter: ['class'] });
