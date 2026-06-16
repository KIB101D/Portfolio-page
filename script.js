// Бургер меню
const burger = document.getElementById("burger");
const burgerFixed = document.getElementById("burgerFixed");
const menu = document.querySelector(".nav-menu");
const overlay = document.querySelector(".menu-overlay");

// Перемикач мов
const dropdown = document.querySelector(".language-dropdown");
const dropBtn = document.querySelector(".dropdown-btn");
const dropContent = document.querySelector(".dropdown-content");

if (dropdown && dropBtn && dropContent) {
  // Відкриття / закриття dropdown
  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  dropContent.querySelectorAll("li").forEach((lang) => {
    lang.addEventListener("click", () => {
      const selectedLang = lang.dataset.lang;
      const langLabel =
        selectedLang === "ua" ? "UA" : selectedLang === "pl" ? "PL" : "EN";
      dropBtn.textContent = langLabel + " ▾";
      changeLanguage(selectedLang);
      dropdown.classList.remove("active"); // закриваємо після вибору
    });
  });

  // Закриття dropdown при кліку поза ниім
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  // Додатково: закриття при скролі або тапі на overlay (мобільні)
  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset;
      if (Math.abs(currentScroll - lastScroll) > 5) {
        // 5 пікселів - це безпечний поріг
        dropdown.classList.remove("active");
      }
      lastScroll = currentScroll;
    },
    { passive: true },
  );
}

// Функція для зміни мови
function changeLanguage(lang) {
  console.log("Changing language to:", lang);
  document.documentElement.lang = lang;

  // 1. Оновлюємо заголовок сторінки з об'єкта перекладів
  if (window.translations && window.translations[lang]) {
    document.title = window.translations[lang].meta.title;
  }

  // 2. Підтримка legacy атрибутів (якщо десь в HTML ще залишились data-ua / data-en)
  // Якщо додаси data-pl в HTML, він теж підхопиться
  document.querySelectorAll("[data-ua][data-en]").forEach((element) => {
    const translation = element.getAttribute(`data-${lang}`);
    if (translation) {
      if (
        element.tagName === "SPAN" ||
        element.tagName === "P" ||
        element.tagName === "H1" ||
        element.tagName === "H2" ||
        element.tagName === "A"
      ) {
        element.textContent = translation;
      } else {
        element.innerHTML = translation.replace(/&lt;br&gt;/g, "<br>");
      }
    }
  });

  updateHtmlContent(lang);
  renderPdfPreview(lang);
  localStorage.setItem("preferred-language", lang);

  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}

