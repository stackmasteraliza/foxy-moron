// ============================================
// FoxyMoron - JavaScript Animations & Interactions
// ============================================
// Version: 1.0.0
// Author: FoxyMoron Development Team

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    CustomCursor.init();
    Navigation.init();
    ScrollAnimations.init();
    CounterAnimation.init();
    ParallaxEffects.init();
    FormHandler.init();
});

// ============================================
// Preloader Module
// ============================================
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        const progressFill = document.querySelector('.progress-fill');
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    document.body.style.overflow = 'visible';
                }, 500);
            }
            progressFill.style.width = `${progress}%`;
        }, 150);

        // Fallback - ensure preloader is hidden after max time
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'visible';
        }, 3000);
    }
};

// ============================================
// Custom Cursor Module
// ============================================
const CustomCursor = {
    init() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');

        if (!cursor || !follower) return;

        // Check if it's a touch device
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
            follower.style.display = 'none';
            return;
        }

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor animation
        const animateCursor = () => {
            // Cursor (fast follow)
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            // Follower (slow follow)
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .work-item, .service-card, .nav-toggle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover');
                cursor.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover');
                cursor.style.transform = 'scale(1)';
            });
        });
    }
};

// ============================================
// Navigation Module
// ============================================
const Navigation = {
    init() {
        this.header = document.querySelector('.header');
        this.navToggle = document.querySelector('#navToggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.bindEvents();
    },

    bindEvents() {
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
            this.navToggle.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // Nav links click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
            link.addEventListener('keydown', (e) => this.handleKeyDown(e));
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
    },

    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        this.updateActiveLink();
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },

    toggleMenu() {
        const isActive = this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.navToggle.setAttribute('aria-expanded', isActive);
    },

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    },

    handleNavClick(e) {
        const targetId = e.target.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                this.closeMenu();
            }
        }
    },

    handleKeyDown(e) {
        // Handle Enter and Space keys for nav toggle and links
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (e.target === this.navToggle) {
                this.toggleMenu();
            } else if (e.target.classList.contains('nav-link')) {
                this.handleNavClick(e);
            }
        }
    },

    handleGlobalKeyDown(e) {
        // Close menu with Escape key
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
            this.closeMenu();
        }
    }
};

// ============================================
// Scroll Animations Module
// ============================================
const ScrollAnimations = {
    init() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.createObserver();
    },

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for grid items
                    const delay = entry.target.dataset.delay || index * 100;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.animatedElements.forEach((el, index) => {
            el.dataset.delay = (index % 6) * 100;
            observer.observe(el);
        });
    }
};

// ============================================
// Counter Animation Module
// ============================================
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('[data-count]');
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        this.createObserver();
    },

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
};

// ============================================
// Parallax Effects Module
// ============================================
const ParallaxEffects = {
    init() {
        this.parallaxElements = document.querySelectorAll('.parallax-shape');
        this.floatingShapes = document.querySelectorAll('.shape');
        this.scrollThrottled = false;

        if (this.parallaxElements.length > 0) {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        }

        // Mouse parallax for hero section
        this.initMouseParallax();
    },

    handleScroll() {
        // Throttle scroll events for better performance
        if (!this.scrollThrottled) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                this.parallaxElements.forEach((el, index) => {
                    const speed = (index + 1) * 0.1;
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });

                this.scrollThrottled = false;
            });
            this.scrollThrottled = true;
        }
    }
    },

    initMouseParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            this.floatingShapes.forEach((shape, index) => {
                const speed = (index + 1) * 20;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });

            // Fox animation subtle movement
            const foxAnimation = document.querySelector('.fox-animation');
            if (foxAnimation) {
                foxAnimation.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(${1 + Math.abs(x * 0.05)})`;
            }
        });
    }
};

// ============================================
// Form Handler Module
// ============================================
const FormHandler = {
    init() {
        this.form = document.querySelector('#contactForm');
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('.btn-text').textContent;

        // Animate button
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.querySelector('.btn-text').textContent = 'Sent!';
            submitBtn.style.background = '#27ae60';

            // Reset form
            setTimeout(() => {
                this.form.reset();
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    }
};

// ============================================
// Smooth Scroll for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Marquee Animation (Awards)
// ============================================
const initMarquee = () => {
    const marquee = document.querySelector('.marquee-track');
    if (!marquee) return;

    // Pause on hover
    marquee.addEventListener('mouseenter', () => {
        marquee.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
        marquee.style.animationPlayState = 'running';
    });
};

initMarquee();

// ============================================
// Text Reveal Animation
// ============================================
const TextReveal = {
    init() {
        const revealElements = document.querySelectorAll('.hero-title .word');
        revealElements.forEach((word, index) => {
            word.style.animationDelay = `${0.5 + index * 0.2}s`;
        });
    }
};

TextReveal.init();

// ============================================
// Lazy Load Images (if any)
// ============================================
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, options);

        images.forEach(img => observer.observe(img));
    }
};

LazyLoad.init();

// ============================================
// Magnetic Button Effect
// ============================================
const MagneticButtons = {
    init() {
        const buttons = document.querySelectorAll('.cta-button, .submit-btn');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
};

MagneticButtons.init();

// ============================================
// Tilt Effect for Cards
// ============================================
const TiltEffect = {
    init() {
        const cards = document.querySelectorAll('.service-card, .work-item');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
            });
        });
    }
};

TiltEffect.init();

// ============================================
// Typing Effect for Hero
// ============================================
const TypingEffect = {
    init() {
        // Optional: Add typing effect to hero subtitle
        // Can be enabled if needed
    }
};

console.log('🦊 FoxyMoron Clone - All systems ready!');
