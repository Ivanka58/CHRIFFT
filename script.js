// ============ СОСТОЯНИЕ ============
let currentLang = localStorage.getItem('shifr_lang') || 'ru';
let currentPage = 'welcome';
let codeTimer = 60;
let codeTimerInterval = null;
let currentTab = 'chats';
let isChatOpen = false;

// Тестовый код
const CORRECT_CODE_LETTER = 'A';
const CORRECT_CODE_DIGITS = '123456';

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

// Тексты
const texts = {
    ru: {
        back: 'Назад',
        title: 'Вход в ШИФР',
        subtitle: 'Введите номер телефона для авторизации',
        placeholder: '___ ___-__-__',
        getCode: 'Получить код',
        footer: 'Шифрование end-to-end',
        loading: 'Отправка...',
        codeSent: 'Код отправлен! Проверьте SMS 📱',
        codeTitle: 'Код подтверждения',
        codeSubtitle: 'SMS отправлено на номер',
        codePlaceholderLetter: 'A',
        codeError: 'Неверный код. Попробуйте снова.',
        timerPrefix: 'Отправить снова через',
        resend: 'Отправить заново',
        welcome: 'Добро пожаловать в ШИФР! 🔐',
        welcomeSub: 'Здесь начинается твоя приватность.',
        chats: 'Сообщения',
        search: 'Поиск...',
        contacts: 'Контакты',
        settings: 'Настройки',
        profile: 'Профиль',
        secured: 'Канал защищён',
        contactsPlaceholder: 'Здесь будут ваши контакты',
        settingsPlaceholder: 'Настройки безопасности и приватности',
        profilePlaceholder: 'Ваш защищённый профиль',
        messagePlaceholder: 'Сообщение...',
        testChat: 'Тестирование',
        encryption: 'Шифрование E2E',
        today: 'Сегодня',
        onlineStatus: '🔒 Шифрование E2E'
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
        codeTitle: 'Verification Code',
        codeSubtitle: 'SMS sent to',
        codePlaceholderLetter: 'A',
        codeError: 'Invalid code. Please try again.',
        timerPrefix: 'Resend in',
        resend: 'Resend Code',
        welcome: 'Welcome to SHIFR! 🔐',
        welcomeSub: 'Your privacy starts here.',
        chats: 'Messages',
        search: 'Search...',
        contacts: 'Contacts',
        settings: 'Settings',
        profile: 'Profile',
        secured: 'Channel Secured',
        contactsPlaceholder: 'Your contacts will appear here',
        settingsPlaceholder: 'Security and privacy settings',
        profilePlaceholder: 'Your secure profile',
        messagePlaceholder: 'Message...',
        testChat: 'Testing',
        encryption: 'E2E Encryption',
        today: 'Today',
        onlineStatus: '🔒 E2E Encryption'
    }
};

// ============ DOM ЭЛЕМЕНТЫ ============
const welcomePage = document.getElementById('welcomePage');
const authPage = document.getElementById('authPage');
const codePage = document.getElementById('codePage');
const chatsPage = document.getElementById('chatsPage');

// Приветствие
const sloganElement = document.getElementById('slogan');
const continueBtn = document.getElementById('continueBtn');
const langToggle = document.getElementById('langToggle');

// Авторизация
const backBtn = document.getElementById('backBtn');
const phoneInput = document.getElementById('phoneInput');
const getCodeBtn = document.getElementById('getCodeBtn');
const phoneMask = document.getElementById('phoneMask');
const authTitle = document.querySelector('.auth-title');
const authSubtitle = document.querySelector('.auth-subtitle');
const backText = document.querySelector('.back-text');
const btnText = document.querySelector('.btn-text');
const footerText = document.querySelector('.footer-text');

// Код
const codeBackBtn = document.getElementById('codeBackBtn');
const codeLetter = document.getElementById('codeLetter');
const codeDigits = document.querySelectorAll('.code-digit-input');
const codeError = document.getElementById('codeError');
const codeMessage = document.getElementById('codeMessage');
const timerText = document.getElementById('timerText');
const resendBtn = document.getElementById('resendBtn');