// Функція для оновлення HTML вмісту (тягнемо об'ємний текст з translations.js)
function updateHtmlContent(lang) {
  if (!window.translations || !window.translations[lang]) return;
  const t = window.translations[lang];

  // ==========================================
  // 0. Meta / lang / language switcher
  // ==========================================
  document.documentElement.lang = lang;

  if (t.meta?.title) {
    document.title = t.meta.title;
  }

  const dropdownBtn = document.querySelector(".dropdown-btn");
  if (dropdownBtn) {
    const labelMap = {
      ua: "UA",
      en: "EN",
      pl: "PL",
    };

    dropdownBtn.textContent = `${labelMap[lang] || "UA"} ▾`;
  }

  // ==========================================
  // 1. Оновлення навігаційного меню
  // ==========================================
  const menuAbout = document.querySelector(".menu-about");
  if (menuAbout && t.nav?.about) menuAbout.textContent = t.nav.about;

  const menuProjects = document.querySelector(".menu-projects");
  if (menuProjects && t.nav?.projects) {
    menuProjects.textContent = t.nav.projects;
  }

  const menuRecs = document.querySelector(".menu-recommendations");
  if (menuRecs && t.nav?.recommendations) {
    menuRecs.textContent = t.nav.recommendations;
  }

  const menuContacts = document.querySelector(".menu-contacts");
  if (menuContacts && t.nav?.contacts) {
    menuContacts.textContent = t.nav.contacts;
  }

  // Підтримка твоєї поточної HTML-структури
  const menuLinks = document.querySelectorAll(".menu-link");
  if (menuLinks.length) {
    menuLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (href === "./index.html" || href === "index.html") {
        link.textContent = t.nav?.about || link.textContent;
      } else if (href === "#portfolio") {
        link.textContent = t.nav?.projects || link.textContent;
      } else if (href === "#recommendation") {
        link.textContent = t.nav?.recommendations || link.textContent;
      } else if (href === "#contacts") {
        link.textContent = t.nav?.contacts || link.textContent;
      }
    });
  }

  // ==========================================
  // 2. Оновлення секції Hero
  // ==========================================
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle && t.hero?.title) heroTitle.textContent = t.hero.title;

  const heroSubtitle = document.querySelector(".hero-subtitle");
  if (heroSubtitle && t.hero?.subtitle) {
    heroSubtitle.innerHTML = t.hero.subtitle;
  }

  const heroCta = document.querySelector(".hero-cta");
  if (heroCta && t.hero?.cta) heroCta.textContent = t.hero.cta;

  // ==========================================
  // 3. Оновлення секції "Про мене"
  // ==========================================
  const aboutTitle = document.querySelector(".about-title");
  if (aboutTitle && t.about?.title) aboutTitle.textContent = t.about.title;

  const aboutText = document.querySelector(".about-text");
  if (aboutText && t.about?.text) aboutText.textContent = t.about.text;

  const aboutSkillsContainer = document.querySelector(".about-skills");
  if (aboutSkillsContainer && t.about?.skills) {
    aboutSkillsContainer.innerHTML = "";
    t.about.skills.forEach((skill) => {
      const span = document.createElement("span");
      span.className = "skill-tag";
      span.textContent = skill;
      aboutSkillsContainer.appendChild(span);
    });
  }

  // ==========================================
  // 4. Оновлення секції "Рекомендації"
  // ==========================================
  const recTitle = document.querySelector(".recommendation-title");
  if (recTitle && t.recommendations?.title) {
    recTitle.textContent = t.recommendations.title;
  }

  const recContainer = document.getElementById("rec-cards-container");
  if (recContainer && t.recommendations?.items) {
    recContainer.innerHTML = t.recommendations.items
      .map(
        (item) => `
      <div class="rec-card">
        <div class="rec-card-header">
          <h3 class="rec-project">${item.project}</h3>
          <p class="rec-tags">${item.tags}</p>
        </div>
        <div class="rec-card-body">
          <p class="rec-quote">${item.quote}</p>
        </div>
        <div class="rec-card-footer">
          <button class="pdf-open-btn" data-pdf="${item.id}">
            <span class="pdf-open-btn-text">${item.btnText}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" stroke-width="2"/>
              <path d="M14 3v5h5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    `,
      )
      .join("");
  }

  // ==========================================
  // 5. Оновлення секції "Портфоліо" / Selected Work
  // ==========================================
  const portfolioTitle = document.querySelector(".portfolio-title");
  if (portfolioTitle && t.projects?.title) {
    portfolioTitle.textContent = t.projects.title;
  }

  const portfolioCtaSpan = document.querySelector(".portfolio-cta span");
  if (portfolioCtaSpan && t.projects?.cta) {
    portfolioCtaSpan.textContent = t.projects.cta;
  }

  // Новий блок для цієї сторінки
  const sectionIdea = document.querySelector(".section-idea");
  if (sectionIdea && t.projects?.title) {
    sectionIdea.textContent = t.projects.title;
  }

  const projectCards = document.querySelectorAll(
    ".selected-work .project-card",
  );
  if (projectCards.length && t.projects?.items) {
    projectCards.forEach((card, index) => {
      const item = t.projects.items[index];
      if (!item) return;

      const identity = card.querySelector(".project-identity");
      if (identity && item.identity) {
        identity.textContent = item.identity;
      }

      const name = card.querySelector(".project-name");
      if (name && item.title) {
        name.textContent = item.title;
      }

      const description = card.querySelector(".project-description");
      if (description && item.description) {
        description.textContent = item.description;
      }

      const overlayBtns = card.querySelectorAll(
        ".project-overlay .overlay-btn",
      );
      if (overlayBtns[0] && item.buttons?.demo) {
        overlayBtns[0].textContent = item.buttons.demo;
      }
      if (overlayBtns[1] && item.buttons?.github) {
        overlayBtns[1].textContent = item.buttons.github;
      }

      const stackContainer = card.querySelector(".stack-pills");
      if (stackContainer && Array.isArray(item.stack)) {
        stackContainer.innerHTML = "";
        item.stack.forEach((tech) => {
          const span = document.createElement("span");
          span.className = "pill";
          span.textContent = tech;
          stackContainer.appendChild(span);
        });
      }
    });
  }

  // ==========================================
  // 6. Оновлення Футера та Доступності
  // ==========================================
  const copyright = document.querySelector(".copyright");
  if (copyright && t.footer?.copyright) {
    copyright.innerHTML = t.footer.copyright;
  }

  const scrollToTop = document.getElementById("scrollToTop");
  if (scrollToTop && t.accessibility?.scrollTop) {
    scrollToTop.setAttribute("aria-label", t.accessibility.scrollTop);
  }

  // Оновлення mail notifications
  const emailLink = document.getElementById("email-link");
  if (emailLink && t.notification?.emailCopied) {
    emailLink.setAttribute("data-toast-text", t.notification.emailCopied);
  }
}

