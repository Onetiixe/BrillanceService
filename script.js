// Gestion du header qui disparaît au scroll
let lastScrollTop = 0;
const header = document.querySelector('header');
let isAnimating = false;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas - cacher le header
        header.classList.add('hidden');
    } else {
        // Scroll vers le haut - montrer le header
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
    
    // Animation au scroll
    if (!isAnimating) {
        animateOnScroll();
    }
});

// Assurer que le header est visible au chargement
window.addEventListener('load', function() {
    header.classList.remove('hidden');
    setTimeout(initAnimations, 100);
});

// Gestion du menu mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        
        // Changer l'icône du bouton
        const icon = this.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
    
    // Empêcher la propagation des clics dans le menu
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Gestion du carousel
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Fonction pour changer de slide
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Fonction pour le slide suivant
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Fonction pour le slide précédent
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Événements pour les boutons
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetInterval();
        });
    }

    // Événements pour les dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetInterval();
        });
    });

    // Fonction pour réinitialiser l'intervalle
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Démarrer le carousel automatique
    slideInterval = setInterval(nextSlide, 5000);

    // Pause du carousel au survol
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });

        carouselContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
});

// Gestion du scroll smooth pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#' || targetId === '#accueil') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Calculer la position avec offset pour le header
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fermer le menu mobile si ouvert
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
                document.body.style.overflow = '';
            }
        }
    });
});

// Optimisation des images pour le chargement
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter un attribut loading="lazy" à toutes les images sauf celles du carousel
    const images = document.querySelectorAll('img:not(.slide img)');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Ajouter un fallback si l'image ne se charge pas
        img.addEventListener('error', function() {
            console.log(`L'image ${this.src} n'a pas pu être chargée`);
            this.style.display = 'none';
            const parent = this.parentElement;
            if (parent && parent.classList.contains('gallery-item')) {
                parent.innerHTML = '<div class="gallery-placeholder"><i class="fas fa-exclamation-triangle"></i><p>Image non disponible</p></div>';
                parent.classList.remove('gallery-item');
                parent.classList.add('gallery-placeholder');
            }
        });
    });
});

// Initialiser les animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .gallery-placeholder, .contact-item');
    
    animatedElements.forEach(element => {
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Animer immédiatement les éléments visibles
    animateOnScroll();
}

// Animation au scroll
function animateOnScroll() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    const elements = document.querySelectorAll('.service-card, .gallery-item, .gallery-placeholder, .contact-item');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementPosition < windowHeight - elementVisible) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }
    });
    
    setTimeout(() => {
        isAnimating = false;
    }, 100);
}

// Gestion du formulaire de contact (simulé)
document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ajouter une animation de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Animation pour les boutons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// Gestion du redimensionnement de la fenêtre
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Fermer le menu mobile lors du redimensionnement
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
            document.body.style.overflow = '';
        }
        
        // Recalculer les animations
        animateOnScroll();
    }, 250);
});

// Amélioration de l'accessibilité
document.addEventListener('keydown', function(e) {
    // Échap pour fermer le menu mobile
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }
        document.body.style.overflow = '';
        if (mobileMenuBtn) mobileMenuBtn.focus();
    }
    
    // Navigation au clavier dans le menu
    if (e.key === 'Tab' && navMenu && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Initialisation finale
window.addEventListener('load', function() {
    // Dernière vérification des animations
    setTimeout(animateOnScroll, 500);
    
    // Log de chargement
    console.log('Site BrillanceServices chargé avec succès!');
});