// js/content-loader.js
// Загружает контент из JSON-файлов и вставляет в HTML по id
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([loadSiteContent(), loadCatalog()]);
        // После вставки динамического контента перезапускаем анимации появления
        initDynamicReveal();
    } catch (error) {
        console.warn('⚠️ Ошибка загрузки контента (проверьте, что запускаете через локальный сервер или Netlify):', error);
    }
});

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
async function loadJSON(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
}

function setHref(id, url) {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
}

// === ЗАГРУЗКА НАСТРОЕК САЙТА ===
async function loadSiteContent() {
    const [home, about, contacts] = await Promise.all([
        loadJSON('content/site_settings/home.json'),
        loadJSON('content/site_settings/about.json'),
        loadJSON('content/site_settings/contacts.json')
    ]);

    if (home) {
        setText('hero-subtitle', home.subtitle);
        setText('hero-title', home.title);
        setText('hero-desc', home.description);
        setText('hero-cta', home.cta_text);
        setHref('hero-cta', home.cta_link);
    }

    if (about) {
        setText('about-subtitle', about.subtitle);
        setText('about-title', about.title);
        setText('about-heading', about.heading);
        setText('about-text1', about.text1);
        setText('about-text2', about.text2);
        renderStats(about.stats);
    }

    if (contacts) {
        setText('contacts-title', contacts.title);
        setText('contacts-intro', contacts.intro);
        setText('contacts-address', contacts.address);
        
        setText('contacts-phone', contacts.phone);
        setHref('contacts-phone', `tel:${contacts.phone.replace(/\s/g, '')}`);
        
        setText('contacts-email', contacts.email);
        setHref('contacts-email', `mailto:${contacts.email}`);
        
        setText('contacts-hours', contacts.hours);
    }
}

// === ЗАГРУЗКА КАТАЛОГА ===
async function loadCatalog() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    const catalog = await loadJSON('content/catalog/index.json');
    if (!catalog?.items) {
        grid.innerHTML = '<p class="catalog-card__desc">Каталог скоро появится.</p>';
        return;
    }

    const items = catalog.items.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    grid.innerHTML = items.map(item => `
        <article class="catalog-card reveal">
            <div class="catalog-card__image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" loading="lazy">` : `<div class="catalog-card__placeholder">Изображение</div>`}
            </div>
            <div class="catalog-card__body">
                <span class="catalog-card__category">${item.category}</span>
                <h2 class="catalog-card__title">${item.title}</h2>
                <p class="catalog-card__desc">${item.description}</p>
                <span class="catalog-card__price">${item.price}</span>
            </div>
        </article>
    `).join('');
}

// === ДИНАМИЧЕСКАЯ СТАТИСТИКА ===
function renderStats(stats) {
    const container = document.getElementById('about-stats');
    if (!container || !Array.isArray(stats)) return;
    container.innerHTML = stats.map(s => `
        <div>
            <span class="about__stat-number">${s.number}</span>
            <span class="about__stat-label">${s.label}</span>
        </div>
    `).join('');
}

// === ПОВТОРНЫЙ ЗАПУСК SCROLL REVEAL ДЛЯ ДИНАМИЧЕСКИХ ЭЛЕМЕНТОВ ===
function initDynamicReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}