// Ініціалізація мови при завантаженні
document.addEventListener("DOMContentLoaded", function () {
  const savedLanguage = localStorage.getItem("preferred-language") || "ua";
  const dropBtn = document.querySelector(".dropdown-btn");
  if (dropBtn) {
    const langLabel =
      savedLanguage === "ua" ? "UA" : savedLanguage === "pl" ? "PL" : "EN";
    dropBtn.textContent = langLabel + " ▾";
  }
  changeLanguage(savedLanguage);
});

// Функція переключення меню
function toggleMenu() {
  const isActive = menu.classList.contains("active");

  if (burger) burger.classList.toggle("active", !isActive);
  if (burgerFixed) burgerFixed.classList.toggle("active", !isActive);

  menu.classList.toggle("active");
  overlay.classList.toggle("active");

  // Додаємо/видаляємо клас замість прямого стилю
  document.body.classList.toggle("menu-open", !isActive);
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
  const menuLinks = menu.querySelectorAll(".menu-link");
  menuLinks.forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });
}

// Закриття меню при зміні розміру вікна
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && menu && menu.classList.contains("active")) {
    toggleMenu();
  }
});

// Закриття меню при натисканні Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu && menu.classList.contains("active")) {
    toggleMenu();
  }
});

// Оптимізація анімацій
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".hero-title, .hero-subtitle, .hero-cta",
  );

  animatedElements.forEach((element) => {
    element.style.willChange = "transform, opacity";
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      animatedElements.forEach((element) => {
        const animation = element.style.animation;
        element.style.animation = "none";
        setTimeout(() => {
          element.style.animation = animation;
        }, 10);
      });
    }
  });
});

// Плавний скрол для якірних посилань
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.classList.contains("menu-link")) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        if (menu && menu.classList.contains("active")) {
          toggleMenu();
        }

        setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }
    });
  });
}

