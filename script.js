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

let currentSloganIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentLang = 'ru';
let typeTimer;
let sloganTimer;
let isTyping = false;

const sloganElement = document.getElementById('slogan');
const cursorElement = document.querySelector('.cursor');
const continueBtn = document.getElementById('continueBtn');
const langToggle = document.getElementById('langToggle');

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
            sloganTimer = setTimeout(() => {
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
            typeTimer = setTimeout(() => {
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
    clearTimeout(sloganTimer);
    charIndex = 0;
    isDeleting = false;
    isTyping = true;
    sloganElement.textContent = '';
    typeSlogan();
}

function changeSlogan() {
    currentSloganIndex = (currentSloganIndex + 1) % getCurrentSlogans().length;
}

// Запускаем печатание первого слогана
isTyping = true;
typeSlogan();

// Меняем слоган каждые 3 секунды только если не идёт печатание
setInterval(() => {
    if (!isTyping) {
        currentSloganIndex = (currentSloganIndex + 1) % getCurrentSlogans().length;
        resetAndRestartTyping();
    }
}, 3000);

// Переключение языка
langToggle.addEventListener('click', () => {
    if (currentLang === 'ru') {
        currentLang = 'en';
        langToggle.textContent = 'Русский';
        document.documentElement.lang = 'en';
        document.title = 'SHIFR — secure messenger';
        continueBtn.textContent = 'Continue';
    } else {
        currentLang = 'ru';
        langToggle.textContent = 'English';
        document.documentElement.lang = 'ru';
        document.title = 'ШИФР — защищённый мессенджер';
        continueBtn.textContent = 'Продолжить';
    }
    
    currentSloganIndex = 0;
    resetAndRestartTyping();
});

// Эффект при наведении на букву Ш
document.querySelector('.sh-letter').addEventListener('mouseenter', function() {
    this.style.textShadow = `
        0 0 30px #ff0044,
        0 0 60px #ff0044,
        0 0 100px #ff0066,
        0 0 150px #ff0066,
        0 0 250px #ff0066
    `;
});

document.querySelector('.sh-letter').addEventListener('mouseleave', function() {
    this.style.textShadow = `
        0 0 20px #ff0044,
        0 0 40px #ff0044,
        0 0 80px #ff0044,
        0 0 120px #ff0066,
        0 0 200px #ff0066
    `;
});

// Клик по кнопке Продолжить
continueBtn.addEventListener('click', () => {
    const messages = {
        ru: 'Добро пожаловать в ШИФР! 🔐\nЗдесь начинается твоя приватность.',
        en: 'Welcome to SHIFR! 🔐\nYour privacy starts here.'
    };
    alert(messages[currentLang]);
});
