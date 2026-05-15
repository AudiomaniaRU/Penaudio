// =========================================
// 1. ЭФФЕКТ ШАПКИ ПРИ СКРОЛЛЕ
// =========================================
const header = document.getElementById('header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// =========================================
// 2. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
// =========================================
// Работает для многостраничного сайта: определяет текущую страницу по URL
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    // Сравниваем href ссылки с именем текущего файла
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// =========================================
// 3. МОБИЛЬНОЕ МЕНЮ
// =========================================
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        // Блокируем прокрутку фона при открытом меню
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Закрываем меню при клике на любой пункт
    mobileNav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// =========================================
// 4. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ (SCROLL REVEAL)
// =========================================
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Анимация срабатывает только один раз
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// =========================================
// 5. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// 6. ОТПРАВКА ФОРМЫ В GOOGLE ТАБЛИЦЫ
// =========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Вставьте сюда ваш URL из Apps Script (Шаг 2)
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx08qRL-jfIDB6MMA6-oPAMNMALaemvoiNDx2UEJtxL4o0HGJoBP910t36-LDF3pcFv/exec';
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Обходит ограничения CORS Google
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(formData)
            });
            
            submitBtn.textContent = 'Отправлено ✓';
            submitBtn.style.background = '#2a7d4f';
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 4000);
        } catch (err) {
            console.error('Ошибка отправки:', err);
            submitBtn.textContent = 'Ошибка. Попробуйте снова';
            submitBtn.disabled = false;
            setTimeout(() => submitBtn.textContent = originalText, 3000);
        }
    });
}