// Анімація вулканічної лампи
function initLavaLamp() {
  const container = document.querySelector(".lamp-container");
  const lamp = document.querySelector(".lava-lamp");
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (!container || !lamp) {
    console.log("Елементи лави не знайдені, пропускаємо ініціалізацію");
    return;
  }

  let blobs = [];
  let animationId;
  let isVisible = true;

  function createBlobs() {
    container.innerHTML = "";
    blobs = [];
    const blobCount = isMobile ? 3 : 5;

    // Оновлені мобільні конфіги: велика амплітуда (200-300px) та адекватна швидкість
    const mobileConfigs = [
      {
        size: 140,
        left: 10,
        bottom: 5,
        xAmplitude: 35,
        yAmplitude: 280,
        speed: 0.6,
        xDirection: 1,
        yDirection: -1,
        color: "#ff5e00",
      },
      {
        size: 110,
        left: 60,
        bottom: 15,
        xAmplitude: 25,
        yAmplitude: 220,
        speed: 0.8,
        xDirection: -1,
        yDirection: 1,
        color: "#ff8c00",
      },
      {
        size: 120,
        left: 35,
        bottom: 10,
        xAmplitude: 30,
        yAmplitude: 250,
        speed: 0.7,
        xDirection: -1,
        yDirection: 1,
        color: "#ff5e00",
      },
    ];

    for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement("div");
      blob.className = "blob";
      const mobileConfig = mobileConfigs[i];

      const size = isMobile ? mobileConfig.size : 50 + Math.random() * 70;
      const left = isMobile ? mobileConfig.left : 10 + Math.random() * 80;
      const bottom = isMobile ? mobileConfig.bottom : Math.random() * 20;

      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      blob.style.left = `${left}%`;
      blob.style.bottom = `${bottom}%`;

      if (isMobile) {
        blob.style.color = mobileConfig.color; // Передаємо колір для currentColor в CSS
      }

      container.appendChild(blob);

      blobs.push({
        element: blob,
        speed: isMobile ? mobileConfig.speed : 0.5 + Math.random() * 1.5,
        xDirection: isMobile
          ? mobileConfig.xDirection
          : Math.random() > 0.5
            ? 1
            : -1,
        yDirection: isMobile
          ? mobileConfig.yDirection
          : Math.random() > 0.5
            ? 1
            : -1,
        xAmplitude: isMobile
          ? mobileConfig.xAmplitude
          : 0.5 + Math.random() * 2,
        yAmplitude: isMobile ? mobileConfig.yAmplitude : 1 + Math.random() * 3,
      });
    }
  }

  function updateBlobs() {
    const time = performance.now() * 0.001;

    blobs.forEach((blob, index) => {
      const x =
        Math.sin(time * blob.speed + index) * blob.xAmplitude * blob.xDirection;
      const y =
        Math.cos(time * blob.speed * 0.7 + index) *
        blob.yAmplitude *
        blob.yDirection;

      blob.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    animationId = requestAnimationFrame(updateBlobs);
  }

  // DESKTOP інтерактив (mousemove) залишаємо без змін
  if (!isMobile) {
    lamp.addEventListener("mousemove", (e) => {
      const rect = lamp.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      blobs.forEach((blob, index) => {
        const sensitivity = 0.3 + index * 0.1;
        const offsetX = x * 15 * sensitivity;
        const offsetY = y * 15 * sensitivity;
        blob.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });
    });
  }

  createBlobs();

  // Керування запуском анімації без дублювання
  if (isMobile) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          cancelAnimationFrame(animationId);
          updateBlobs();
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      {
        rootMargin: "50px",
      },
    );

    observer.observe(lamp);
  } else {
    updateBlobs();
  }

  function handleResize() {
    if (window.innerWidth > 1200) {
      createBlobs();
    }
  }

  if (window.innerWidth > 1200) {
    window.addEventListener("resize", handleResize);
  }
}

// Управління хедером та кнопкою "Нагору"
function initScrollEffects() {
  const header = document.querySelector(".header");
  const scrollToTopBtn = document.getElementById("scrollToTop");
  const hero = document.querySelector(".hero");

  if (!header) return;

  let lastScrollY = window.scrollY;
  let heroHeight = hero ? hero.offsetHeight : 500;
  let ticking = false;
  const scrollDelta = 8; // Невеликий поріг, щоб не було мікросіпань

  window.addEventListener(
    "resize",
    () => {
      heroHeight = hero ? hero.offsetHeight : 500;
    },
    { passive: true },
  );

  function updateDOM() {
    const currentScrollY = Math.max(0, window.scrollY);
    const isMenuActive = menu && menu.classList.contains("active");

    // Якщо відкрите мобільне меню, шапку ховати не можна
    if (isMenuActive) {
      header.classList.remove("hidden");
      ticking = false;
      return;
    }

    // Перевіряємо скрол з урахуванням дельти
    if (Math.abs(currentScrollY - lastScrollY) >= scrollDelta) {
      // Скрол вниз і ми вже від'їхали від верху сторінки -> ХОВАЄМО
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add("hidden");
      }
      // Скрол вгору -> ПОКАЗУЄМО (просто прибираємо клас hidden)
      else if (currentScrollY < lastScrollY) {
        header.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
    }

    // Захист: на самому верху сторінки шапка ЗАВЖДИ має бути у вихідному стані
    if (currentScrollY <= 50) {
      header.classList.remove("hidden");
    }

    // Кнопка "Нагору"
    if (scrollToTopBtn) {
      const shouldShowTopBtn = currentScrollY > heroHeight * 0.5;
      if (scrollToTopBtn.classList.contains("visible") !== shouldShowTopBtn) {
        scrollToTopBtn.classList.toggle("visible", shouldShowTopBtn);
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateDOM);
      ticking = true;
    }
  }

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateDOM();
}

