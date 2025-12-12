/**
 * Filmtech Academy Landing Page - JavaScript
 * Handles interactions, animations, and carousel functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initFAQAccordion();
    initTestimonialsCarousel();
    initSmoothScroll();
    initScrollAnimations();
    initCarouselDots();
});

/**
 * FAQ Accordion Functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Testimonials Carousel
 */
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Get card width including gap
    function getCardWidth() {
        const card = cards[0];
        if (!card) return 0;
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.gap) || 24;
        return card.offsetWidth + gap;
    }
    
    function scrollToIndex(index) {
        const maxIndex = cards.length - getVisibleCards();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const scrollAmount = currentIndex * getCardWidth();
        track.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        updateDots();
    }
    
    function getVisibleCards() {
        const containerWidth = track.parentElement.offsetWidth;
        const cardWidth = getCardWidth();
        return Math.floor(containerWidth / cardWidth) || 1;
    }
    
    prevBtn.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
    });
    
    // Update current index on manual scroll
    track.addEventListener('scroll', debounce(() => {
        const cardWidth = getCardWidth();
        currentIndex = Math.round(track.scrollLeft / cardWidth);
        updateDots();
    }, 100));
}

/**
 * Initialize Carousel Dots
 */
function initCarouselDots() {
    const track = document.querySelector('.testimonials-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || !dotsContainer) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    const numDots = Math.ceil(cards.length / getVisibleCards());
    
    function getVisibleCards() {
        const containerWidth = track.parentElement.offsetWidth;
        const card = cards[0];
        if (!card) return 1;
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.gap) || 24;
        const cardWidth = card.offsetWidth + gap;
        return Math.floor(containerWidth / cardWidth) || 1;
    }
    
    // Create dots
    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            const style = window.getComputedStyle(track);
            const gap = parseInt(style.gap) || 24;
            const cardWidth = cards[0].offsetWidth + gap;
            
            track.scrollTo({
                left: i * cardWidth,
                behavior: 'smooth'
            });
        });
        
        dotsContainer.appendChild(dot);
    }
    
    // Style for dots
    const style = document.createElement('style');
    style.textContent = `
        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--color-border);
            border: none;
            cursor: pointer;
            transition: var(--transition-base);
        }
        .carousel-dot:hover {
            background: var(--color-text-muted);
        }
        .carousel-dot.active {
            background: var(--color-neon);
            box-shadow: 0 0 10px var(--color-neon-glow);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Update carousel dots based on current position
 */
function updateDots() {
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const cards = track.querySelectorAll('.testimonial-card');
    
    if (!track || !dots.length || !cards.length) return;
    
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 24;
    const cardWidth = cards[0].offsetWidth + gap;
    const currentIndex = Math.round(track.scrollLeft / cardWidth);
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = 20;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animate-on-scroll class to elements
    const animateElements = [
        '.journey-content',
        '.journey-visual',
        '.method-text',
        '.method-visual',
        '.pillar-card',
        '.guarantee-box',
        '.faq-content',
        '.pricing-card',
        '.proof-stats'
    ];
    
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });
    
    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Stagger animation for pillar cards
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Stagger animation for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Track CTA button clicks (for analytics integration)
 */
document.querySelectorAll('.pricing-cta, .cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const plan = this.dataset.checkout || 'general';
        
        // Log for debugging (replace with actual analytics)
        console.log('CTA Clicked:', {
            plan: plan,
            text: this.textContent.trim(),
            timestamp: new Date().toISOString()
        });
        
        // If it's a checkout button, you could add tracking here
        // gtag('event', 'click', { 'event_category': 'CTA', 'event_label': plan });
    });
});

/**
 * Video placeholder click handler
 * Replace with actual video modal/player when VSL is ready
 */
const vslPlaceholder = document.querySelector('.vsl-placeholder');
if (vslPlaceholder) {
    vslPlaceholder.addEventListener('click', function() {
        // When video is ready, replace this with actual video embed
        console.log('VSL placeholder clicked - integrate video player here');
        
        // Example: You could open a modal with the video
        // openVideoModal('VIDEO_URL_HERE');
    });
}

/**
 * Add loading state to buttons on click
 */
document.querySelectorAll('.pricing-cta').forEach(button => {
    button.addEventListener('click', function(e) {
        // If it's an external link (WhatsApp), don't add loading state
        if (this.getAttribute('target') === '_blank') return;
        
        // For checkout buttons, add brief loading state
        if (this.dataset.checkout) {
            this.classList.add('loading');
            this.innerHTML = '<span>Carregando...</span>';
            
            // Reset after 2 seconds if no redirect happened
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = 'COMPRAR AGORA';
            }, 2000);
        }
    });
});
