/* ============================================
   LIBRI MAGNI - Great Books Portfolio
   Main JavaScript - Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMagicCursor();
    initNavigation();
    initScrollProgress();
    initScrollAnimations();
    initSmoothScroll();
    initBackToTop();
    initParallax();
    initScrollTriggeredRoadmap();
    initSidebarHighlight();
    initSectionAnimations();
});

/* ==================== MAGIC CURSOR ==================== */
function initMagicCursor() {
    const cursor = document.getElementById('magicCursor');
    const trailContainer = document.getElementById('cursorTrail');
    
    if (!cursor || !trailContainer) return;
    
    // Check if touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        return;
    }
    
    // Add class to body to hide default cursor
    document.body.classList.add('has-magic-cursor');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail particle
        createTrailParticle(e.clientX, e.clientY, trailContainer);
    });
    
    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .lens-card, .stop-card, .info-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function createTrailParticle(x, y, container) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    container.appendChild(particle);
    
    // Animate and remove
    setTimeout(() => {
        particle.style.transition = 'all 0.5s ease';
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
        
        setTimeout(() => particle.remove(), 500);
    }, 50);
}

/* ==================== NAVIGATION ==================== */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active link based on scroll
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });
    
    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==================== SCROLL PROGRESS ==================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // For lenses section, trigger child animations
                if (entry.target.classList.contains('lenses-section')) {
                    entry.target.querySelectorAll('.lens-card-modern').forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .roadmap-stop, .feature-box, .lens-hex, .about-hero-text, .journey-continue, .lenses-dynamic'
    );
    
    animatedElements.forEach((element) => {
        observer.observe(element);
    });
    
    // Add floating particles to about section
    createAboutParticles();
}

// Create floating particles for about section
function createAboutParticles() {
    const container = document.getElementById('aboutParticles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(201, 162, 39, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==================== BACK TO TOP ==================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==================== SECTION SCROLL ANIMATIONS ==================== */
function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    const footer = document.querySelector('.main-footer');
    const journeyCards = document.querySelectorAll('.journey-card');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Also observe footer
    if (footer) {
        sectionObserver.observe(footer);
    }
    
    // Journey cards individual animation
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    journeyCards.forEach(card => {
        cardObserver.observe(card);
    });
}

/* ==================== PARALLAX EFFECTS ==================== */
function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    const floatingElements = document.querySelectorAll('.float-item');
    const heroBg = document.querySelector('.hero-bg');
    const aboutSection = document.querySelector('.about-section-dynamic');
    const journeySection = document.querySelector('.journey-section');
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Hero content parallax
                if (heroContent && scrolled < windowHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrolled / windowHeight) * 1.2;
                }
                
                // Background parallax
                if (heroBg && scrolled < windowHeight * 1.5) {
                    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
                }
                
                if (aboutBg) {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        const aboutTop = aboutSection.offsetTop;
                        const aboutScroll = scrolled - aboutTop + windowHeight;
                        if (aboutScroll > 0 && aboutScroll < windowHeight * 2) {
                            aboutBg.style.transform = `translateY(${aboutScroll * 0.1}px)`;
                        }
                    }
                }
                
                // Floating elements parallax with rotation
                floatingElements.forEach((el, index) => {
                    const speed = 0.05 + (index * 0.02);
                    const rotation = Math.sin(scrolled * 0.002 + index) * 5;
                    el.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Mouse parallax for floating elements
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        floatingElements.forEach((el, index) => {
            const depth = 1 + (index * 0.5);
            const moveX = mouseX * 20 * depth;
            const moveY = mouseY * 20 * depth;
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

/* ==================== ROADMAP PATH ANIMATION ==================== */
function initRoadmapAnimation() {
    const roadmapPath = document.querySelector('.main-path');
    if (!roadmapPath) return;
    
    const pathLength = roadmapPath.getTotalLength();
    
    roadmapPath.style.strokeDasharray = pathLength;
    roadmapPath.style.strokeDashoffset = pathLength;
    
    window.addEventListener('scroll', () => {
        const roadmapSection = document.getElementById('journey');
        if (!roadmapSection) return;
        
        const sectionTop = roadmapSection.offsetTop;
        const sectionHeight = roadmapSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight + window.innerHeight) {
            const progress = (scrollPosition - sectionTop) / (sectionHeight + window.innerHeight);
            const drawLength = pathLength * Math.min(progress * 1.5, 1);
            roadmapPath.style.strokeDashoffset = pathLength - drawLength;
        }
    });
}

/* ==================== JOURNEY MAP ANIMATIONS ==================== */
function initScrollTriggeredRoadmap() {
    const journeyCards = document.querySelectorAll('.journey-card');
    const beacons = document.querySelectorAll('.journey-beacon');
    const bookTransition = document.getElementById('bookTransition');
    
    if (journeyCards.length === 0) return;

    // Intersection Observer for journey cards
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.2
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe each journey card
    journeyCards.forEach((card) => {
        cardObserver.observe(card);
    });

    // Observe beacons
    beacons.forEach((beacon) => {
        cardObserver.observe(beacon);
    });

    // Add hover tilt effect to cards
    journeyCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            const cover = card.querySelector('.card-cover');
            if (cover) {
                cover.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const cover = card.querySelector('.card-cover');
            if (cover) {
                cover.style.transform = '';
            }
        });
    });

    // Book opening animation on card click
    if (bookTransition) {
        journeyCards.forEach((card) => {
            const link = card.querySelector('.card-enter');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const title = card.querySelector('h3')?.textContent || 'Opening...';
                    
                    // Update the cover title
                    const coverTitle = bookTransition.querySelector('.cover-title');
                    if (coverTitle) {
                        coverTitle.textContent = title;
                    }
                    
                    // Update the cover icon based on the card's icon
                    const cardIcon = card.querySelector('.card-icon i');
                    const coverIcon = bookTransition.querySelector('.cover-icon i');
                    if (cardIcon && coverIcon) {
                        coverIcon.className = cardIcon.className;
                    }
                    
                    // Trigger animation
                    bookTransition.classList.add('active');
                    
                    // Navigate after animation
                    setTimeout(() => {
                        window.location.href = href;
                    }, 1400);
                });
            }
        });
    }
}