// Анімація секцій при скролі з Intersection Observer
let sectionObserver = null;

function initScrollAnimations() {
  const animatedSections = document.querySelectorAll(
    ".about-section, .recommendation-section, .portfolio-section, .footer",
  );

  console.log("Знайдено секцій для анімації:", animatedSections.length);

  if (animatedSections.length === 0) return;

  if (sectionObserver) {
    sectionObserver.disconnect();
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  sectionObserver = new IntersectionObserver((entries) => {
    console.log("Intersection Observer спрацював:", entries.length);

    entries.forEach((entry) => {
      console.log(
        `Секція ${entry.target.id}: isIntersecting = ${entry.isIntersecting}`,
      );

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        console.log(`Додано клас 'visible' для ${entry.target.id}`);

        if (entry.target.classList.contains("about-section")) {
          const skillTags = entry.target.querySelectorAll(".skill-tag");
          console.log(`Анімую ${skillTags.length} навичок`);
          skillTags.forEach((tag, index) => {
            setTimeout(() => {
              tag.classList.add("animated");
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  animatedSections.forEach((section) => {
    console.log(`Спостерігаємо за секцією: ${section.id}`);
    sectionObserver.observe(section);
  });
}

// Анімація обертання кілець
function initRingAnimation() {
  const largeRing = document.querySelector(".large-ring");
  const smallRing = document.querySelector(".small-ring");
  let angle = 0;

  console.log("initRingAnimation started", largeRing, smallRing);

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

  window.addEventListener("scroll", checkScroll, { passive: false });
}

// Корекція позиції планет на ресайз
function fixPlanetPosition() {
  const planet = document.querySelector(".planet");
  const rings = document.querySelectorAll(".ring");

  function updatePosition() {
    const viewportWidth = window.innerWidth;

    if (viewportWidth < 768) {
      if (planet) {
        planet.style.width = "1000px";
        planet.style.height = "500px";
      }
      rings.forEach((ring) => {
        if (ring.classList.contains("large-ring")) {
          ring.style.width = "750px";
          ring.style.height = "750px";
          ring.style.marginLeft = "-375px";
          ring.style.marginTop = "-500px";
        }
        if (ring.classList.contains("small-ring")) {
          ring.style.width = "900px";
          ring.style.height = "900px";
          ring.style.marginLeft = "-450px";
          ring.style.marginTop = "-450px";
        }
      });
    }
  }

  window.addEventListener("resize", updatePosition);
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
document.addEventListener("DOMContentLoaded", function () {
  initAll();
});

// Запасний спосіб ініціалізації
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  setTimeout(initAll, 100);
}

// Кастомний курсор
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector(".animated-cursor");
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
        this.cursor.style.display = "none";
      }
      document.documentElement.style.cursor = "auto";
    }
  }

  checkDeviceType() {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const screenWidth = window.innerWidth;
    const isDesktopSize = screenWidth >= 1200;
    const isTabletSize = screenWidth >= 768 && screenWidth < 1200;

    this.isEnabled = isDesktopSize && !isTouchDevice;

    console.log(`Cursor enabled: ${this.isEnabled}`, {
      isTouchDevice,
      screenWidth,
      isDesktopSize,
      isTabletSize,
    });
  }

  bindEvents() {
    if (!this.isEnabled) return;

    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateCursorPosition();

      const speed = Math.sqrt(
        Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2),
      );
      if (speed > 20) {
        this.cursor.classList.add("fast-move");
      } else {
        this.cursor.classList.remove("fast-move");
      }
    });

    document.addEventListener("mousedown", () => {
      this.cursor.classList.add("click");
    });

    document.addEventListener("mouseup", () => {
      this.cursor.classList.remove("click");
    });

    this.handleHoverEffects();

    document.addEventListener("mouseleave", () => {
      this.cursor.style.opacity = "0.5";
    });

    document.addEventListener("mouseenter", () => {
      this.cursor.style.opacity = "1";
    });

    window.addEventListener("resize", () => {
      this.checkDeviceType();
      if (!this.isEnabled && this.cursor) {
        this.cursor.style.display = "none";
        document.documentElement.style.cursor = "auto";
      }
    });
  }

  updateCursorPosition() {
    if (!this.isEnabled) return;
    this.cursor.style.left = this.mouse.x + "px";
    this.cursor.style.top = this.mouse.y + "px";
  }

  handleHoverEffects() {
    if (!this.isEnabled) return;

    const hoverElements = document.querySelectorAll(
      "a, button, [data-cursor-hover]",
    );
    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, [data-cursor-text]",
    );

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        this.cursor.classList.add("hover");
      });

      el.addEventListener("mouseleave", () => {
        this.cursor.classList.remove("hover");
      });
    });

    textElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        this.cursor.classList.add("text-hover");
      });

      el.addEventListener("mouseleave", () => {
        this.cursor.classList.remove("text-hover");
      });
    });
  }

  animate() {
    if (!this.isEnabled) return;
    this.raf = requestAnimationFrame(() => this.animate());
  }
}

