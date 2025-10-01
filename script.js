// Бургер меню
const burger = document.getElementById("burger");
const burgerFixed = document.getElementById("burgerFixed");
const menu = document.querySelector(".nav-menu");
const overlay = document.querySelector(".menu-overlay");

// Перемикач мов
const dropdown = document.querySelector('.language-dropdown');
const dropBtn = document.querySelector('.dropdown-btn');
const dropContent = document.querySelector('.dropdown-content');

if (dropdown && dropBtn && dropContent) {
    // Відкриття / закриття dropdown
    dropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Вибір мови
    dropContent.querySelectorAll('li').forEach(lang => {
        lang.addEventListener('click', () => {
            const selectedLang = lang.dataset.lang;
            dropBtn.textContent = (selectedLang === 'ua' ? 'UA' : 'EN') + ' ▾';
            changeLanguage(selectedLang);
            dropdown.classList.remove('active'); // закриваємо після вибору
        });
    });

    // Закриття dropdown при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Додатково: закриття при скролі або тапі на overlay (мобільні)
    window.addEventListener('scroll', () => dropdown.classList.remove('active'), { passive: true });
    document.addEventListener('touchstart', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}


// Функція для зміни мови
function changeLanguage(lang) {
    console.log('Changing language to:', lang);

    document.documentElement.lang = lang;
    updateHtmlContent(lang);
    renderPdfPreview(lang);

    document.querySelectorAll('[data-ua][data-en]').forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            const currentClasses = element.className;
            if (element.tagName === 'SPAN' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'A') {
                element.textContent = translation;
            } else {
                element.innerHTML = translation.replace(/&lt;br&gt;/g, '<br>');
            }
            element.className = currentClasses;
        }
    });

    const title = document.querySelector('title');
    if (title) {
        title.textContent = title.getAttribute(`data-${lang}`);
    }

    updateHtmlContent(lang);
    localStorage.setItem('preferred-language', lang);

    setTimeout(() => {
        initScrollAnimations();
    }, 100);
}

// Функція для оновлення HTML вмісту
function updateHtmlContent(lang) {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const translation = heroSubtitle.getAttribute(`data-${lang}`);
        if (translation) {
            const currentClasses = heroSubtitle.className;
            heroSubtitle.innerHTML = translation.replace(/&lt;br&gt;/g, '<br>');
            heroSubtitle.className = currentClasses;
        }
    }

    const recommendationContent = document.querySelector('.text-scroller-content > div');
    if (recommendationContent) {
        const translation = recommendationContent.getAttribute(`data-${lang}`);
        if (translation) {
            const currentClasses = recommendationContent.className;
            recommendationContent.innerHTML = translation.replace(/&lt;br&gt;/g, '<br>');
            recommendationContent.className = currentClasses;
        }
    }
}

// Ініціалізація мови при завантаженні
document.addEventListener('DOMContentLoaded', function () {
    const savedLanguage = localStorage.getItem('preferred-language') || 'ua';
    const dropBtn = document.querySelector('.dropdown-btn');
    if (dropBtn) {
        dropBtn.textContent = (savedLanguage === 'ua' ? 'UA' : 'EN') + ' ▾';
    }
    changeLanguage(savedLanguage);
});

// Функція переключення меню
function toggleMenu() {
    const isActive = menu.classList.contains('active');

    if (burger) burger.classList.toggle("active", !isActive);
    if (burgerFixed) burgerFixed.classList.toggle("active", !isActive);

    menu.classList.toggle("active");
    overlay.classList.toggle("active");

    // Додаємо/видаляємо клас замість прямого стилю
    document.body.classList.toggle('menu-open', !isActive);
}

// Бургер меню обробники
if (burger) {
    burger.addEventListener("click", toggleMenu);
}

if (burgerFixed) {
    burgerFixed.addEventListener("click", toggleMenu);
}

if (overlay) {
    overlay.addEventListener("click", toggleMenu);
}

// Закриття меню по кліку на посилання
if (menu) {
    const menuLinks = menu.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// Закриття меню при зміні розміру вікна
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu && menu.classList.contains('active')) {
        toggleMenu();
    }
});

