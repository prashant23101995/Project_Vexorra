// ===== VEXORRA 3D PORTFOLIO - MAIN JAVASCRIPT =====

// DOM Elements
const welcomeAnimation = document.getElementById('welcome-animation');
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const productModal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const contactForm = document.querySelector('.contact-form');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
});

// Initialize website
function initializeWebsite() {
    console.log('🏺 Vexorra Portfolio Initialized');
    
    // Hide loading screen immediately and start welcome animation
    hideLoadingScreen();
    startWelcomeAnimation();
    
    // Initialize smooth scrolling for navigation links
    initializeSmoothScrolling();
    
    // Initialize product cards
    initializeProductCards();
}

// ===== WELCOME ANIMATION =====
function startWelcomeAnimation() {
    // Show welcome animation after a brief delay
    setTimeout(() => {
        if (welcomeAnimation) {
            welcomeAnimation.style.display = 'flex';
            
            // After welcome animation completes, transition to logo
            setTimeout(() => {
                transitionWelcomeToLogo();
            }, 3000); // 3 seconds for welcome animation
        }
    }, 100); // Small delay to ensure loading screen is hidden first
}

function transitionWelcomeToLogo() {
    if (welcomeAnimation) {
        // Add transition class
        welcomeAnimation.classList.add('move-to-logo');
        
        // Hide welcome animation and show main content
        setTimeout(() => {
            welcomeAnimation.style.display = 'none';
            // Show navbar with animation
            if (navbar) {
                navbar.style.transform = 'translateY(-100px)';
                navbar.style.opacity = '0';
                setTimeout(() => {
                    navbar.style.transition = 'all 0.8s ease';
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                }, 100);
            }
        }, 800);
    }
}

// ===== LOADING SCREEN =====
function simulateLoading() {
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;
    
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
        }
        progressFill.style.width = progress + '%';
    }, 100);
}

function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== NAVIGATION =====
function setupEventListeners() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', closeProductModal);
    }
    
    // Close modal when clicking outside
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) {
                closeProductModal();
            }
        });
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.style.display === 'block') {
            closeProductModal();
        }
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// Scroll to products function (called from CTA button)
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        const offsetTop = productsSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== PRODUCT FUNCTIONALITY =====
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    const viewButtons = document.querySelectorAll('.view-3d-btn');
    
    // Add click handlers to product cards
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the button directly
            if (!e.target.classList.contains('view-3d-btn')) {
                const modelName = this.dataset.model;
                openProductModal(modelName);
            }
        });
    });
    
    // Add click handlers to view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            e.stopPropagation(); // Prevent card click
            const card = this.closest('.product-card');
            const modelName = card.dataset.model;
            openProductModal(modelName);
        });
    });
}

function openProductModal(modelName) {
    console.log(`Opening 3D viewer for: ${modelName}`);
    
    // Prevent page scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Update modal content based on product
    const productData = getProductData(modelName);
    updateModalContent(productData);
    
    // Show modal
    productModal.style.display = 'block';
    
    // Initialize 3D viewer (placeholder for now)
    initialize3DViewer(modelName);
}

function closeProductModal() {
    productModal.style.display = 'none';
    
    // Restore page scroll
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    
    // Clean up 3D viewer
    cleanup3DViewer();
}

function getProductData(modelName) {
    const products = {
        furniture: {
            title: 'Luxury Furniture Collection',
            description: 'Premium furniture sourcing from China with customization options. We specialize in luxury sofas, dining sets, bedroom furniture, and office collections.',
            details: 'Services: Custom furniture design, Quality inspection, Door-to-door delivery\nSpecialties: Luxury sofas, Dining sets, Bedroom suites, Office furniture\nOrigin: Premium Chinese manufacturers'
        },
        materials: {
            title: 'Premium Building Materials',
            description: 'Imported marble, designer tiles, and premium building materials sourced directly from China. High-quality materials for luxury construction projects.',
            details: 'Products: Imported marble, Designer tiles, Bath fittings, Lighting solutions, Window systems\nServices: Material sourcing, Quality assurance, Logistics\nOrigin: Top Chinese suppliers'
        },
        solutions: {
            title: 'Complete Interior Solutions',
            description: 'End-to-end interior design with door-to-door logistics. From concept to completion, we handle every aspect of your interior project.',
            details: 'Services: Interior design consultation, Project management, Complete logistics, Installation support\nSpecialties: Residential, Commercial, Healthcare, Hospitality\nDelivery: Door-to-door worldwide'
        }
    };
    
    return products[modelName] || products.chair;
}

function updateModalContent(productData) {
    const titleElement = document.getElementById('modal-product-title');
    const descriptionElement = document.getElementById('modal-product-description');
    
    if (titleElement) titleElement.textContent = productData.title;
    if (descriptionElement) titleElement.textContent = productData.description;
}

// ===== 3D VIEWER FUNCTIONALITY =====
function initialize3DViewer(modelName) {
    console.log(`Initializing 3D viewer for: ${modelName}`);
    
    // Placeholder for 3D viewer initialization
    const viewer = document.getElementById('product-3d-viewer');
    if (viewer) {
        viewer.innerHTML = `
            <div style="
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100%; 
                background: linear-gradient(135deg, #F5F5DC, #FAFAFA);
                color: #8B4513;
                font-size: 1.2rem;
                text-align: center;
                padding: 2rem;
            ">
                <div>
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🏺</div>
                    <div>3D Model: ${modelName.toUpperCase()}</div>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.7;">
                        3D viewer will be implemented with Three.js
                    </div>
                </div>
            </div>
        `;
    }
    
    // Setup product controls
    setupProductControls();
}

function cleanup3DViewer() {
    const viewer = document.getElementById('product-3d-viewer');
    if (viewer) {
        viewer.innerHTML = '';
    }
}

function setupProductControls() {
    const rotateBtn = document.getElementById('rotate-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (rotateBtn) {
        rotateBtn.addEventListener('click', function() {
            console.log('Auto rotate toggled');
            this.textContent = this.textContent === 'Auto Rotate' ? 'Stop Rotate' : 'Auto Rotate';
        });
    }
    
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            console.log('View reset');
        });
    }
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            console.log('Fullscreen toggled');
        });
    }
}

// ===== CONTACT FORM =====
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    console.log('Contact form submitted:', { name, email, message });
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// ===== UTILITY FUNCTIONS =====
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

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .about-content, .contact-content');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// ===== GLOBAL FUNCTIONS =====
// Make scrollToProducts available globally for the CTA button
window.scrollToProducts = scrollToProducts;

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    console.log('🚀 Vexorra website fully loaded');
    
    // Log performance metrics
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page load time: ${loadTime}ms`);
    }
});

// ===== SCROLL FUNCTIONS =====
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToFurniture() {
    document.getElementById('furniture').scrollIntoView({
        behavior: 'smooth'
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript error:', e.error);
});

// ===== EXPORT FOR MODULES (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        openProductModal,
        closeProductModal,
        scrollToProducts,
        scrollToFurniture
    };
} 