// Ініціалізація кастомного курсору
document.addEventListener("DOMContentLoaded", () => {
  new CustomCursor();
});

// Функція для відображення прев’ю PDF
function renderPdfPreview(lang = "ua") {
  const pdfUrl =
    lang === "ua"
      ? "assets/recommendation-full.pdf"
      : "assets/recommendation-full-en.pdf";

  console.log("Loading PDF for language:", lang, "URL:", pdfUrl);

  const canvas = document.getElementById("pdf-preview");

  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  canvas.style.display = "none";
  const container = canvas.parentElement;

  const existingLoading = container.querySelector(".pdf-loading");
  if (existingLoading) {
    existingLoading.remove();
  }

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "pdf-loading";
  loadingDiv.textContent = window.translations
    ? window.translations[lang].recommendations.pdfLoading
    : "Loading...";
  container.appendChild(loadingDiv);

  pdfjsLib
    .getDocument(pdfUrl)
    .promise.then((pdf) => {
      console.log("PDF loaded successfully, total pages:", pdf.numPages);
      return pdf.getPage(1);
    })
    .then((page) => {
      console.log("First page loaded");
      loadingDiv.remove();
      canvas.style.display = "block";

      const viewport = page.getViewport({ scale: 1.5 });
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      return page.render(renderContext).promise;
    })
    .then(() => {
      console.log("PDF rendered successfully");
    })
    .catch((error) => {
      console.error("Error rendering PDF:", error);
      // Беремо текст помилки з перекладів
      loadingDiv.textContent = window.translations
        ? window.translations[lang].recommendations.pdfError
        : "Error loading PDF";

      setTimeout(() => {
        loadingDiv.remove();
        showPdfFallback(container, lang);
      }, 2000);
    });
}

// Функція для відкриття повного PDF
function openFullPdf(lang = "ua", pdfId = "student") {
  let pdfUrl = "";

  if (pdfId === "dma") {
    // Новий лист DMA EU
    pdfUrl =
      lang === "ua"
        ? "assets/DMA_EU_recomend_UA.pdf"
        : "assets/DMA_EU_recomend_EN.pdf";
  } else {
    // Старий лист StudentAbroad
    pdfUrl =
      lang === "ua"
        ? "assets/recommendation-full.pdf"
        : "assets/recommendation-full-en.pdf";
  }

  console.log("Opening PDF:", pdfUrl);
  try {
    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error("Error opening PDF:", error);
  }
}

