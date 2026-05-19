/* ========================================
   Phaidros Healthcare — Interactive Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initParticles();
    initQuiz();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
});

/* Navbar scroll effect */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
    
    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
}

/* Floating particles */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.3 + 0.1;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            opacity: ${opacity};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(particle);
    }
}

/* Private Label Quiz */
function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    const answers = {};
    let currentStep = 1;
    
    // Handle option clicks
    quizContainer.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => {
            const step = option.closest('.quiz-step');
            const stepNum = parseInt(step.dataset.step);
            const value = option.dataset.value;
            
            // Remove selected from siblings
            step.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Store answer
            answers[`question${stepNum}`] = {
                value: value,
                text: option.querySelector('.option-text').textContent
            };
            
            // Small delay for visual feedback, then advance
            setTimeout(() => {
                advanceQuiz(stepNum);
            }, 400);
        });
    });
    
    function advanceQuiz(fromStep) {
        const currentStepEl = quizContainer.querySelector(`[data-step="${fromStep}"]`);
        const nextStepEl = quizContainer.querySelector(`[data-step="${fromStep + 1}"]`);
        
        if (currentStepEl) {
            currentStepEl.classList.remove('active');
        }
        
        if (nextStepEl) {
            nextStepEl.classList.add('active');
            currentStep = fromStep + 1;
        } else {
            // Show results
            showResults();
        }
    }
    
    function showResults() {
        const resultsStep = quizContainer.querySelector('[data-step="results"]');
        const summaryEl = document.getElementById('resultsSummary');
        
        if (!resultsStep || !summaryEl) return;
        
        // Hide all steps
        quizContainer.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
        
        // Generate recommendations based on answers
        const recommendations = generateRecommendations(answers);
        
        summaryEl.innerHTML = `
            ${Object.entries(answers).map(([key, answer]) => `
                <div class="summary-item">
                    <span class="summary-label">${getQuestionLabel(key)}</span>
                    <span class="summary-value">${answer.text}</span>
                </div>
            `).join('')}
            <div class="recommendation-box">
                <h5>💡 Recommended Next Steps</h5>
                <p>${recommendations}</p>
            </div>
        `;
        
        resultsStep.classList.add('active');
    }
    
    function getQuestionLabel(key) {
        const labels = {
            question1: 'Product Category',
            question2: 'Therapeutic Area',
            question3: 'Project Stage',
            question4: 'Target Market',
            question5: 'Volume'
        };
        return labels[key] || key;
    }
    
    function generateRecommendations(answers) {
        const category = answers.question1?.value;
        const stage = answers.question3?.value;
        const market = answers.question4?.value;
        
        let recs = [];
        
        // Stage-based recommendations
        if (stage === 'idea' || stage === 'concept') {
            recs.push('We recommend starting with a product concept consultation to refine your idea and assess market viability.');
        } else if (stage === 'formula') {
            recs.push('With your formula selected, we can move quickly into manufacturing feasibility and regulatory assessment.');
        } else if (stage === 'ready') {
            recs.push('You are ready for production! We can provide GMP-certified manufacturing and logistics immediately.');
        }
        
        // Market-based recommendations
        if (market === 'asia-pacific') {
            recs.push('Our Singapore headquarters is ideally positioned for APAC market entry with established regulatory pathways.');
        } else if (market === 'global') {
            recs.push('We will design a phased global rollout strategy, leveraging our network of regional distribution partners.');
        }
        
        // Category-specific
        if (category === 'food-supplements') {
            recs.push('For food supplements, we offer a wide range of formats: tablets, capsules, softgels, powders, and effervescent.');
        } else if (category === 'medical-devices') {
            recs.push('Medical devices require specific regulatory approaches — our team will guide you through CE marking and local registrations.');
        }
        
        return recs.join(' ');
    }
    
    // Restart quiz
    const restartBtn = document.getElementById('restartQuiz');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            // Clear answers
            Object.keys(answers).forEach(key => delete answers[key]);
            currentStep = 1;
            
            // Hide results, show first step
            quizContainer.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
            quizContainer.querySelector('[data-step="1"]').classList.add('active');
            
            // Remove selected states
            quizContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        });
    }
}

/* Contact Form */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        // Show loading state
        btn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.style.display = 'block';
        
        // Simulate form submission
        setTimeout(() => {
            btnText.textContent = 'Message Sent!';
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
            btn.style.background = 'linear-gradient(135deg, #14a085, #0d7377)';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                btn.disabled = false;
                btnText.textContent = 'Send Message';
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

/* Scroll Animations */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatables = document.querySelectorAll(
        '.about-card, .service-card, .partner-card, .product-category, .focus-item, .pipeline-stage'
    );
    
    animatables.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
    });
    
    // Add animation class handler
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

/* Smooth scroll for anchor links */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