/* ==================== LENS CARDS INTERACTION ==================== */
document.querySelectorAll('.lens-card').forEach(card => {
    card.addEventListener('click', function() {
        const lens = this.dataset.lens;
        // Could add filtering or navigation functionality here
        console.log('Selected lens:', lens);
    });
});

/* ==================== TYPING ANIMATION (Optional) ==================== */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ==================== IMAGE LAZY LOADING ==================== */
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

/* ==================== CONSOLE GREETING ==================== */
console.log('%c📚 Libri Magni', 'font-size: 24px; font-weight: bold; color: #c9a227;');
console.log('%cA Literary Journey Through Great Books', 'font-size: 14px; color: #f5e6d3;');
console.log('%c"In libris libertas" — In books, freedom', 'font-size: 12px; font-style: italic; color: #6b7c8b;');

/* ==================== SIDEBAR HIGHLIGHT ==================== */
function initSidebarHighlight() {
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    if (sidebarLinks.length === 0) return;

    // Get all section IDs from sidebar links
    const sectionIds = [];
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            sectionIds.push(href.substring(1));
        }
    });

    function setActiveLink(sectionId) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    function updateActiveLinkOnScroll() {
        let currentSection = sectionIds[0]; // Default to first section
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Check if at bottom of page
        if (scrollPosition + windowHeight >= docHeight - 50) {
            currentSection = sectionIds[sectionIds.length - 1];
        } else {
            // Find the current section based on scroll position
            for (let i = 0; i < sectionIds.length; i++) {
                const section = document.getElementById(sectionIds[i]);
                if (section) {
                    const sectionTop = section.offsetTop - 250;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop) {
                        currentSection = sectionIds[i];
                    }
                }
            }
        }

        setActiveLink(currentSection);
    }

    // Scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLinkOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Click event listener - immediately highlight and smooth scroll
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                // Immediately set active state
                setActiveLink(targetId);
                
                // Smooth scroll to section
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Initial update
    updateActiveLinkOnScroll();
}