// Делегування подій для кнопок PDF
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".pdf-open-btn");
  if (btn) {
    const currentLang = localStorage.getItem("preferred-language") || "ua";
    const pdfId = btn.getAttribute("data-pdf"); // Отримуємо 'student' або 'dma'
    openFullPdf(currentLang, pdfId);
  }
});

// Делегування подій для кнопки PDF
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("pdf-open-btn") ||
    e.target.closest(".pdf-open-btn")
  ) {
    const currentLang = localStorage.getItem("preferred-language") || "ua";
    openFullPdf(currentLang);
  }
});

// Функція для копіювання email
function copyEmailToClipboard() {
  const email = "boiko.klymentii.ua@gmail.com";

  return navigator.clipboard.writeText(email).catch((err) => {
    const textArea = document.createElement("textarea");
    textArea.value = email;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  });
}

// Функція для створення та показу тост-повідомлення
// Функція для показу повідомлення
function showNotification(message) {
  // 1. Перевіряємо, чи додані ключові кадри для анімації. Якщо ні — додаємо їх в документ.
  if (!document.getElementById("toast-animation-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "toast-animation-styles";
    styleSheet.textContent = `
      @keyframes toastSlideIn {
        from {
          opacity: 0;
          transform: translate3d(50px, 0, 0) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      @keyframes toastSlideOut {
        from {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
        to {
          opacity: 0;
          transform: translate3d(30px, -10px, 0) scale(0.9);
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  const notification = document.createElement("div");
  notification.className = "copy-notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: rgba(10, 10, 10, 0.65);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-left: 4px solid #ff6b35;
        color: #f5f7fa;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 1.3rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.5),
          0 0 30px rgba(255, 107, 53, 0.1);
        z-index: 10000;
        opacity: 0; /* Стартуємо з нуля, анімація сама виведе в 1 */
        transform: translate3d(50px, 0, 0) scale(0.95);
        animation: toastSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation =
      "toastSlideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 400);
  }, 3000);
}

// Обробник кліку для кнопки пошти
document.addEventListener("DOMContentLoaded", function () {
  const emailLink = document.getElementById("email-link");

  if (emailLink) {
    emailLink.addEventListener("click", async function (e) {
      e.preventDefault();

      // Спочатку копіюємо пошту в буфер
      await copyEmailToClipboard();

      // Беремо вже готовий, перекладений текст з атрибуту, який туди поклала updateHtmlContent
      const message = this.getAttribute("data-toast-text") || "Email copied!";

      // Показуємо правильну перекладену нотифікацію
      showNotification(message);
    });
  }
});

// Анімація появи футера
function initFooterAnimation() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  observer.observe(footer);
}
const isTouchDevice = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

if (isTouchDevice) {
  const previews = document.querySelectorAll(".project-preview");

  previews.forEach((preview) => {
    preview.addEventListener("click", (e) => {
      const clickedBtn = e.target.closest(".overlay-btn");
      const isOpen = preview.classList.contains("is-open");

      // 1. Якщо картка відкрита і клікнули ЧІТКО по кнопці
      if (clickedBtn && isOpen) {
        e.stopPropagation(); // СТОП! Не даємо події йти до document чи закривати картку
        return; // Браузер чисто і спокійно переходить за посиланням <a>
      }

      // 2. Якщо картка закрита — першим тапом просто відкриваємо її
      if (!isOpen) {
        e.preventDefault();
        e.stopPropagation();

        // Закриваємо всі інші відкриті картки
        document.querySelectorAll(".project-preview.is-open").forEach((p) => {
          p.classList.remove("is-open");
        });

        preview.classList.add("is-open");
        return;
      }

      // 3. Другий тап МИМО кнопки (по фону картинки) -> закриваємо оверлей
      // Додаємо жорстку перевірку: закривати ТІЛЬКИ якщо тапнули не по кнопці і не по оверлею з кнопками
      if (isOpen && !clickedBtn && !e.target.closest(".project-overlay")) {
        e.preventDefault();
        preview.classList.remove("is-open");
      }
    });
  });

  // Клік на будь-яке порожнє місце екрану закриває відкриті картки
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".project-preview")) {
      document.querySelectorAll(".project-preview.is-open").forEach((p) => {
        p.classList.remove("is-open");
      });
    }
  });
}
