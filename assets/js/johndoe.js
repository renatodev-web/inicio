/* ==========================================
   PORTFOLIO V2 - JavaScript Module
   Renato Guerra - Senior Developer
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar módulos
    NavbarManager.init();
    AnimationManager.init();
    ScrollAnimations.init();
    CounterAnimations.init();
    FormManager.init();
    SmoothScroll.init();
});

/* ==========================================
   NAVBAR MANAGER
   ========================================== */

const NavbarManager = {
    navbar: null,
    scrollThreshold: 100,

    init() {
        this.navbar = document.getElementById('navbar');
        if (this.navbar) {
            document.addEventListener('scroll', () => this.handleScroll());
        }
    },

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
};

/* ==========================================
   ANIMATION MANAGER
   ========================================== */

const AnimationManager = {
    init() {
        this.observeElements();
    },

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observar secciones
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Observar tarjetas
        document.querySelectorAll('.glass-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    },

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }
};

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */

const ScrollAnimations = {
    init() {
        this.observeScrollElements();
    },

    observeScrollElements() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.applyAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Aplicar a elementos específicos
        document.querySelectorAll('h2, h3, p, .stat-box').forEach(el => {
            observer.observe(el);
        });
    },

    applyAnimation(element) {
        if (!element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    }
};

/* ==========================================
   COUNTER ANIMATIONS
   ========================================== */

const CounterAnimations = {
    animated: false,

    init() {
        this.observeCounters();
    },

    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.startCounters();
                    this.animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        const statisticsSection = document.querySelector('.statistics');
        if (statisticsSection) {
            observer.observe(statisticsSection);
        }
    },

    startCounters() {
        const counters = document.querySelectorAll('[data-target]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            this.animateCounter(counter, target);
        });
    },

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 30; // 30 frames
        const duration = 1000; // 1 segundo
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            current = Math.floor(target * progress);

            if (target === 95 || target === 100) {
                element.textContent = current;
            } else if (target === 4) {
                element.textContent = (current / 25).toFixed(1);
            } else {
                element.textContent = '+' + current;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
};

/* ==========================================
   FORM MANAGER
   ========================================== */

const FormManager = {
    init() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validar campos
        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const message = form.querySelector('textarea').value.trim();

        if (!name || !email || !message) {
            this.showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Por favor ingresa un email válido', 'error');
            return;
        }

        // Simular envío (en producción usar un backend)
        this.showMessage('¡Mensaje enviado correctamente! Te contactaré pronto.', 'success');
        form.reset();
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;
        messageEl.textContent = text;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => messageEl.remove(), 300);
        }, 4000);
    }
};

/* ==========================================
   SMOOTH SCROLL
   ========================================== */

const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleScroll(e));
        });
    },

    handleScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Offset para navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Cerrar navbar móvil si está abierto
            const navbar = document.querySelector('.navbar-collapse');
            if (navbar && navbar.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                toggler.click();
            }
        }
    }
};

/* ==========================================
   PERFORMANCE - Lazy Loading
   ========================================== */

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/* ==========================================
   ACCESSIBILITY
   ========================================== */

// Agregar keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Cerrar modales si existen
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.hide();
        });
    }

    // Skip to main content
    if (event.key === 's' && event.ctrlKey) {
        event.preventDefault();
        const mainContent = document.querySelector('main') || document.querySelector('.projects');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

/* ==========================================
   ANIMACIONES KEYFRAME RUNTIME
   ========================================== */

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .form-message {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
        .form-message {
            left: 20px !important;
            right: 20px !important;
        }
    }
`;
document.head.appendChild(style);

/* ==========================================
   PERFORMANCE MONITORING
   ========================================== */

// Web Vitals (Core Web Vitals)
const initWebVitals = () => {
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log('[v0] CLS:', clsValue);
            }
        }
    }).observe({ entryTypes: ['layout-shift'] });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('[v0] LCP:', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('[v0] FID:', entry.processingDuration);
        }
    }).observe({ entryTypes: ['first-input'] });
};

// Inicializar Web Vitals
if ('PerformanceObserver' in window) {
    initWebVitals();
}

/* ==========================================
   UTILIDADES Y HELPERS
   ========================================== */

const Utils = {
    // Detectar device
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Detectar navegador
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'chrome';
        if (ua.includes('Safari')) return 'safari';
        if (ua.includes('Firefox')) return 'firefox';
        return 'unknown';
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Debounce function
    debounce(func, delay) {
        let timeoutId;
        return function() {
            clearTimeout(timeoutId);
            const context = this;
            const args = arguments;
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }
};

console.log('[v0] Portfolio V2 loaded successfully');
console.log('[v0] Browser:', Utils.getBrowser());
console.log('[v0] Mobile:', Utils.isMobile());
