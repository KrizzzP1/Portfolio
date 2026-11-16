// Small extras for the page. Everything still works with JavaScript turned off.
(() => {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Solid header and the back-to-top button once you scroll down
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');
    const onScroll = () => {
        navbar.classList.toggle('sticky', window.scrollY > 60);
        scrollTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Phone menu: the button opens it; a link, Escape or a tap outside closes it
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.getElementById('nav-links');
    const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
    const setMenu = (open, returnFocus = false) => {
        navLinks.classList.toggle('open', open);
        menuBtn.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        if (!open && returnFocus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(!isOpen()));
    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) setMenu(false, true);
    });
    document.addEventListener('click', (e) => {
        if (isOpen() && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 601px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });

    if (!('IntersectionObserver' in window)) return;

    // Underline the menu link for the section you're reading
    const links = [...navLinks.querySelectorAll('a[href^="#"]')];
    const sections = ['#hero', ...links.map((a) => a.getAttribute('href'))]
        .map((id) => document.querySelector(id))
        .filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => {
                const current = a.getAttribute('href') === '#' + entry.target.id;
                a.classList.toggle('active', current);
                if (current) a.setAttribute('aria-current', 'location');
                else a.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));

    // Fade cards in as they scroll into view (skipped if you've asked for less motion)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(
        '.about-text, .about-cards, .lang-card, .project-card, .edu-card, .contact-layout'
    ).forEach((el) => {
        el.classList.add('fade-in');
        reveal.observe(el);
    });
})();