// Чаты
const logoutBtn = document.getElementById('logoutBtn');
const chatItems = document.querySelectorAll('.chat-item');
const backToChats = document.getElementById('backToChats');
const chatWindow = document.getElementById('chatWindow');
const chatsTab = document.getElementById('chatsTab');
const messageInput = document.getElementById('messageInput');
const sendMsgBtn = document.getElementById('sendMsgBtn');
const messagesContainer = document.getElementById('messagesContainer');
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// ============ ФУНКЦИИ ОБНОВЛЕНИЯ ТЕКСТОВ ============
function getText(key) {
    return texts[currentLang][key];
}

function updateAllTexts() {
    langToggle.textContent = currentLang === 'ru' ? 'English' : 'Русский';
    document.title = currentLang === 'ru' ? 'ШИФР — защищённый мессенджер' : 'SHIFR — secure messenger';
    continueBtn.textContent = currentLang === 'ru' ? 'Продолжить' : 'Continue';
    updateAuthTexts();
    updateCodeTexts();
    updateChatsTexts();
    localStorage.setItem('shifr_lang', currentLang);
}

function updateAuthTexts() {
    backText.textContent = getText('back');
    authTitle.textContent = getText('title');
    authSubtitle.textContent = getText('subtitle');
    phoneInput.placeholder = getText('placeholder');
    btnText.textContent = getText('getCode');
    footerText.textContent = getText('footer');
}

function updateCodeTexts() {
    document.querySelector('.code-title').textContent = getText('codeTitle');
    document.querySelector('.back-text').textContent = getText('back');
    codeLetter.placeholder = getText('codePlaceholderLetter');
    resendBtn.textContent = getText('resend');
    
    const phoneValue = phoneInput.value || '999 999-99-99';
    codeMessage.textContent = `${getText('codeSubtitle')} +7 ${phoneValue}`;
    
    updateTimerDisplay();
}

function updateChatsTexts() {
    document.querySelector('.chats-header h2').textContent = getText('chats');
    document.querySelector('.search-input').placeholder = getText('search');
    document.querySelector('.chat-window-info h3').textContent = getText('testChat');
    document.querySelector('.chat-window-status').textContent = getText('onlineStatus');
    document.querySelector('.message-input').placeholder = getText('messagePlaceholder');
    document.querySelector('.status-text').textContent = getText('secured');
}

function updateTimerDisplay() {
    if (codeTimer > 0) {
        const minutes = Math.floor(codeTimer / 60);
        const seconds = codeTimer % 60;
        timerText.textContent = `${getText('timerPrefix')} ${minutes}:${seconds.toString().padStart(2, '0')}`;
        resendBtn.disabled = true;
    } else {
        timerText.textContent = '';
        resendBtn.disabled = false;
    }
}

// ============ ПЕЧАТАНИЕ СЛОГАНОВ ============
let currentSloganIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer;
let sloganTimer;
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
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
    if (digits.length > 6) formatted += '-' + digits.substring(6, 8);
    if (digits.length > 8) formatted += '-' + digits.substring(8, 10);
    return formatted;
}

