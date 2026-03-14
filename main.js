/* ===== MAIN.JS — cleanKeeper Light Editorial ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CUSTOM CURSOR DOT (Desktop only) =====
    const dot = document.getElementById('cursorGlow');
    if (dot && matchMedia('(pointer:fine)').matches) {
        let mx = 0, my = 0, dx = 0, dy = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
        }, { passive: true });

        (function moveDot() {
            dx += (mx - dx) * .15;
            dy += (my - dy) * .15;
            dot.style.left = dx + 'px';
            dot.style.top = dy + 'px';
            requestAnimationFrame(moveDot);
        })();

        // Expand on hover over interactive elements
        document.querySelectorAll('a, button, .bento-card, .review-card, .process-step').forEach(el => {
            el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
            el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
        });
    }

    // ===== NAVBAR — Scroll state =====
    const nav = document.getElementById('navbar');
    const sticky = document.getElementById('stickyContact');
    let lastY = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Show sticky contact after hero
        if (sticky) {
            sticky.classList.toggle('show', y > 500);
        }

        lastY = y;
    }, { passive: true });

    // ===== MOBILE NAV =====
    const burger = document.getElementById('navBurger');
    const mobileNav = document.getElementById('navMobile');
    const mobileClose = document.getElementById('navMobileClose');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => mobileNav.classList.add('open'));
        if (mobileClose) mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
        mobileNav.querySelectorAll('.nav-mobile-link').forEach(link => {
            link.addEventListener('click', () => mobileNav.classList.remove('open'));
        });
    }

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const markActive = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', markActive, { passive: true });
    markActive();

    // ===== SCROLL REVEAL — Intersection Observer =====
    const reveals = document.querySelectorAll('.slide-up, .slide-right, .slide-left, .scale-in');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => obs.observe(el));

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.trust-num[data-target]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = +el.dataset.target;
                const dur = 1800;
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(ease * target);
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: .5 });
    counters.forEach(c => counterObs.observe(c));

    // ===== SMOOTH ANCHOR SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== CONTACT FORM =====
    const form = document.getElementById('contactForm');
    const formOk = document.getElementById('formOk');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(form);
            const name = form.querySelector('#fName')?.value || '';
            const email = form.querySelector('#fEmail')?.value || '';
            const phone = form.querySelector('#fPhone')?.value || '';
            const service = form.querySelector('#fService')?.value || '';
            const msg = form.querySelector('#fMsg')?.value || '';

            const body = `Name: ${name}%0AEmail: ${email}%0ATelefon: ${phone}%0ADienstleistung: ${service}%0ANachricht: ${msg}`;
            window.open(`mailto:info@cleankeeper.ch?subject=Anfrage von ${name}&body=${body}`);

            form.style.display = 'none';
            if (formOk) formOk.classList.add('show');
        });
    }

    // ===== PARALLAX SUBTLE EFFECT =====
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    if (parallaxBgs.length && matchMedia('(pointer:fine)').matches) {
        window.addEventListener('scroll', () => {
            parallaxBgs.forEach(bg => {
                const rect = bg.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    const offset = (rect.top / window.innerHeight) * 30;
                    bg.style.backgroundPositionY = `calc(50% + ${offset}px)`;
                }
            });
        }, { passive: true });
    }

    // ===== PROCESS STEP — SUBTLE TILT ON HOVER =====
    document.querySelectorAll('.process-step').forEach(step => {
        step.addEventListener('mousemove', e => {
            const rect = step.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - .5;
            const y = (e.clientY - rect.top) / rect.height - .5;
            step.style.transform = `perspective(500px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
        });
        step.addEventListener('mouseleave', () => {
            step.style.transform = '';
        });
    });

});