// Закриття меню при натисканні Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
        toggleMenu();
    }
});

// Оптимізація анімацій
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');

    animatedElements.forEach(element => {
        element.style.willChange = 'transform, opacity';
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            animatedElements.forEach(element => {
                const animation = element.style.animation;
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = animation;
                }, 10);
            });
        }
    });
});

// Плавний скрол для якірних посилань
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.classList.contains('menu-link')) {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (menu && menu.classList.contains('active')) {
                    toggleMenu();
                }

                setTimeout(() => {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });
}

// Анімація вулканічної лампи
function initLavaLamp() {
    const container = document.querySelector('.lamp-container');
    const lamp = document.querySelector('.lava-lamp');

    if (!container || !lamp) {
        console.log('Елементи лави не знайдені, пропускаємо ініціалізацію');
        return;
    }

    let blobs = [];

    function createBlobs() {
        container.innerHTML = '';
        blobs = [];

        for (let i = 0; i < 5; i++) {
            const blob = document.createElement('div');
            blob.className = 'blob';

            const size = 50 + Math.random() * 70;
            const left = 10 + Math.random() * 80;
            const bottom = Math.random() * 20;

            blob.style.width = `${size}px`;
            blob.style.height = `${size}px`;
            blob.style.left = `${left}%`;
            blob.style.bottom = `${bottom}%`;

            container.appendChild(blob);
            blobs.push({
                element: blob,
                speed: 0.5 + Math.random() * 1.5,
                xDirection: Math.random() > 0.5 ? 1 : -1,
                yDirection: Math.random() > 0.5 ? 1 : -1,
                xAmplitude: 0.5 + Math.random() * 2,
                yAmplitude: 1 + Math.random() * 3
            });
        }
    }

    function updateBlobs() {
        const time = Date.now() * 0.001;

        blobs.forEach(blob => {
            const x = Math.sin(time * blob.speed) * blob.xAmplitude * blob.xDirection;
            const y = Math.cos(time * blob.speed * 0.7) * blob.yAmplitude * blob.yDirection;

            blob.element.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(updateBlobs);
    }

    lamp.addEventListener('mousemove', (e) => {
        const rect = lamp.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        blobs.forEach((blob, index) => {
            const sensitivity = 0.3 + (index * 0.1);
            const offsetX = x * 15 * sensitivity;
            const offsetY = y * 15 * sensitivity;

            const currentTransform = blob.element.style.transform;
            blob.element.style.transform = `${currentTransform} translate(${offsetX}px, ${offsetY}px)`;
        });
    });

    lamp.addEventListener('mouseleave', () => {
        // Не потрібно скидати, оскільки анімація продовжується
    });

    createBlobs();
    updateBlobs();

    function handleResize() {
        if (window.innerWidth > 1200) {
            createBlobs();
        }
    }

    if (window.innerWidth > 1200) {
        window.addEventListener('resize', handleResize);
    }
}

// Управління хедером та кнопкою "Нагору"
function initScrollEffects() {
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        const isMenuActive = menu.classList.contains('active');

        if (isMenuActive) return;

        if (currentScrollY > heroHeight * 0.3) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('hidden');
                header.classList.remove('visible');
            } else {
                header.classList.remove('hidden');
                header.classList.add('visible');
            }
        } else {
            header.classList.remove('hidden', 'visible');
        }

        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', currentScrollY > heroHeight * 0.5);
        }

        lastScrollY = currentScrollY;
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();
}

// Анімація секцій при скролі з Intersection Observer
let sectionObserver = null;

