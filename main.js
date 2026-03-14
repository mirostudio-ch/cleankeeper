/* ===== MAIN.JS — cleanKeeper Premium Redesign ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CURSOR GLOW (Desktop only) =====
    const glow = document.getElementById('cursorGlow');
    if (glow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        (function animGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animGlow);
        })();
    }

    // ===== CARD MOUSE TRACKING (inner glow follows cursor) =====
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
            card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
        });
    });

    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    const animEls = document.querySelectorAll('.slide-up,.slide-right,.slide-left,.scale-in');
    const animObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => animObs.observe(el));

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const sticky = document.getElementById('stickyContact');
    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        if (sticky) sticky.classList.toggle('show', y > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== ACTIVE NAV LINK =====
    const sects = document.querySelectorAll('section[id],header[id]');
    const nLinks = document.querySelectorAll('.nav-link');
    function updateNav() {
        let cur = '';
        sects.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
        nLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
    }
    window.addEventListener('scroll', updateNav, { passive: true });

    // ===== MOBILE NAV =====
    const burger = document.getElementById('navBurger');
    const mob = document.getElementById('navMobile');
    const mobClose = document.getElementById('navMobileClose');
    let savedY = 0;
    function openMob() {
        savedY = window.scrollY;
        mob.classList.add('open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedY}px`;
        document.body.style.width = '100%';
    }
    function closeMob() {
        mob.classList.remove('open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, savedY);
    }
    if (burger) burger.addEventListener('click', openMob);
    if (mobClose) mobClose.addEventListener('click', closeMob);
    document.querySelectorAll('.nav-mobile-link').forEach(l => l.addEventListener('click', closeMob));

    // ===== COUNTER ANIMATION =====
    const nums = document.querySelectorAll('.trust-num');
    let started = false;
    const cObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !started) {
                started = true;
                nums.forEach(n => {
                    const t = parseInt(n.dataset.target);
                    const dur = 2000;
                    const inc = t / (dur / 16);
                    let c = 0;
                    (function up() {
                        c += inc;
                        if (c < t) { n.textContent = Math.floor(c); requestAnimationFrame(up); }
                        else n.textContent = t;
                    })();
                });
            }
        });
    }, { threshold: 0.5 });
    const ts = document.querySelector('.trust-strip');
    if (ts) cObs.observe(ts);

    // ===== HORIZONTAL REVIEW DRAG SCROLL =====
    const track = document.getElementById('reviewScroll');
    if (track) {
        let isDown = false, startX, scrollL;
        track.addEventListener('mousedown', e => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollL = track.scrollLeft;
        });
        track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = ''; });
        track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = ''; });
        track.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            track.scrollLeft = scrollL - (x - startX) * 1.5;
        });
    }

    // ===== CONTACT FORM =====
    const form = document.getElementById('contactForm');
    const ok = document.getElementById('formOk');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Wird gesendet…</span>';
            btn.disabled = true;
            setTimeout(() => {
                form.style.display = 'none';
                ok.classList.add('show');
            }, 1400);
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // ===== PARALLAX FLOAT CARD =====
    const floatCards = document.querySelectorAll('.float-up');
    window.addEventListener('scroll', () => {
        floatCards.forEach(c => {
            const rect = c.getBoundingClientRect();
            const offset = (window.innerHeight - rect.top) * 0.04;
            c.style.transform = `translateY(${-offset}px)`;
        });
    }, { passive: true });

    // ===== TILT EFFECT FOR PROCESS STEPS =====
    document.querySelectorAll('.process-step').forEach(step => {
        step.addEventListener('mousemove', e => {
            const rect = step.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            step.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        });
        step.addEventListener('mouseleave', () => {
            step.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
            step.style.transition = 'transform .4s ease';
        });
        step.addEventListener('mouseenter', () => {
            step.style.transition = 'transform .1s ease';
        });
    });

    // ===== TYPEWRITER EFFECT FOR HERO H1 (subtle shimmer) =====
    const heroH1 = document.querySelector('.hero-h1');
    if (heroH1) {
        heroH1.style.opacity = '0';
        heroH1.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroH1.style.transition = 'opacity .8s ease, transform .8s ease';
            heroH1.style.opacity = '1';
            heroH1.style.transform = 'translateY(0)';
        }, 300);
    }

});
