// Matt 프로필 사이트 JavaScript

class ProfileSite {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupNavLinks();
        this.setupScrollAnimations();
    }

    setupMobileMenu() {
        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('hidden');
        });
    }

    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // 모바일 메뉴 닫기
                    this.mobileMenu.classList.add('hidden');

                    // 스무스 스크롤
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('observed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 포트폴리오 카드 관찰
        document.querySelectorAll('.portfolio-card').forEach(card => {
            observer.observe(card);
        });

        // 스킬 카드 관찰
        document.querySelectorAll('.skill-card').forEach(card => {
            observer.observe(card);
        });
    }

    // 추가 유틸리티: 스크롤 위치 감지
    onScroll() {
        const scrollY = window.scrollY;
        const nav = document.querySelector('nav');

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}

// DOM이 로드될 때 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProfileSite();
    });
} else {
    new ProfileSite();
}

// 스크롤 이벤트 리스너
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const nav = document.querySelector('nav');

    if (scrollY > 50) {
        nav.style.borderBottomColor = 'rgba(217, 119, 6, 0.2)';
    } else {
        nav.style.borderBottomColor = 'rgba(51, 65, 85, 1)';
    }
});