function initScrollAnimations() {
    const animatedSections = document.querySelectorAll('.about-section, .recommendation-section, .portfolio-section, .footer');

    console.log('Знайдено секцій для анімації:', animatedSections.length);

    if (animatedSections.length === 0) return;

    if (sectionObserver) {
        sectionObserver.disconnect();
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    sectionObserver = new IntersectionObserver((entries) => {
        console.log('Intersection Observer спрацював:', entries.length);

        entries.forEach(entry => {
            console.log(`Секція ${entry.target.id}: isIntersecting = ${entry.isIntersecting}`);

            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log(`Додано клас 'visible' для ${entry.target.id}`);

                if (entry.target.classList.contains('about-section')) {
                    const skillTags = entry.target.querySelectorAll('.skill-tag');
                    console.log(`Анімую ${skillTags.length} навичок`);
                    skillTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.classList.add('animated');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        console.log(`Спостерігаємо за секцією: ${section.id}`);
        sectionObserver.observe(section);
    });
}

// Анімація обертання кілець
function initRingAnimation() {
    const largeRing = document.querySelector('.large-ring');
    const smallRing = document.querySelector('.small-ring');
    let angle = 0;

    console.log('initRingAnimation started', largeRing, smallRing);

    function animate() {
        if (largeRing && smallRing) {
            angle += 0.001;
            largeRing.style.transform = `rotate(${angle}rad)`;
            smallRing.style.transform = `rotate(${angle * -1.5}rad)`;
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// Обмеження горизонтального скролу
function preventHorizontalScroll() {
    let lastScrollLeft = window.pageXOffset;

    function checkScroll() {
        const currentScrollLeft = window.pageXOffset;

        if (currentScrollLeft !== 0) {
            window.scrollTo(0, window.pageYOffset);
        }

        lastScrollLeft = currentScrollLeft;
    }

    window.addEventListener('scroll', checkScroll, { passive: false });
}

// Корекція позиції планет на ресайз
function fixPlanetPosition() {
    const planet = document.querySelector('.planet');
    const rings = document.querySelectorAll('.ring');

    function updatePosition() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth < 768) {
            if (planet) {
                planet.style.width = '1000px';
                planet.style.height = '500px';
            }
            rings.forEach(ring => {
                if (ring.classList.contains('large-ring')) {
                    ring.style.width = '750px';
                    ring.style.height = '750px';
                    ring.style.marginLeft = '-375px';
                    ring.style.marginTop = '-500px';
                }
                if (ring.classList.contains('small-ring')) {
                    ring.style.width = '900px';
                    ring.style.height = '900px';
                    ring.style.marginLeft = '-450px';
                    ring.style.marginTop = '-450px';
                }
            });
        }
    }

    window.addEventListener('resize', updatePosition);
    updatePosition();
}

// Головна функція ініціалізації
function initAll() {
    initLavaLamp();
    initScrollEffects();
    initSmoothScroll();
    initScrollAnimations();
    preventHorizontalScroll();
    fixPlanetPosition();
    initRingAnimation();
}

// Ініціалізація при завантаженні DOM
document.addEventListener('DOMContentLoaded', function () {
    initAll();
});

// Запасний спосіб ініціалізації
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    setTimeout(initAll, 100);
}

// Кастомний курсор
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.animated-cursor');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.raf = null;
        this.isEnabled = false;

        this.init();
    }

    init() {
        this.checkDeviceType();

        if (this.isEnabled) {
            this.bindEvents();
            this.animate();
        } else {
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
            document.documentElement.style.cursor = 'auto';
        }
    }

    checkDeviceType() {
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const screenWidth = window.innerWidth;
        const isDesktopSize = screenWidth >= 1200;
        const isTabletSize = screenWidth >= 768 && screenWidth < 1200;

        this.isEnabled = isDesktopSize && !isTouchDevice;

        console.log(`Cursor enabled: ${this.isEnabled}`, {
            isTouchDevice,
            screenWidth,
            isDesktopSize,
            isTabletSize
        });
    }

    bindEvents() {
        if (!this.isEnabled) return;

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateCursorPosition();

            const speed = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
            if (speed > 20) {
                this.cursor.classList.add('fast-move');
            } else {
                this.cursor.classList.remove('fast-move');
            }
        });

        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        });

        this.handleHoverEffects();

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0.5';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });

        window.addEventListener('resize', () => {
            this.checkDeviceType();
            if (!this.isEnabled && this.cursor) {
                this.cursor.style.display = 'none';
                document.documentElement.style.cursor = 'auto';
            }
        });
    }

    updateCursorPosition() {
        if (!this.isEnabled) return;
        this.cursor.style.left = this.mouse.x + 'px';
        this.cursor.style.top = this.mouse.y + 'px';
    }

    handleHoverEffects() {
        if (!this.isEnabled) return;

        const hoverElements = document.querySelectorAll('a, button, [data-cursor-hover]');
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, [data-cursor-text]');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });

        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('text-hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('text-hover');
            });
        });
    }

    animate() {
        if (!this.isEnabled) return;
        this.raf = requestAnimationFrame(() => this.animate());
    }
}