function updatePhoneDisplay() {
    const value = phoneInput.value.replace(/\D/g, '');
    const placeholder = '___ ___-__-__';
    const formatted = formatPhoneNumber(value);
    let maskedDisplay = formatted;
    for (let i = formatted.length; i < placeholder.length; i++) {
        maskedDisplay += placeholder[i];
    }
    phoneMask.textContent = '🔑 ' + maskedDisplay;
    
    if (value.length === 10) {
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
    [welcomePage, authPage, codePage, chatsPage].forEach(p => p.classList.remove('active'));
    
    switch(page) {
        case 'welcome':
            welcomePage.classList.add('active');
            resetAndRestartTyping();
            break;
        case 'auth':
            authPage.classList.add('active');
            updateAuthTexts();
            setTimeout(() => phoneInput.focus(), 300);
            break;
        case 'code':
            codePage.classList.add('active');
            updateCodeTexts();
            startCodeTimer();
            setTimeout(() => codeLetter.focus(), 300);
            break;
        case 'chats':
            chatsPage.classList.add('active');
            updateChatsTexts();
            resetChatView();
            break;
    }
}

// ============ ТАЙМЕР КОДА ============
function startCodeTimer() {
    clearInterval(codeTimerInterval);
    codeTimer = 60;
    updateTimerDisplay();
    
    codeTimerInterval = setInterval(() => {
        codeTimer--;
        updateTimerDisplay();
        
        if (codeTimer <= 0) {
            clearInterval(codeTimerInterval);
            updateTimerDisplay();
        }
    }, 1000);
}

// ============ ПРОВЕРКА КОДА ============
function checkCode() {
    const letter = codeLetter.value.toUpperCase();
    const digits = Array.from(codeDigits).map(input => input.value).join('');
    
    if (letter.length === 1 && digits.length === 6) {
        if (letter === CORRECT_CODE_LETTER && digits === CORRECT_CODE_DIGITS) {
            codeError.textContent = '';
            clearInterval(codeTimerInterval);
            showNotification(getText('welcome'), '#00ff88');
            setTimeout(() => showPage('chats'), 800);
        } else {
            showCodeError();
        }
    }
}

function showCodeError() {
    codeError.textContent = getText('codeError');
    codeError.style.animation = 'none';
    codeError.offsetHeight;
    codeError.style.animation = 'shake 0.5s ease';
    
    // Очистка полей
    codeLetter.value = '';
    codeDigits.forEach(input => input.value = '');
    
    // Подсветка ошибки
    const inputs = [codeLetter, ...codeDigits];
    inputs.forEach(input => {
        input.style.borderColor = '#ff0044';
        input.style.boxShadow = '0 0 20px rgba(255, 0, 68, 0.4)';
    });
    
    setTimeout(() => {
        inputs.forEach(input => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
        codeError.textContent = '';
    }, 2000);
    
    codeLetter.focus();
}

// ============ ЧАТЫ ============
function openChat() {
    isChatOpen = true;
    chatsTab.style.display = 'none';
    chatWindow.style.display = 'flex';
    document.querySelector('.chat-item').classList.add('active-chat');
    updateChatsTexts();
}

function closeChat() {
    isChatOpen = false;
    chatsTab.style.display = 'flex';
    chatWindow.style.display = 'none';
    document.querySelector('.chat-item').classList.remove('active-chat');
}

function resetChatView() {
    closeChat();
    switchTab('chats');
}

function switchTab(tab) {
    currentTab = tab;
    
    // Обновление навигации
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tab) item.classList.add('active');
    });
    
    // Обновление контента
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.getElementById(tab + 'Tab');
    if (activeTab) activeTab.classList.add('active');
    
    // Скрыть окно чата при переключении
    if (tab !== 'chats') {
        closeChat();
    }
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <p>${escapeHtml(text)}</p>
            <span class="message-time">${time} ✓✓</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    messageInput.value = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ УВЕДОМЛЕНИЯ ============
function showNotification(message, color = '#00ff88') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(20, 0, 40, 0.95);
        border: 1px solid ${color};
        color: ${color};
        padding: 15px 30px;
        border-radius: 50px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        letter-spacing: 2px;
        z-index: 1000;
        text-shadow: 0 0 10px ${color};
        box-shadow: 0 0 20px ${color === '#00ff88' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 68, 0.3)'};
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

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
// Кнопка Продолжить
continueBtn.addEventListener('click', () => showPage('auth'));

// Кнопки Назад
backBtn.addEventListener('click', () => {
    showPage('welcome');
    phoneInput.value = '';
    updatePhoneDisplay();
    getCodeBtn.disabled = true;
    getCodeBtn.classList.remove('loading');
    btnText.textContent = getText('getCode');
});

codeBackBtn.addEventListener('click', () => {
    clearInterval(codeTimerInterval);
    showPage('auth');
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
    
    langToggle.style.transform = 'scale(1.2)';
    setTimeout(() => langToggle.style.transform = 'scale(1)', 200);
});

// Ввод телефона
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substring(0, 10);
    
    const cursorPos = e.target.selectionStart;
    const oldLength = e.target.value.length;
    
    const formatted = formatPhoneNumber(value);
    e.target.value = formatted;
    
    const newLength = formatted.length;
    const newCursorPos = cursorPos + (newLength - oldLength);
    e.target.setSelectionRange(newCursorPos, newCursorPos);
    
    updatePhoneDisplay();
});

phoneInput.addEventListener('keydown', (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Escape'];
    if (allowedKeys.includes(e.key)) return;
    if (!/[0-9]/.test(e.key)) e.preventDefault();
    
    const currentDigits = phoneInput.value.replace(/\D/g, '');
    if (currentDigits.length >= 10) e.preventDefault();
});

phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedData = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pastedData.replace(/\D/g, '').substring(0, 10);
    
    const cursorPos = e.target.selectionStart;
    const currentValue = e.target.value;
    const digitsBeforeCursor = currentValue.substring(0, cursorPos).replace(/\D/g, '');
    const digitsAfterCursor = currentValue.substring(e.target.selectionEnd).replace(/\D/g, '');
    
    let allDigits = digitsBeforeCursor + digits + digitsAfterCursor;
    if (allDigits.length > 10) allDigits = allDigits.substring(0, 10);
    
    const formatted = formatPhoneNumber(allDigits);
    e.target.value = formatted;
    
    const newCursorPos = formatPhoneNumber(digitsBeforeCursor + digits).length;
    e.target.setSelectionRange(newCursorPos, newCursorPos);
    
    updatePhoneDisplay();
});

// Получить код
getCodeBtn.addEventListener('click', () => {
    if (getCodeBtn.disabled) return;
    
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    
    if (phoneDigits.length === 10) {
        getCodeBtn.classList.add('loading');
        btnText.textContent = getText('loading');
        
        setTimeout(() => {
            getCodeBtn.classList.remove('loading');
            btnText.textContent = getText('getCode');
            showNotification(getText('codeSent'));
            showPage('code');
        }, 1500);
    }
});

// Ввод кода (буква)
codeLetter.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^a-zA-Z]/g, '');
    if (value.length > 1) value = value.substring(0, 1);
    e.target.value = value.toUpperCase();
    
    if (value.length === 1) {
        codeDigits[0].focus();
    }
    checkCode();
});

codeLetter.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && codeLetter.value === '') {
        // Уже пусто, ничего не делаем
    }
});

// Ввод кода (цифры)
codeDigits.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 1) value = value.substring(0, 1);
        e.target.value = value;
        
        if (value.length === 1 && index < codeDigits.length - 1) {
            codeDigits[index + 1].focus();
        }
        
        checkCode();
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '') {
            if (index > 0) {
                codeDigits[index - 1].focus();
            } else {
                codeLetter.focus();
            }
        }
        
        if (e.key === 'ArrowLeft' && index > 0) {
            codeDigits[index - 1].focus();
        }
        
        if (e.key === 'ArrowRight' && index < codeDigits.length - 1) {
            codeDigits[index + 1].focus();
        }
    });
});

// Повторная отправка кода
resendBtn.addEventListener('click', () => {
    if (resendBtn.disabled) return;
    
    showNotification(getText('codeSent'));
    startCodeTimer();
    codeLetter.value = '';
    codeDigits.forEach(input => input.value = '');
    codeLetter.focus();
});

// Навигация в чатах
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        switchTab(tab);
    });
});

// Открытие чата
document.querySelector('.chat-item').addEventListener('click', openChat);

// Кнопка назад в чате
backToChats.addEventListener('click', closeChat);

// Отправка сообщения
sendMsgBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Выход
logoutBtn.addEventListener('click', () => {
    if (confirm(currentLang === 'ru' ? 'Выйти из аккаунта?' : 'Logout from account?')) {
        clearInterval(codeTimerInterval);
        phoneInput.value = '';
        updatePhoneDisplay();
        showPage('welcome');
    }
});

// ============ ЦИФРОВОЙ ДОЖДЬ ============
function createDigitalRain() {
    const rainContainers = document.querySelectorAll('.digital-rain');
    if (!rainContainers.length) return;
    
    const characters = '01';
    
    setInterval(() => {
        rainContainers.forEach(container => {
            if (!container.closest('.page.active')) return;
            
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
            container.appendChild(rain);
            
            setTimeout(() => {
                if (rain.parentNode) rain.remove();
            }, 5000);
        });
    }, 100);
}

// ============ ЭФФЕКТЫ ============
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

// ============ ИНИЦИАЛИЗАЦИЯ ============
updateAllTexts();
createDigitalRain();
updatePhoneDisplay();

// Наблюдатель за страницами для фокуса
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
            if (mutation.target.id === 'authPage') {
                setTimeout(() => phoneInput.focus(), 300);
            } else if (mutation.target.id === 'codePage') {
                setTimeout(() => codeLetter.focus(), 300);
            }
        }
    });
});

[codePage, authPage].forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
});