// Ініціалізація кастомного курсору
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});

// Функція для відображення прев’ю PDF
function renderPdfPreview(lang = 'ua') {
    const pdfUrl = lang === 'ua'
        ? 'assets/recommendation-full.pdf'
        : 'assets/recommendation-full-en.pdf';

    console.log('Loading PDF for language:', lang, 'URL:', pdfUrl);

    const canvas = document.getElementById('pdf-preview');

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    canvas.style.display = 'none';
    const container = canvas.parentElement;

    const existingLoading = container.querySelector('.pdf-loading');
    if (existingLoading) {
        existingLoading.remove();
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'pdf-loading';
    loadingDiv.textContent = lang === 'ua' ? 'Завантаження PDF' : 'Loading PDF';
    container.appendChild(loadingDiv);

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        console.log('PDF loaded successfully, total pages:', pdf.numPages);
        return pdf.getPage(1);
    }).then(page => {
        console.log('First page loaded');
        loadingDiv.remove();
        canvas.style.display = 'block';

        const viewport = page.getViewport({ scale: 1.5 });
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        return page.render(renderContext).promise;
    }).then(() => {
        console.log('PDF rendered successfully');
    }).catch(error => {
        console.error('Error rendering PDF:', error);
        loadingDiv.textContent = lang === 'ua' ? 'Помилка завантаження PDF' : 'Error loading PDF';

        setTimeout(() => {
            loadingDiv.remove();
            showPdfFallback(container, lang);
        }, 2000);
    });
}

// Функція для відкриття повного PDF
function openFullPdf(lang = 'ua') {
    const pdfUrl = lang === 'ua'
        ? 'assets/recommendation-full.pdf'
        : 'assets/recommendation-full-en.pdf';
    console.log('Attempting to open PDF:', pdfUrl, 'Language:', lang);
    try {
        window.open(pdfUrl, '_blank');
        console.log('PDF opened successfully');
    } catch (error) {
        console.error('Error opening PDF:', error);
    }
}

// Fallback якщо PDF не завантажився
function showPdfFallback(container, lang = 'ua') {
    const title = lang === 'ua' ? 'Рекомендаційний лист' : 'Recommendation Letter';
    const buttonText = lang === 'ua' ? 'Відкрити PDF' : 'Open PDF';

    container.innerHTML = `
        <div class="pdf-fallback">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke-width="2"/>
                <path d="M14 3v5h5" stroke-width="2"/>
            </svg>
            <p>${title}</p>
            <button class="pdf-open-btn">${buttonText}</button>
        </div>
    `;
}

// Делегування подій для кнопки PDF
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('pdf-open-btn') || e.target.closest('.pdf-open-btn')) {
        const currentLang = localStorage.getItem('preferred-language') || 'ua';
        openFullPdf(currentLang);
    }
});

// Функція для копіювання email
function copyEmailToClipboard() {
    const email = 'boiko.klymentii.ua@gmail.com';

    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email скопійовано в буфер обміну!');
    }).catch(err => {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Email скопійовано в буфер обміну!');
    });
}

// Функція для показу повідомлення
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 107, 53, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 1.4rem;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ініціалізація email копіювання та футера
document.addEventListener('DOMContentLoaded', function () {
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();
            copyEmailToClipboard();
        });
    }

    initFooterAnimation();
});

// Анімація появи футера
function initFooterAnimation() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(footer);
}
